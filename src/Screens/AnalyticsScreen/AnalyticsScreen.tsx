import React, { useEffect, useMemo, useState } from "react";
import {
   SafeAreaView,
   ScrollView,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useSvavesectorA } from "../../store/sectorA_store";
import { useSvavesectorB } from "../../store/sectorB_store";
import { AnalyticsRange, useAnalyticsStore } from "../../store/analytics_store";
import { getRemainingDays } from "../../fun/calculatoionTime";

export const AnalyticsScreen: React.FC = () => {
   const [range, setRange] = useState<AnalyticsRange>("1m");

   const { sectorA } = useSvavesectorA();
   const { sectorB } = useSvavesectorB();

   const { saveTodaySnapshot, getHistoryByRange } = useAnalyticsStore();

   const allRooms = [...sectorA, ...sectorB];

   useEffect(() => {
      saveTodaySnapshot(allRooms);
   }, [sectorA, sectorB]);

   const history = getHistoryByRange(range);

   const today = history[history.length - 1];
   const yesterday = history[history.length - 2];

   const bookedDifference =
      today && yesterday ? today.bookedRooms - yesterday.bookedRooms : 0;

   const isMore = bookedDifference > 0;
   const isLess = bookedDifference < 0;

   const maxBooked = Math.max(...history.map((item) => item.bookedRooms), 1);

   const totals = useMemo(() => {
      const totalIncome = history.reduce(
         (sum, item) => sum + item.totalIncome,
         0,
      );

      const averageOccupancy =
         history.length > 0
            ? Math.round(
                 history.reduce((sum, item) => sum + item.occupancyPercent, 0) /
                    history.length,
              )
            : 0;

      const bookedRooms = allRooms.filter((room) => room.isFree);
      const freeRooms = allRooms.filter((room) => !room.isFree).length;

      const leavingInOneDay = bookedRooms.filter((room) => {
         if (!room.stayingTime) return false;
         return getRemainingDays(room.stayingTime) === 1;
      }).length;

      const leavingInTwoDays = bookedRooms.filter((room) => {
         if (!room.stayingTime) return false;
         return getRemainingDays(room.stayingTime) === 2;
      }).length;

      return {
         totalIncome,
         averageOccupancy,
         freeRooms,
         leavingInOneDay,
         leavingInTwoDays,
      };
   }, [history, allRooms]);

   return (
      <SafeAreaView style={styles.safe}>
         <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
         >
            <View style={styles.container}>
               <View style={styles.header}>
                  <View>
                     <Text style={styles.title}>ანალიტიკა</Text>
                     <Text style={styles.subtitle}>სტატისტიკა და შედარება</Text>
                  </View>

                  <View style={styles.headerIcon}>
                     <Ionicons name="analytics" size={28} color="#fff" />
                  </View>
               </View>

               <View style={styles.rangeRow}>
                  {[
                     { label: "7 დღე", value: "7d" },
                     { label: "1 თვე", value: "1m" },
                     { label: "3 თვე", value: "3m" },
                  ].map((item) => (
                     <TouchableOpacity
                        key={item.value}
                        onPress={() => setRange(item.value as AnalyticsRange)}
                        style={[
                           styles.rangeButton,
                           range === item.value && styles.activeRangeButton,
                        ]}
                     >
                        <Text
                           style={[
                              styles.rangeText,
                              range === item.value && styles.activeRangeText,
                           ]}
                        >
                           {item.label}
                        </Text>
                     </TouchableOpacity>
                  ))}
               </View>

               <View style={styles.compareCard}>
                  <Text style={styles.cardTitle}>დღევანდელი შედარება</Text>

                  <View style={styles.compareRow}>
                     <View>
                        <Text style={styles.bigNumber}>
                           {today?.bookedRooms || 0}
                        </Text>
                        <Text style={styles.smallLabel}>დღეს დაჯავშნილი</Text>
                     </View>

                     <View
                        style={[
                           styles.compareBadge,
                           {
                              backgroundColor: isMore
                                 ? "#dcfce7"
                                 : isLess
                                   ? "#fee2e2"
                                   : "#e0f2fe",
                           },
                        ]}
                     >
                        <Ionicons
                           name={
                              isMore
                                 ? "arrow-up"
                                 : isLess
                                   ? "arrow-down"
                                   : "remove"
                           }
                           size={18}
                           color={
                              isMore
                                 ? "#16a34a"
                                 : isLess
                                   ? "#dc2626"
                                   : "#0284c7"
                           }
                        />

                        <Text
                           style={[
                              styles.compareText,
                              {
                                 color: isMore
                                    ? "#16a34a"
                                    : isLess
                                      ? "#dc2626"
                                      : "#0284c7",
                              },
                           ]}
                        >
                           {bookedDifference > 0 ? "+" : ""}
                           {bookedDifference}
                        </Text>
                     </View>
                  </View>

                  <Text style={styles.compareDescription}>
                     {isMore
                        ? "დღეს უფრო მეტი ოთახია დაჯავშნილი, ვიდრე წინა დღეს."
                        : isLess
                          ? "დღეს ნაკლები ოთახია დაჯავშნილი, ვიდრე წინა დღეს."
                          : "დღევანდელი და წინა დღის დაჯავშნილი ოთახების რაოდენობა თანაბარია."}
                  </Text>
               </View>

               <View style={styles.chartCard}>
                  <Text style={styles.cardTitle}>დაჯავშნილი ოთახები</Text>

                  <View style={styles.chart}>
                     {history.slice(-14).map((item) => {
                        const height = Math.max(
                           8,
                           (item.bookedRooms / maxBooked) * 130,
                        );

                        return (
                           <View key={item.date} style={styles.barItem}>
                              <View style={styles.barWrapper}>
                                 <View style={[styles.bar, { height }]} />
                              </View>

                              <Text style={styles.barValue}>
                                 {item.bookedRooms}
                              </Text>
                              <Text style={styles.barDate}>
                                 {item.date.slice(5)}
                              </Text>
                           </View>
                        );
                     })}
                  </View>
               </View>

               <View style={styles.grid}>
                  <StatCard
                     title="საშ. დაკავებულობა"
                     value={`${totals.averageOccupancy}%`}
                     icon="stats-chart"
                     color="#2563eb"
                     bg="#eff6ff"
                  />

                  <StatCard
                     title="თავისუფალი ოთახი"
                     value={`${totals.freeRooms}`}
                     icon="bed-outline"
                     color="#16a34a"
                     bg="#ecfdf5"
                  />

                  <StatCard
                     title="1 დღეში თავისუფლდება"
                     value={`${totals.leavingInOneDay}`}
                     icon="time-outline"
                     color="#f59e0b"
                     bg="#fffbeb"
                  />

                  <StatCard
                     title="2 დღეში თავისუფლდება"
                     value={`${totals.leavingInTwoDays}`}
                     icon="calendar-outline"
                     color="#7c3aed"
                     bg="#f5f3ff"
                  />

                  <View style={styles.fullWidthCard}>
                     <Ionicons name="cash" size={26} color="#0f172a" />

                     <View>
                        <Text style={styles.fullWidthValue}>
                           {totals.totalIncome}₾
                        </Text>
                        <Text style={styles.fullWidthTitle}>სრული თანხა</Text>
                     </View>
                  </View>
               </View>
            </View>
         </ScrollView>
      </SafeAreaView>
   );
};

