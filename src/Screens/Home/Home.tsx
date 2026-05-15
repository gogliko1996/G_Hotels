import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// import { SectorAModal } from "../../Components/sectorA_modal";
// import { SectorBModal } from "../../Components/sectorB_modal";

import { useRoomsStore } from "../../store/rooms_store";
import { getRemainingDays } from "../../fun/calculatoionTime";

import { HomeHeader } from "./components/HomeHeader/HomeHeader";
import { HomeStats } from "./components/HomeStats/HomeStats";
import { HomeFilters, FilterType } from "./components/HomeFilters/HomeFilters";
import { HomeLegend } from "./components/HomeLegend/HomeLegend";
import { HomeAlert } from "./components/HomeAlert/HomeAlert";
import { RoomSection } from "./components/RoomSection/RoomSection";

import { isFreeRoom, isOccupied, isReserved } from "./utils/roomHelpers";
import { styles } from "./home.styles";
import { FirebaseRoom } from "../../store/store_service_type";
import { router } from "expo-router";

export const Home: React.FC = () => {
   const {
      sectorA,
      sectorB,
      loading,
      listenFirebaseRooms,
      stopListenFirebaseRooms,
   } = useRoomsStore();

   const [search, setSearch] = useState("");
   const [filter, setFilter] = useState<FilterType>("all");

   useEffect(() => {
      listenFirebaseRooms();

      return () => {
         stopListenFirebaseRooms();
      };
   }, []);

   const allRooms = [...sectorA, ...sectorB];

   const endingSoonRooms = allRooms.filter((room) => {
      if (!isOccupied(room) || !room.currentStay?.checkOutDate) return false;

      const days = getRemainingDays(room.currentStay.checkOutDate);

      return days <= 1;
   });

   const reservedRooms = allRooms.filter(isReserved);
   const busyRooms = allRooms.filter(isOccupied);
   const freeRooms = allRooms.filter(isFreeRoom);

   const isRoomDimmed = (room: FirebaseRoom) => {
      const roomNumber = room.room?.toString() || "";
      const matchesSearch = roomNumber.includes(search);

      if (search && !matchesSearch) return true;

      if (filter === "all") return false;
      if (filter === "free") return !isFreeRoom(room);
      if (filter === "busy") return !isOccupied(room);
      if (filter === "reserved") return !isReserved(room);

      if (filter === "ending") {
         if (!isOccupied(room) || !room.currentStay?.checkOutDate) return true;

         const days = getRemainingDays(room.currentStay.checkOutDate);

         return days > 1;
      }

      return false;
   };

   if (loading) {
      return (
         <SafeAreaView style={styles.safe}>
            <View style={styles.loadingContainer}>
               <ActivityIndicator size="large" color="#2563eb" />
               <Text style={styles.loadingText}>იტვირთება...</Text>
            </View>
         </SafeAreaView>
      );
   }

   return (
      <SafeAreaView style={styles.safe}>
         <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
         >
            <View style={styles.container}>
               <HomeHeader />

               <HomeStats
                  freeCount={freeRooms.length}
                  busyCount={busyRooms.length}
                  reservedCount={reservedRooms.length}
               />

               {endingSoonRooms.length > 0 && (
                  <HomeAlert count={endingSoonRooms.length} />
               )}

               <HomeFilters
                  search={search}
                  setSearch={setSearch}
                  filter={filter}
                  setFilter={setFilter}
               />

               <HomeLegend />

               <RoomSection
                  title="A-კორპუსი"
                  rooms={sectorA}
                  columns={6}
                  width="15.5%"
                  iconName="office-building"
                  iconColor="#2563eb"
                  isRoomDimmed={isRoomDimmed}
                  onRoomPress={(room) => {
                     router.push({
                        pathname: "/room/[id]",
                        params: { id: room.firebaseId },
                     });
                  }}
               />

               <RoomSection
                  title="B-კორპუსი"
                  rooms={sectorB}
                  columns={5}
                  width="19%"
                  iconName="office-building-marker"
                  iconColor="#7c3aed"
                  isRoomDimmed={isRoomDimmed}
                  onRoomPress={(room) => {
                     router.push({
                        pathname: "/room/[id]",
                        params: { id: room.firebaseId },
                     });
                  }}
               />
            </View>
         </ScrollView>
      </SafeAreaView>
   );
};
