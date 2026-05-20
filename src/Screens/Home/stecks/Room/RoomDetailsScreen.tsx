import React, { useEffect, useState } from "react";
import {
   ActivityIndicator,
   Keyboard,
   Modal,
   Pressable,
   ScrollView,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { RoomImageHeader } from "./components/RoomImageHeader/RoomImageHeader";
import { RoomInfoCard } from "./components/RoomInfoCard/RoomInfoCard";
import { RoomActions } from "./components/RoomActions/RoomActions";
import { ReservationsList } from "./components/ReservationsList/ReservationsList";
import { OccupyRoomModal } from "./components/OccupyRoomModal/OccupyRoomModal";
import { ReservationModal } from "./components/ReservationModal/ReservationModal";

import { styles } from "./RoomDetailsScreen.styles";
import { useRoomsStore } from "../../../../store/rooms_store";
import { Reservation } from "../../../../services/type";

export const RoomDetailsScreen: React.FC = () => {
   const { id } = useLocalSearchParams<{ id: string }>();

   const {
      loading,
      room,
      rooms,
      listenFirebaseRooms,
      stopListenFirebaseRooms,
      getRoomById,
      finishStayInRoom,
   } = useRoomsStore();

   const [occupyModalOpen, setOccupyModalOpen] = useState(false);
   const [reservationModalOpen, setReservationModalOpen] = useState(false);
   const [finishModalOpen, setFinishModalOpen] = useState(false);
   const [finishDays, setFinishDays] = useState("");
   const [finishTotal, setFinishTotal] = useState("");
   const [finishIsPaid, setFinishIsPaid] = useState(false);
   const [editingReservation, setEditingReservation] =
      useState<Reservation | null>(null);

   useEffect(() => {
      listenFirebaseRooms();

      return () => {
         stopListenFirebaseRooms();
      };
   }, []);

   useEffect(() => {
      if (!loading && id) {
         getRoomById(id);
      }
   }, [id, loading, rooms]);

   const handleOpenCreateReservation = () => {
      setEditingReservation(null);
      setReservationModalOpen(true);
   };

   const handleOpenEditReservation = (reservation: Reservation) => {
      setEditingReservation(reservation);
      setReservationModalOpen(true);
   };

   const handleCloseReservationModal = () => {
      setReservationModalOpen(false);
      setEditingReservation(null);
   };

   const handleFinishStay = () => {
      if (!room) return;
      if (!room.currentStay) return;

      setFinishDays(String(room.currentStay.days || ""));
      setFinishTotal(
         String(
            Number(room.currentStay.days || 0) *
               Number(room.currentStay.oneDayPrice || 0),
         ),
      );
      setFinishIsPaid(Boolean(room.currentStay.isPaid));
      setFinishModalOpen(true);
   };

   const handleFinishDaysChange = (value: string) => {
      setFinishDays(value);

      const daysStayed = Number(value);
      const pricePerDay = Number(room?.currentStay?.oneDayPrice || 0);

      if (daysStayed >= 0 && pricePerDay >= 0) {
         setFinishTotal(String(daysStayed * pricePerDay));
      }
   };

   const handleConfirmFinishStay = async () => {
      if (!room?.currentStay) return;

      const daysStayed = Number(finishDays);
      const totalAmount = Number(finishTotal);

      if (daysStayed <= 0 || totalAmount < 0) {
         return;
      }

      await finishStayInRoom(room.firebaseId, {
         daysStayed,
         totalAmount,
         isPaid: finishIsPaid,
      });

      setFinishModalOpen(false);
   };

   if (loading) {
      return (
         <SafeAreaView style={styles.safe}>
            <View style={styles.center}>
               <ActivityIndicator size="large" color="#2563eb" />
               <Text style={styles.loadingText}>იტვირთება...</Text>
            </View>
         </SafeAreaView>
      );
   }

   if (!room) {
      return (
         <SafeAreaView style={styles.safe}>
            <View style={styles.center}>
               <Text style={styles.notFoundText}>ოთახი ვერ მოიძებნა</Text>
            </View>
         </SafeAreaView>
      );
   }

   return (
      <SafeAreaView style={styles.safe}>
         <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
         >
            <RoomImageHeader room={room} />

            <RoomInfoCard room={room} />

            <RoomActions
               room={room}
               onOccupyPress={() => setOccupyModalOpen(true)}
               onReservationPress={handleOpenCreateReservation}
               onFinishPress={handleFinishStay}
            />

            <ReservationsList
               room={room}
               onEditReservation={handleOpenEditReservation}
            />
         </ScrollView>

         <OccupyRoomModal
            visible={occupyModalOpen}
            room={room}
            onClose={() => setOccupyModalOpen(false)}
         />

         <ReservationModal
            key={editingReservation?.id || "create-reservation"}
            visible={reservationModalOpen}
            room={room}
            reservation={editingReservation}
            onClose={handleCloseReservationModal}
         />

         <Modal visible={finishModalOpen} transparent animationType="fade">
            <Pressable onPress={Keyboard.dismiss} style={styles.modalOverlay}>
               <View style={styles.finishModal}>
                  <Text style={styles.modalTitle}>მობინადრის წაშლა</Text>

                  <Text style={styles.modalText}>
                     იყო {room.currentStay?.days || 0} დღე. ერთი დღე{" "}
                     {room.currentStay?.oneDayPrice || 0} ₾.
                  </Text>

                  {!finishIsPaid && (
                     <Text style={styles.unpaidWarning}>
                        თანხა აქვს გადასახდელი: {finishTotal || 0} ₾
                     </Text>
                  )}

                  <View style={styles.inputBox}>
                     <TextInput
                        style={styles.input}
                        placeholder="რამდენი დღე იყო"
                        placeholderTextColor="grey"
                        keyboardType="numeric"
                        value={finishDays}
                        onChangeText={handleFinishDaysChange}
                     />
                  </View>

                  <View style={styles.inputBox}>
                     <TextInput
                        style={styles.input}
                        placeholder="სულ თანხა"
                        placeholderTextColor="grey"
                        keyboardType="numeric"
                        value={finishTotal}
                        onChangeText={setFinishTotal}
                     />
                  </View>

                  <TouchableOpacity
                     activeOpacity={0.8}
                     style={styles.checkboxRow}
                     onPress={() => setFinishIsPaid((value) => !value)}
                  >
                     <Ionicons
                        name={
                           finishIsPaid ? "checkbox-outline" : "square-outline"
                        }
                        size={24}
                        color={finishIsPaid ? "#16a34a" : "#64748b"}
                     />
                     <Text style={styles.checkboxText}>თანხა გადახდილია</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                     style={styles.saveButton}
                     onPress={handleConfirmFinishStay}
                  >
                     <Text style={styles.saveButtonText}>დასრულება</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                     style={styles.cancelButton}
                     onPress={() => setFinishModalOpen(false)}
                  >
                     <Text style={styles.saveButtonText}>დახურვა</Text>
                  </TouchableOpacity>
               </View>
            </Pressable>
         </Modal>
      </SafeAreaView>
   );
};