interface StatCardProps {
   title: string;
   value: string;
   icon: keyof typeof Ionicons.glyphMap;
   color: string;
   bg: string;
}

const StatCard: React.FC<StatCardProps> = ({
   title,
   value,
   icon,
   color,
   bg,
}) => {
   return (
      <View style={[styles.statCard, { backgroundColor: bg }]}>
         <Ionicons name={icon} size={24} color={color} />
         <Text style={styles.statValue}>{value}</Text>
         <Text style={styles.statTitle}>{title}</Text>
      </View>
   );
};

const styles = StyleSheet.create({
   safe: {
      flex: 1,
      backgroundColor: "#f8fafc",
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
      borderRadius: 24,
      padding: 18,
      marginBottom: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
   },
   title: {
      fontSize: 26,
      fontWeight: "900",
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
   rangeRow: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 14,
   },
   rangeButton: {
      flex: 1,
      height: 44,
      borderRadius: 999,
      backgroundColor: "#fff",
      borderWidth: 1,
      borderColor: "#e2e8f0",
      alignItems: "center",
      justifyContent: "center",
   },
   activeRangeButton: {
      backgroundColor: "#2563eb",
      borderColor: "#2563eb",
   },
   rangeText: {
      fontSize: 13,
      color: "#475569",
      fontWeight: "800",
   },
   activeRangeText: {
      color: "#fff",
   },
   compareCard: {
      backgroundColor: "#fff",
      borderRadius: 24,
      padding: 18,
      marginBottom: 16,
   },
   cardTitle: {
      fontSize: 18,
      fontWeight: "900",
      color: "#0f172a",
      marginBottom: 12,
   },
   compareRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
   },
   bigNumber: {
      fontSize: 42,
      fontWeight: "900",
      color: "#0f172a",
   },
   smallLabel: {
      fontSize: 13,
      color: "#64748b",
      fontWeight: "700",
   },
   compareBadge: {
      minWidth: 78,
      height: 44,
      borderRadius: 999,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      paddingHorizontal: 12,
   },
   compareText: {
      fontSize: 18,
      fontWeight: "900",
   },
   compareDescription: {
      marginTop: 12,
      fontSize: 14,
      color: "#475569",
      fontWeight: "600",
      lineHeight: 20,
   },
   chartCard: {
      backgroundColor: "#fff",
      borderRadius: 24,
      padding: 18,
      marginBottom: 16,
   },
   chart: {
      height: 190,
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
   },
   barItem: {
      alignItems: "center",
      flex: 1,
   },
   barWrapper: {
      height: 130,
      justifyContent: "flex-end",
   },
   bar: {
      width: 14,
      borderRadius: 999,
      backgroundColor: "#2563eb",
   },
   barValue: {
      marginTop: 6,
      fontSize: 11,
      fontWeight: "800",
      color: "#0f172a",
   },
   barDate: {
      marginTop: 2,
      fontSize: 9,
      fontWeight: "700",
      color: "#94a3b8",
   },
   grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
   },
   statCard: {
      width: "48%",
      borderRadius: 20,
      padding: 16,
   },
   statValue: {
      marginTop: 8,
      fontSize: 24,
      fontWeight: "900",
      color: "#0f172a",
   },
   statTitle: {
      marginTop: 2,
      fontSize: 13,
      color: "#64748b",
      fontWeight: "700",
   },
   fullWidthCard: {
      width: "100%",
      borderRadius: 20,
      padding: 18,
      backgroundColor: "#fff",
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
   },
   fullWidthValue: {
      fontSize: 28,
      fontWeight: "900",
      color: "#0f172a",
   },
   fullWidthTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: "#64748b",
   },
});
