import React from "react";
import { Text, View } from "react-native";

import { styles } from "./roomInfoCard.styles";
import { FirebaseRoom } from "../../../../../../store/store_service_type";
import { getRemainingDays } from "../../../../../../fun/calculatoionTime";

type Props = {
   room: FirebaseRoom;
};

const formatDate = (value?: string) => {
   if (!value) return "-";
   return new Date(value).toISOString().split("T")[0];
};

export const RoomInfoCard = ({ room }: Props) => {
   const stay = room.currentStay;

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
            </>
         )}

         <View style={styles.divider} />

         <Text style={styles.subTitle}>ანალიტიკა</Text>

         <View style={styles.row}>
            <Text style={styles.label}>შემოსავალი</Text>
            <Text style={styles.value}>{room.totalIncome || 0} ₾</Text>
         </View>

         <View style={styles.row}>
            <Text style={styles.label}>ჯავშნები</Text>
            <Text style={styles.value}>{room.totalReservations || 0}</Text>
         </View>

         <View style={styles.row}>
            <Text style={styles.label}>დაკავებული დღეები</Text>
            <Text style={styles.value}>{room.totalOccupiedDays || 0}</Text>
         </View>
      </View>
   );
};
