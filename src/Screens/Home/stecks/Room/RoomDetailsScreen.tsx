import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { RoomImageHeader } from "./components/RoomImageHeader/RoomImageHeader";
import { RoomInfoCard } from "./components/RoomInfoCard/RoomInfoCard";
import { RoomActions } from "./components/RoomActions/RoomActions";
import { ReservationsList } from "./components/ReservationsList/ReservationsList";
import { OccupyRoomModal } from "./components/OccupyRoomModal/OccupyRoomModal";
import { ReservationModal } from "./components/ReservationModal/ReservationModal";

import { styles } from "./RoomDetailsScreen.styles";
import { useRoomsStore } from "../../../../store/rooms_store";

export const RoomDetailsScreen: React.FC = () => {
   const { id } = useLocalSearchParams<{ id: string }>();

   const {
      loading,
      room,
      sectorA,
      sectorB,
      listenFirebaseRooms,
      stopListenFirebaseRooms,
      getRoomById,
      finishStayInRoom,
      removeRoomById,
   } = useRoomsStore();

   const [occupyModalOpen, setOccupyModalOpen] = useState(false);
   const [reservationModalOpen, setReservationModalOpen] = useState(false);

   useEffect(() => {
      listenFirebaseRooms();

      return () => {
         stopListenFirebaseRooms();
      };
   }, []);

   useEffect(() => {
      if (id) {
         getRoomById(id);
      }
   }, [id, sectorA, sectorB]);

   const handleFinishStay = () => {
      if (!room) return;

      Alert.alert("დადასტურება", "გინდა ოთახის გათავისუფლება?", [
         { text: "არა", style: "cancel" },
         {
            text: "კი",
            style: "destructive",
            onPress: () => finishStayInRoom(room.firebaseId),
         },
      ]);
   };

   const handleDeleteRoom = () => {
      if (!room) return;

      Alert.alert("წაშლა", "ნამდვილად გინდა ოთახის წაშლა?", [
         { text: "არა", style: "cancel" },
         {
            text: "წაშლა",
            style: "destructive",
            onPress: async () => {
               await removeRoomById(room.firebaseId);
               router.back();
            },
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
               onReservationPress={() => setReservationModalOpen(true)}
               onFinishPress={handleFinishStay}
               onDeletePress={handleDeleteRoom}
            />

            <ReservationsList room={room} />
         </ScrollView>

         <OccupyRoomModal
            visible={occupyModalOpen}
            room={room}
            onClose={() => setOccupyModalOpen(false)}
         />

         <ReservationModal
            visible={reservationModalOpen}
            room={room}
            onClose={() => setReservationModalOpen(false)}
         />
      </SafeAreaView>
   );
};
