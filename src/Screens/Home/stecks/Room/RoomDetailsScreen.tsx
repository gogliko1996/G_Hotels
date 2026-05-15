import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

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

      Alert.alert("დადასტურება", "გინდა მობინადრის წაშლა?", [
         { text: "არა", style: "cancel" },
         {
            text: "კი",
            style: "destructive",
            onPress: () => finishStayInRoom(room.firebaseId),
         },
      ]);
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
      </SafeAreaView>
   );
};
