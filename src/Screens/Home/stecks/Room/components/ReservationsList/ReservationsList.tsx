import React from "react";
import { Alert, Linking, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { styles } from "./reservationsList.styles";
import { FirebaseRoom } from "../../../../../../store/store_service_type";
import { Reservation } from "../../../../../../services/type";
import { getRemainingDays } from "../../../../../../fun/calculatoionTime";
import { useRoomsStore } from "../../../../../../store/rooms_store";

type Props = {
   room: FirebaseRoom;
   onEditReservation?: (reservation: Reservation) => void;
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

export const ReservationsList = ({ room, onEditReservation }: Props) => {
   const { deleteReservationFromRoom } = useRoomsStore();
   const reservations = room.reservations || [];

   const handleDelete = (reservationId: string) => {
      Alert.alert("ჯავშნის წაშლა", "ნამდვილად გინდა ჯავშნის წაშლა?", [
         { text: "არა", style: "cancel" },
         {
            text: "წაშლა",
            style: "destructive",
            onPress: () =>
               deleteReservationFromRoom(room.firebaseId, reservationId),
         },
      ]);
   };

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

               <View style={styles.phoneRow}>
                  <Text style={styles.text}>ტელეფონი: </Text>
                  {reservation.guestPhone ? (
                     <TouchableOpacity
                        onPress={() => callPhone(reservation.guestPhone)}
                     >
                        <Text style={styles.phoneText}>
                           {reservation.guestPhone}
                        </Text>
                     </TouchableOpacity>
                  ) : (
                     <Text style={styles.text}>-</Text>
                  )}
               </View>

               <Text style={styles.text}>
                  ჯავშნამდე დარჩა: {getRemainingDays(reservation.startDate)} დღე
               </Text>
               <Text style={styles.text}>
                  {`ჯავშნის ხანგრძლივობა: ${reservation.days} დღე`}
               </Text>

               <Text style={styles.price}>{reservation.totalPrice} ₾</Text>

               <Text style={styles.paymentText}>
                  {reservation.isPaid ? "გადახდილია" : "გადასახდელია"}
               </Text>

               <View style={styles.actionsRow}>
                  <TouchableOpacity
                     style={styles.editButton}
                     onPress={() => onEditReservation?.(reservation)}
                  >
                     <Ionicons name="create-outline" size={18} color="#fff" />
                     <Text style={styles.buttonText}>განახლება</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                     style={styles.deleteButton}
                     onPress={() => handleDelete(reservation.id)}
                  >
                     <Ionicons name="trash-outline" size={18} color="#fff" />
                     <Text style={styles.buttonText}>წაშლა</Text>
                  </TouchableOpacity>
               </View>
            </View>
         ))}
      </View>
   );
};
