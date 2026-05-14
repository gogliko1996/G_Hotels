import React, { useEffect, useState } from "react";
import {
   View,
   FlatList,
   TouchableOpacity,
   StyleSheet,
   Text,
   SafeAreaView,
   ScrollView,
   TextInput,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { SectorAModal } from "../../Components/sectorA_modal";
import { SectorBModal } from "../../Components/sectorB_modal";
import { Room } from "../../contstns/roomType";
import { useSvavesectorA } from "../../store/sectorA_store";
import { useSvavesectorB } from "../../store/sectorB_store";
import { getRemainingDays } from "../../fun/calculatoionTime";

type FilterType = "all" | "free" | "busy" | "reserved" | "ending";

const getStartOfDay = (date: Date) => {
   const newDate = new Date(date);
   newDate.setHours(0, 0, 0, 0);
   return newDate;
};

const convertReservationToOccupied = (room: Room): Room => ({
   ...room,
   isFree: true,

   startTime: room.reservedStartTime,
   stayingTime: room.reservedEndTime,
   onePrice: room.reservedOnePrice,
   allPrice: room.reservedAllPrice,
   remainingAmount: room.reservedAllPrice,

   isReserved: false,
   reservedStartTime: "",
   reservedEndTime: "",
   reservedOnePrice: "",
   reservedAllPrice: "",
});

const getRoomColor = (room: Room) => {
   if (room.isFree && room.isReserved) return "#7c3aed";
   if (room.isFree) return "#ef4444";
   if (room.isReserved) return "#2563eb";
   return "#22c55e";
};

const getRoomBackground = (room: Room) => {
   if (room.isFree && room.isReserved) return "#f3e8ff";
   if (room.isFree) return "#fff1f2";
   if (room.isReserved) return "#eff6ff";
   return "#ecfdf5";
};

const getRoomIcon = (room: Room) => {
   if (room.isFree) return "bed";
   if (room.isReserved) return "calendar-check";
   return "bed-empty";
};

export const Home: React.FC = () => {
   const [showCorpusAModal, setShowCorpusAModal] = useState(false);
   const [showCorpusBModal, setShowCorpusBModal] = useState(false);
   const [selectedAItem, setSelectedAItem] = useState<Room>();
   const [selectedBItem, setSelectedBItem] = useState<Room>();
   const [search, setSearch] = useState("");
   const [filter, setFilter] = useState<FilterType>("all");

   const { sectorA, bookRoom, closeBookA, changePriceA } = useSvavesectorA();

   const { sectorB, bookRoomB, closeBookB, changePriceB } = useSvavesectorB();

   const safeSectorA = sectorA || [];
   const safeSectorB = sectorB || [];

   useEffect(() => {
      const runDailyCheck = () => {
         closeBookA();
         closeBookB();

         changePriceA();
         changePriceB();
      };

      runDailyCheck();

      const interval = setInterval(runDailyCheck, 60 * 1000);

      return () => clearInterval(interval);
   }, [closeBookA, closeBookB, changePriceA, changePriceB]);

   useEffect(() => {
      const today = getStartOfDay(new Date());

      safeSectorA.forEach((room) => {
         if (!room.isReserved || !room.reservedStartTime) return;

         const reservedStart = getStartOfDay(new Date(room.reservedStartTime));

         if (reservedStart <= today) {
            bookRoom(convertReservationToOccupied(room));
         }
      });

      safeSectorB.forEach((room) => {
         if (!room.isReserved || !room.reservedStartTime) return;

         const reservedStart = getStartOfDay(new Date(room.reservedStartTime));

         if (reservedStart <= today) {
            bookRoomB(convertReservationToOccupied(room));
         }
      });
   }, [safeSectorA, safeSectorB, bookRoom, bookRoomB]);

   const allRooms = [...safeSectorA, ...safeSectorB];

   const endingSoonRooms = allRooms.filter((room) => {
      if (!room.isFree || !room.stayingTime) return false;

      const days = getRemainingDays(room.stayingTime);

      return days <= 1;
   });

   const reservedRooms = allRooms.filter((room) => room.isReserved);
   const busyRooms = allRooms.filter((room) => room.isFree);

   const freeRooms = allRooms.filter(
      (room) => !room.isFree && !room.isReserved,
   );

   const isRoomDimmed = (room: Room) => {
      const roomNumber = room.room?.toString() || "";
      const matchesSearch = roomNumber.includes(search);

      if (search && !matchesSearch) return true;

      if (filter === "all") return false;

      if (filter === "free") return room.isFree || room.isReserved;

      if (filter === "busy") return !room.isFree;

      if (filter === "reserved") return !room.isReserved;

      if (filter === "ending") {
         if (!room.isFree || !room.stayingTime) return true;

         const days = getRemainingDays(room.stayingTime);

         return days > 1;
      }

      return false;
   };

   const renderRoom = (
      item: Room,
      width: `${number}%`,
      onPress: () => void,
   ) => {
      const color = getRoomColor(item);

      const remainingDays =
         item.isFree && item.stayingTime
            ? getRemainingDays(item.stayingTime)
            : null;

      const dimmed = isRoomDimmed(item);

      return (
         <TouchableOpacity
            activeOpacity={0.75}
            onPress={onPress}
            style={[
               styles.roomCard,
               {
                  width,
                  borderColor: color,
                  backgroundColor: getRoomBackground(item),
                  borderWidth: item.isFree && item.isReserved ? 2.5 : 1.5,
                  opacity: dimmed ? 0.18 : 1,
               },
            ]}
         >
            {remainingDays !== null && remainingDays <= 1 && (
               <View style={styles.warningBadge}>
                  <Ionicons name="warning" size={10} color="#fff" />
               </View>
            )}

            {item.isReserved && (
               <View style={styles.reservedBadge}>
                  <Ionicons name="calendar" size={10} color="#fff" />
               </View>
            )}

            <View style={[styles.iconCircle, { backgroundColor: color }]}>
               <MaterialCommunityIcons
                  name={getRoomIcon(item)}
                  size={18}
                  color="#fff"
               />
            </View>

            <Text style={[styles.roomText, { color }]}>{item.room}</Text>

            {remainingDays !== null && (
               <Text
                  style={[
                     styles.daysText,
                     {
                        color:
                           remainingDays <= 1
                              ? "#ef4444"
                              : remainingDays <= 2
                                ? "#f59e0b"
                                : "#22c55e",
                     },
                  ]}
               >
                  {remainingDays} დღე
               </Text>
            )}

            {!item.isFree && item.isReserved && (
               <Text style={[styles.daysText, { color: "#2563eb" }]}>
                  ჯავშანი
               </Text>
            )}

            {item.isFree && item.isReserved && (
               <Text style={[styles.daysText, { color: "#7c3aed" }]}>
                  +ჯავშანი
               </Text>
            )}
         </TouchableOpacity>
      );
   };

   return (
      <SafeAreaView style={styles.safe}>
         <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
         >
            <View style={styles.container}>
               <SectorAModal
                  isOpen={showCorpusAModal}
                  onClose={() => setShowCorpusAModal(false)}
                  item={selectedAItem}
               />

               <SectorBModal
                  isOpen={showCorpusBModal}
                  onClose={() => setShowCorpusBModal(false)}
                  item={selectedBItem}
               />

               <View style={styles.header}>
                  <View>
                     <Text style={styles.title}>სასტუმროს პანელი</Text>
                     <Text style={styles.subtitle}>
                        ოთახების დაკავება და წინასწარი ჯავშნები
                     </Text>
                  </View>

                  <View style={styles.headerIcon}>
                     <Ionicons name="business" size={28} color="#fff" />
                  </View>
               </View>

               <View style={styles.statsRow}>
                  <View style={styles.statCard}>
                     <Text style={styles.statValue}>{freeRooms.length}</Text>
                     <Text style={styles.statLabel}>თავისუფალი</Text>
                  </View>

                  <View style={styles.statCard}>
                     <Text style={[styles.statValue, { color: "#ef4444" }]}>
                        {busyRooms.length}
                     </Text>
                     <Text style={styles.statLabel}>დაკავებული</Text>
                  </View>

                  <View style={styles.statCard}>
                     <Text style={[styles.statValue, { color: "#2563eb" }]}>
                        {reservedRooms.length}
                     </Text>
                     <Text style={styles.statLabel}>დაჯავშნილი</Text>
                  </View>
               </View>

               {endingSoonRooms.length > 0 && (
                  <View style={styles.alertCard}>
                     <Ionicons name="warning" size={24} color="#f59e0b" />

                     <View style={{ flex: 1 }}>
                        <Text style={styles.alertTitle}>ყურადღება</Text>
                        <Text style={styles.alertText}>
                           {endingSoonRooms.length} ოთახს დღეს ან ხვალ
                           უმთავრდება დაკავება
                        </Text>
                     </View>
                  </View>
               )}

               <View style={styles.searchBox}>
                  <Ionicons name="search" size={20} color="#64748b" />

                  <TextInput
                     value={search}
                     onChangeText={setSearch}
                     placeholder="ოთახის ნომრით ძებნა..."
                     placeholderTextColor="#94a3b8"
                     style={styles.searchInput}
                     keyboardType="numeric"
                  />
               </View>

               <View style={styles.filtersRow}>
                  {[
                     { label: "ყველა", value: "all" },
                     { label: "თავისუფალი", value: "free" },
                     { label: "დაკავებული", value: "busy" },
                     { label: "დაჯავშნილი", value: "reserved" },
                     { label: "გასასვლელი", value: "ending" },
                  ].map((item) => (
                     <TouchableOpacity
                        key={item.value}
                        onPress={() => setFilter(item.value as FilterType)}
                        style={[
                           styles.filterButton,
                           filter === item.value && styles.activeFilterButton,
                        ]}
                     >
                        <Text
                           style={[
                              styles.filterText,
                              filter === item.value && styles.activeFilterText,
                           ]}
                        >
                           {item.label}
                        </Text>
                     </TouchableOpacity>
                  ))}
               </View>

               <View style={styles.legendRow}>
                  <View style={styles.legendItem}>
                     <View
                        style={[
                           styles.legendDot,
                           { backgroundColor: "#22c55e" },
                        ]}
                     />
                     <Text style={styles.legendText}>თავისუფალი</Text>
                  </View>

                  <View style={styles.legendItem}>
                     <View
                        style={[
                           styles.legendDot,
                           { backgroundColor: "#ef4444" },
                        ]}
                     />
                     <Text style={styles.legendText}>დაკავებული</Text>
                  </View>

                  <View style={styles.legendItem}>
                     <View
                        style={[
                           styles.legendDot,
                           { backgroundColor: "#2563eb" },
                        ]}
                     />
                     <Text style={styles.legendText}>დაჯავშნილი</Text>
                  </View>

                  <View style={styles.legendItem}>
                     <View
                        style={[
                           styles.legendDot,
                           { backgroundColor: "#7c3aed" },
                        ]}
                     />
                     <Text style={styles.legendText}>ორივე</Text>
                  </View>
               </View>

               <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                     <MaterialCommunityIcons
                        name="office-building"
                        size={24}
                        color="#2563eb"
                     />

                     <Text style={styles.sectionTitle}>A-კორპუსი</Text>
                  </View>

                  <FlatList
                     data={safeSectorA}
                     keyExtractor={(item, index) =>
                        item?.id ? item.id.toString() : index.toString()
                     }
                     numColumns={6}
                     scrollEnabled={false}
                     columnWrapperStyle={styles.columnGap}
                     renderItem={({ item }) =>
                        renderRoom(item, "15.5%", () => {
                           setSelectedAItem(item);
                           setShowCorpusAModal(true);
                        })
                     }
                  />
               </View>

               <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                     <MaterialCommunityIcons
                        name="office-building-marker"
                        size={24}
                        color="#7c3aed"
                     />

                     <Text style={styles.sectionTitle}>B-კორპუსი</Text>
                  </View>

                  <FlatList
                     data={safeSectorB}
                     keyExtractor={(item, index) =>
                        item?.id ? item.id.toString() : index.toString()
                     }
                     numColumns={5}
                     scrollEnabled={false}
                     columnWrapperStyle={styles.columnGap}
                     renderItem={({ item }) =>
                        renderRoom(item, "19%", () => {
                           setSelectedBItem(item);
                           setShowCorpusBModal(true);
                        })
                     }
                  />
               </View>
            </View>
         </ScrollView>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   safe: {
      flex: 1,
      backgroundColor: "#f8fafc",
   },
   scroll: {
      flex: 1,
   },
   scrollContent: {
      paddingBottom: 30,
   },
   container: {
      paddingHorizontal: 16,
      paddingTop: 14,
   },
   header: {
      backgroundColor: "#111827",
      borderRadius: 12,
      padding: 18,
      marginBottom: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
   },
   title: {
      fontSize: 24,
      fontWeight: "800",
      color: "#fff",
   },
   subtitle: {
      marginTop: 4,
      fontSize: 13,
      color: "#cbd5e1",
   },
   headerIcon: {
      width: 52,
      height: 52,
      borderRadius: 18,
      backgroundColor: "#2563eb",
      alignItems: "center",
      justifyContent: "center",
   },
   statsRow: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 14,
   },
   statCard: {
      flex: 1,
      backgroundColor: "#fff",
      borderRadius: 18,
      paddingVertical: 14,
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#e2e8f0",
   },
   statValue: {
      fontSize: 22,
      fontWeight: "900",
      color: "#22c55e",
   },
   statLabel: {
      marginTop: 4,
      fontSize: 12,
      fontWeight: "700",
      color: "#64748b",
   },
   alertCard: {
      backgroundColor: "#fffbeb",
      borderColor: "#fde68a",
      borderWidth: 1,
      borderRadius: 18,
      padding: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 14,
   },
   alertTitle: {
      fontSize: 15,
      fontWeight: "800",
      color: "#92400e",
   },
   alertText: {
      fontSize: 13,
      color: "#92400e",
      marginTop: 2,
   },
   searchBox: {
      height: 54,
      backgroundColor: "#fff",
      borderRadius: 18,
      paddingHorizontal: 14,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
      borderWidth: 1,
      borderColor: "#e2e8f0",
   },
   searchInput: {
      flex: 1,
      marginLeft: 8,
      fontSize: 15,
      color: "#0f172a",
      fontWeight: "600",
   },
   filtersRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 14,
   },
   filterButton: {
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 999,
      backgroundColor: "#fff",
      borderWidth: 1,
      borderColor: "#e2e8f0",
   },
   activeFilterButton: {
      backgroundColor: "#2563eb",
      borderColor: "#2563eb",
   },
   filterText: {
      fontSize: 13,
      fontWeight: "700",
      color: "#475569",
   },
   activeFilterText: {
      color: "#fff",
   },
   legendRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 14,
      marginBottom: 16,
   },
   legendItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
   },
   legendDot: {
      width: 10,
      height: 10,
      borderRadius: 10,
   },
   legendText: {
      fontSize: 13,
      color: "#475569",
      fontWeight: "600",
   },
   section: {
      backgroundColor: "#fff",
      borderRadius: 22,
      padding: 14,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 4,
   },
   sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 12,
   },
   sectionTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: "#0f172a",
   },
   columnGap: {
      justifyContent: "space-between",
      marginBottom: 8,
   },
   roomCard: {
      height: 72,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
   },
   warningBadge: {
      position: "absolute",
      top: -5,
      right: -5,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: "#f59e0b",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2,
   },
   reservedBadge: {
      position: "absolute",
      top: -5,
      left: -5,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: "#2563eb",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2,
   },
   iconCircle: {
      width: 26,
      height: 26,
      borderRadius: 13,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 3,
   },
   roomText: {
      fontSize: 15,
      fontWeight: "800",
   },
   daysText: {
      fontSize: 9,
      fontWeight: "800",
      marginTop: 1,
   },
});
