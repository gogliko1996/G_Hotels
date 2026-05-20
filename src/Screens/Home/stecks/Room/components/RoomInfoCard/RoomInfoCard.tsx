import React from "react";
import { Alert, Linking, Text, TouchableOpacity, View } from "react-native";

import { styles } from "./roomInfoCard.styles";
import { FirebaseRoom } from "../../../../../../store/store_service_type";
import { getRemainingDays } from "../../../../../../fun/calculatoionTime";
import { useRoomsStore } from "../../../../../../store/rooms_store";

type Props = {
   room: FirebaseRoom;
};

const formatDate = (value?: string) => {
   if (!value) return "-";
   return new Date(value).toISOString().split("T")[0];
};

const callPhone = (phone?: string) => {
   const phoneNumber = phone?.trim();
   if (!phoneNumber) return;

   Linking.openURL(`tel:${phoneNumber}`);
};

export const RoomInfoCard = ({ room }: Props) => {
   const stay = room.currentStay;
   const { updateStayInRoom } = useRoomsStore();

   const handleConfirmPayment = () => {
      if (!stay || stay.isPaid) return;

      Alert.alert(
         "თანხის გადახდა",
         `გადასახდელია: ${stay.totalPrice} ₾\nნამდვილად მოგცათ თანხა?`,
         [
            {
               text: "არა",
               style: "cancel",
            },
            {
               text: "კი",
               onPress: async () => {
                  await updateStayInRoom(room.firebaseId, {
                     ...stay,
                     isPaid: true,
                  });
               },
            },
         ],
      );
   };

   return (
      <View style={styles.card}>
         <Text style={styles.title}>ოთახის ინფორმაცია</Text>

         <View style={styles.row}>
            <Text style={styles.label}>ოთახი</Text>
            <Text style={styles.value}>{room.room}</Text>
         </View>

         <View style={styles.row}>
            <Text style={styles.label}>სექცია</Text>
            <Text style={styles.value}>{room.sector}</Text>
         </View>

         <View style={styles.row}>
            <Text style={styles.label}>სტატუსი</Text>
            <Text style={styles.value}>{room.status}</Text>
         </View>

         {stay && (
            <>
               <View style={styles.divider} />

               <Text style={styles.subTitle}>მობინადრე</Text>

               <View style={styles.row}>
                  <Text style={styles.label}>სახელი</Text>
                  <Text style={styles.value}>{stay.guestName || "-"}</Text>
               </View>

               <View style={styles.row}>
                  <Text style={styles.label}>ტელეფონი</Text>
                  {stay.guestPhone ? (
                     <TouchableOpacity onPress={() => callPhone(stay.guestPhone)}>
                        <Text style={styles.phoneText}>{stay.guestPhone}</Text>
                     </TouchableOpacity>
                  ) : (
                     <Text style={styles.value}>-</Text>
                  )}
               </View>

               <View style={styles.row}>
                  <Text style={styles.label}>შესვლა</Text>
                  <Text style={styles.value}>
                     {formatDate(stay.checkInDate)}
                  </Text>
               </View>

               <View style={styles.row}>
                  <Text style={styles.label}>გასვლა</Text>
                  <Text style={styles.value}>
                     {formatDate(stay.checkOutDate)}
                  </Text>
               </View>

               <View style={styles.row}>
                  <Text style={styles.label}>დარჩა</Text>
                  <Text style={styles.value}>
                     {getRemainingDays(stay.checkOutDate)} დღე
                  </Text>
               </View>

               <View style={styles.row}>
                  <Text style={styles.label}>ერთი დღე</Text>
                  <Text style={styles.value}>{stay.oneDayPrice} ₾</Text>
               </View>

               <View style={styles.row}>
                  <Text style={styles.label}>სულ</Text>
                  <Text style={styles.value}>{stay.totalPrice} ₾</Text>
               </View>

               <View style={styles.row}>
                  <Text style={styles.label}>გადახდა</Text>
                  {stay.isPaid ? (
                     <Text style={styles.paidText}>გადახდილია</Text>
                  ) : (
                     <TouchableOpacity onPress={handleConfirmPayment}>
                        <Text style={styles.unpaidText}>გადასახდელია</Text>
                     </TouchableOpacity>
                  )}
               </View>
            </>
         )}
      </View>
   );
};
