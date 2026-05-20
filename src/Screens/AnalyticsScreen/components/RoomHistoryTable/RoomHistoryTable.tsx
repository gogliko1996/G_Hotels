import { useState } from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { StayHistory } from "../../../../services/type";
import { styles } from "./roomHistoryTable.styles";

type Props = {
   history: StayHistory[];
};

const toDate = (value: any) => {
   if (!value) return null;
   if (typeof value.toDate === "function") return value.toDate();
   if (typeof value.seconds === "number") {
      return new Date(value.seconds * 1000);
   }

   const date = new Date(value);
   return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value: any) => {
   const date = toDate(value);
   if (!date) return "-";

   return date.toISOString().split("T")[0];
};

const callPhone = (phone?: string) => {
   const phoneNumber = phone?.trim();
   if (!phoneNumber) return;

   Linking.openURL(`tel:${phoneNumber}`);
};

export const RoomHistoryTable = ({ history }: Props) => {
   const [historyOpen, setHistoryOpen] = useState(false);
   const totalAmount = history.reduce(
      (sum, item) => sum + Number(item.totalAmount || 0),
      0,
   );
   const paidAmount = history.reduce(
      (sum, item) => sum + Number(item.paidAmount || 0),
      0,
   );
   const remainingAmount = history.reduce(
      (sum, item) => sum + Number(item.remainingAmount || 0),
      0,
   );
   const totalDays = history.reduce(
      (sum, item) => sum + Number(item.daysStayed || 0),
      0,
   );

   return (
      <View style={styles.card}>
         <Text style={styles.title}>მობინადრეების ისტორია</Text>

         <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
               <Text style={styles.summaryLabel}>ჩანაწერები</Text>
               <Text style={styles.summaryValue}>{history.length}</Text>
            </View>

            <View style={styles.summaryItem}>
               <Text style={styles.summaryLabel}>სულ თანხა</Text>
               <Text style={styles.summaryValue}>{totalAmount} ₾</Text>
            </View>

            <View style={styles.summaryItem}>
               <Text style={styles.summaryLabel}>გადახდილი</Text>
               <Text style={styles.paidValue}>{paidAmount} ₾</Text>
            </View>

            <View style={styles.summaryItem}>
               <Text style={styles.summaryLabel}>დარჩენილი</Text>
               <Text style={styles.unpaidValue}>{remainingAmount} ₾</Text>
            </View>
         </View>

         <TouchableOpacity
            activeOpacity={0.85}
            style={styles.historyToggle}
            onPress={() => setHistoryOpen((value) => !value)}
         >
            <Text style={styles.totalDays}>სრული დღეები: {totalDays}</Text>
            <Ionicons
               name={historyOpen ? "chevron-up" : "chevron-down"}
               size={22}
               color="#2563eb"
            />
         </TouchableOpacity>

         {historyOpen && (
            <>
               {history.length === 0 ? (
                  <Text style={styles.emptyText}>ისტორია ჯერ არ არის</Text>
               ) : (
                  history.map((item) => (
                     <View key={item.id} style={styles.historyRow}>
                        <View style={styles.rowHeader}>
                           <Text style={styles.roomName}>
                              {item.roomName || "-"}
                           </Text>
                           <Text
                              style={
                                 item.isPaid
                                    ? styles.statusPaid
                                    : styles.statusUnpaid
                              }
                           >
                              {item.isPaid ? "გადახდილია" : "გადასახდელია"}
                           </Text>
                        </View>

                        <Text style={styles.guestName}>
                           სტუმარი: {item.guestName || "-"}
                        </Text>

                        <View style={styles.infoGrid}>
                           <Text style={styles.infoText}>
                              შესვლა: {formatDate(item.checkIn)}
                           </Text>
                           <Text style={styles.infoText}>
                              გასვლა: {formatDate(item.checkOut)}
                           </Text>
                           <Text style={styles.infoText}>
                              დღეები: {item.daysStayed || 0}
                           </Text>
                           <Text style={styles.infoText}>
                              ერთი დღე: {item.pricePerDay || 0} ₾
                           </Text>
                        </View>

                        <View style={styles.amountRow}>
                           <Text style={styles.amountText}>
                              სულ: {item.totalAmount || 0} ₾
                           </Text>
                           <Text style={styles.paidText}>
                              გადახდილი: {item.paidAmount || 0} ₾
                           </Text>
                           <Text style={styles.remainingText}>
                              დარჩენილი: {item.remainingAmount || 0} ₾
                           </Text>
                        </View>

                        <View style={styles.footerRow}>
                           <Text style={styles.roomId}>
                              ID: {item.roomId || "-"}
                           </Text>

                           {item.guestPhone ? (
                              <TouchableOpacity
                                 onPress={() => callPhone(item.guestPhone)}
                              >
                                 <Text style={styles.phoneText}>
                                    {item.guestPhone}
                                 </Text>
                              </TouchableOpacity>
                           ) : (
                              <Text style={styles.roomId}>ტელ: -</Text>
                           )}
                        </View>
                     </View>
                  ))
               )}
            </>
         )}
      </View>
   );
};
