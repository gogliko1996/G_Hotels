import React, { useMemo, useState } from "react";
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
import { Room } from "../../contstns/sectorB";
import { useSvavesectorA } from "../../store/sectorA_store";
import { useSvavesectorB } from "../../store/sectorB_store";
import { getRemainingDays } from "../../fun/calculatoionTime";

type FilterType = "all" | "free" | "busy" | "ending";

const getRoomColor = (isBooked?: boolean) => {
   return isBooked ? "#ef4444" : "#22c55e";
};

const getRoomIcon = (isBooked?: boolean) => {
   return isBooked ? "bed" : "bed-empty";
};

export const Home: React.FC = () => {
   const [showCorpusAModal, setShowCorpusAModal] = useState(false);
   const [showCorpusBModal, setShowCorpusBModal] = useState(false);
   const [corpusAItem, setCorpusAItem] = useState<Room>();
   const [search, setSearch] = useState("");
   const [filter, setFilter] = useState<FilterType>("all");

   const { sectorA } = useSvavesectorA();
   const { sectorB } = useSvavesectorB();

   const allRooms = [...sectorA, ...sectorB];

   const endingSoonRooms = allRooms.filter((room) => {
      if (!room.isFree || !room.stayingTime) return false;
      const days = getRemainingDays(room.stayingTime);
      return days <= 1;
   });

   const filterRooms = (rooms: Room[]) => {
      return rooms.filter((room) => {
         const roomNumber = room.room?.toString() || "";
         const matchesSearch = roomNumber.includes(search);

         if (!matchesSearch) return false;

         if (filter === "free") return !room.isFree;
         if (filter === "busy") return room.isFree;
         if (filter === "ending") {
            if (!room.isFree || !room.stayingTime) return false;
            return getRemainingDays(room.stayingTime) <= 1;
         }

         return true;
      });
   };

   const filteredSectorA = filterRooms(sectorA);
   const filteredSectorB = filterRooms(sectorB);

   const renderRoom = (
      item: Room,
      width: `${number}%`,
      onPress: () => void,
   ) => {
      const color = getRoomColor(item.isFree);
      const remainingDays =
         item.isFree && item.stayingTime
            ? getRemainingDays(item.stayingTime)
            : null;

      return (
         <TouchableOpacity
            activeOpacity={0.75}
            onPress={onPress}
            style={[
               styles.roomCard,
               {
                  width,
                  borderColor: color,
                  backgroundColor: item.isFree ? "#fff1f2" : "#ecfdf5",
               },
            ]}
         >
            {remainingDays !== null && remainingDays <= 1 && (
               <View style={styles.warningBadge}>
                  <Ionicons name="warning" size={10} color="#fff" />
               </View>
            )}

            <View style={[styles.iconCircle, { backgroundColor: color }]}>
               <MaterialCommunityIcons
                  name={getRoomIcon(item.isFree)}
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
                  item={corpusAItem}
               />

               <SectorBModal
                  item={corpusAItem}
                  isOpen={showCorpusBModal}
                  onClose={() => setShowCorpusBModal(false)}
               />

               <View style={styles.header}>
                  <View>
                     <Text style={styles.title}>სასტუმროს პანელი</Text>
                     <Text style={styles.subtitle}>ოთახების მართვა</Text>
                  </View>

                  <View style={styles.headerIcon}>
                     <Ionicons name="business" size={28} color="#fff" />
                  </View>
               </View>

               {endingSoonRooms.length > 0 && (
                  <View style={styles.alertCard}>
                     <Ionicons name="warning" size={24} color="#f59e0b" />
                     <View style={{ flex: 1 }}>
                        <Text style={styles.alertTitle}>ყურადღება</Text>
                        <Text style={styles.alertText}>
                           {endingSoonRooms.length} ოთახს დღეს ან ხვალ
                           უმთავრდება ჯავშანი
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
                     <Text style={styles.legendText}>დასაჯავშნი</Text>
                  </View>

                  <View style={styles.legendItem}>
                     <View
                        style={[
                           styles.legendDot,
                           { backgroundColor: "#ef4444" },
                        ]}
                     />
                     <Text style={styles.legendText}>დაჯავშნილი</Text>
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
                     data={filteredSectorA}
                     keyExtractor={(item) => item.id.toString()}
                     numColumns={6}
                     scrollEnabled={false}
                     columnWrapperStyle={styles.columnGap}
                     renderItem={({ item }) =>
                        renderRoom(item, "15.5%", () => {
                           setCorpusAItem(item);
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
                     data={filteredSectorB}
                     keyExtractor={(item) => item.id.toString()}
                     numColumns={5}
                     scrollEnabled={false}
                     columnWrapperStyle={styles.columnGap}
                     renderItem={({ item }) =>
                        renderRoom(item, "19%", () => {
                           setCorpusAItem(item);
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
      justifyContent: "center",
      gap: 18,
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
      height: 64,
      borderRadius: 10,
      borderWidth: 1.5,
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
