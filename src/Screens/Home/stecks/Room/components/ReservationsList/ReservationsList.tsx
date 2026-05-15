import React from "react";
import { Text, View } from "react-native";
import { styles } from "./reservationsList.styles";
import { FirebaseRoom } from "../../../../../../store/store_service_type";
import { getRemainingDays } from "../../../../../../fun/calculatoionTime";

type Props = {
   room: FirebaseRoom;
};

const formatDate = (value?: string) => {
   if (!value) return "-";
   return new Date(value).toISOString().split("T")[0];
};

export const ReservationsList = ({ room }: Props) => {
   const reservations = room.reservations || [];

   return (
      <View style={styles.card}>
         <Text style={styles.title}>ჯავშნები</Text>

         {reservations.length === 0 && (
            <Text style={styles.emptyText}>ჯავშანი არ არის</Text>
         )}

         {reservations.map((reservation) => (
            <View key={reservation.id} style={styles.reservationCard}>
               <Text style={styles.guestName}>
                  {reservation.guestName || "სტუმარი"}
               </Text>

               <Text style={styles.text}>
                  დაწყება: {formatDate(reservation.startDate)}
               </Text>

               <Text style={styles.text}>
                  დასრულება: {formatDate(reservation.endDate)}
               </Text>

               <Text style={styles.text}>
                  ჯავშნამდე დარჩა: {getRemainingDays(reservation.startDate)} დღე
               </Text>

               <Text style={styles.price}>{reservation.totalPrice} ₾</Text>
            </View>
         ))}
      </View>
   );
};
