import React, { useEffect, useMemo, useState } from "react";
import {
   ScrollView,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useSvavesectorA } from "../../store/sectorA_store";
import { useSvavesectorB } from "../../store/sectorB_store";
import { AnalyticsRange, useAnalyticsStore } from "../../store/analytics_store";
import { getRemainingDays } from "../../fun/calculatoionTime";

const DAY_MS = 1000 * 60 * 60 * 24;

const getDateKey = (date = new Date()) => date.toISOString().split("T")[0];

const getYesterdayKey = () => {
   const date = new Date();
   date.setDate(date.getDate() - 1);
   return getDateKey(date);
};

const getDaysUntil = (dateValue?: string) => {
   if (!dateValue) return 0;

   const now = new Date();
   const target = new Date(dateValue);

   now.setHours(0, 0, 0, 0);
   target.setHours(0, 0, 0, 0);

   return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / DAY_MS));
};

const isComingInOneDay = (dateValue?: string) => getDaysUntil(dateValue) === 1;

export const AnalyticsScreen: React.FC = () => {
   const [range, setRange] = useState<AnalyticsRange>("1m");

   const { sectorA } = useSvavesectorA();
   const { sectorB } = useSvavesectorB();

   const { saveTodaySnapshot, getHistoryByRange } = useAnalyticsStore();

   const allRooms = useMemo(() => {
      return [...(sectorA || []), ...(sectorB || [])];
   }, [sectorA, sectorB]);

   useEffect(() => {
      saveTodaySnapshot(allRooms);
   }, [allRooms, saveTodaySnapshot]);

   const history = getHistoryByRange(range);

   const todayKey = getDateKey();
   const yesterdayKey = getYesterdayKey();

   const guestsToday = allRooms.filter((room) => {
      if (!room.startTime) return false;
      return room.startTime.split("T")[0] === todayKey;
   }).length;

   const guestsYesterday = allRooms.filter((room) => {
      if (!room.startTime) return false;
      return room.startTime.split("T")[0] === yesterdayKey;
   }).length;

   const guestsDifference = guestsToday - guestsYesterday;

   const upcomingReservations = useMemo(() => {
      return allRooms
         .filter((room) => room.isReserved && room.reservedStartTime)
         .sort(
            (a, b) =>
               new Date(a.reservedStartTime).getTime() -
               new Date(b.reservedStartTime).getTime(),
         );
   }, [allRooms]);

   const totals = useMemo(() => {
      const busyRooms = allRooms.filter((room) => room.isFree);
      const reservedRooms = allRooms.filter((room) => room.isReserved);

      const freeRooms = allRooms.filter(
         (room) => !room.isFree && !room.isReserved,
      ).length;

      const leavingInOneDay = busyRooms.filter((room) => {
         if (!room.stayingTime) return false;
         return getRemainingDays(room.stayingTime) === 1;
      }).length;

      const leavingInTwoDays = busyRooms.filter((room) => {
         if (!room.stayingTime) return false;
         return getRemainingDays(room.stayingTime) === 2;
      }).length;

      const comingInOneDay = reservedRooms.filter((room) =>
         isComingInOneDay(room.reservedStartTime),
      ).length;

      const occupiedIncome = busyRooms.reduce(
         (sum, room) => sum + Number(room.allPrice || 0),
         0,
      );

      const reservedIncome = reservedRooms.reduce(
         (sum, room) => sum + Number(room.reservedAllPrice || 0),
         0,
      );

      const remainingAmount = busyRooms.reduce(
         (sum, room) => sum + Number(room.remainingAmount || 0),
         0,
      );

      const paidAmount = Math.max(0, occupiedIncome - remainingAmount);
      const totalIncome = occupiedIncome + reservedIncome;

      const currentOccupancyPercent =
         allRooms.length > 0
            ? Math.round((busyRooms.length / allRooms.length) * 100)
            : 0;

      const averageOccupancy =
         history.length > 0
            ? Math.round(
                 history.reduce((sum: number, item: any) => {
                    return sum + Number(item.occupancyPercent || 0);
                 }, 0) / history.length,
              )
            : currentOccupancyPercent;

      const averageStayDays =
         busyRooms.length > 0
            ? Math.round(
                 busyRooms.reduce((sum, room) => {
                    if (!room.startTime || !room.stayingTime) return sum;

                    const start = new Date(room.startTime).getTime();
                    const end = new Date(room.stayingTime).getTime();
                    const days = Math.max(1, Math.ceil((end - start) / DAY_MS));

                    return sum + days;
                 }, 0) / busyRooms.length,
              )
            : 0;

      return {
         averageOccupancy,
         freeRooms,
         busyRooms: busyRooms.length,
         reservedRooms: reservedRooms.length,
         leavingInOneDay,
         leavingInTwoDays,
         comingInOneDay,
         occupiedIncome,
         reservedIncome,
         remainingAmount,
         paidAmount,
         totalIncome,
         averageStayDays,
      };
   }, [allRooms, history]);

   const normalizedHistory = history.map((item: any) => ({
      ...item,
      busyRooms: Number(item.busyRooms ?? item.bookedRooms ?? 0),
      occupancyPercent: Number(item.occupancyPercent ?? 0),
   }));

   const todaySnapshot = {
      date: todayKey,
      busyRooms: Number(totals.busyRooms || 0),
      occupancyPercent: Number(totals.averageOccupancy || 0),
   };

   const chartData = normalizedHistory.some(
      (item) => item.date === todaySnapshot.date,
   )
      ? normalizedHistory.map((item) =>
           item.date === todaySnapshot.date ? todaySnapshot : item,
        )
      : [...normalizedHistory, todaySnapshot];

   const safeChartData = chartData.length > 0 ? chartData : [todaySnapshot];

   const today = safeChartData[safeChartData.length - 1];
   const yesterday = safeChartData[safeChartData.length - 2];

   const bookedDifference =
      today && yesterday ? today.busyRooms - yesterday.busyRooms : 0;

   const isMore = bookedDifference > 0;
   const isLess = bookedDifference < 0;

   const maxBooked = Math.max(
      ...safeChartData.map((item) => Number(item.busyRooms || 0)),
      1,
   );

   const maxGuestChartValue = Math.max(guestsToday, guestsYesterday, 1);

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
                        <Text style={styles.bigNumber}>{today.busyRooms}</Text>
                        <Text style={styles.smallLabel}>დღეს დაკავებული</Text>
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
                        ? "დღეს უფრო მეტი ოთახია დაკავებული, ვიდრე წინა ჩანაწერში."
                        : isLess
                          ? "დღეს ნაკლები ოთახია დაკავებული, ვიდრე წინა ჩანაწერში."
                          : "დაკავებული ოთახების რაოდენობა არ შეცვლილა."}
                  </Text>
               </View>

               <View style={styles.chartCard}>
                  <View style={styles.chartHeader}>
                     <View>
                        <Text style={styles.cardTitle}>
                           შესული სტუმრები დღეს / გუშინ
                        </Text>
                        <Text style={styles.chartSubtitle}>
                           სხვაობა: {guestsDifference > 0 ? "+" : ""}
                           {guestsDifference}
                        </Text>
                     </View>
                  </View>

                  <View style={styles.guestChart}>
                     {[
                        { label: "გუშინ", value: guestsYesterday },
                        { label: "დღეს", value: guestsToday },
                     ].map((item) => {
                        const height = Math.max(
                           10,
                           (item.value / maxGuestChartValue) * 130,
                        );

                        return (
                           <View key={item.label} style={styles.guestBarItem}>
                              <View style={styles.guestBarWrapper}>
                                 <View style={[styles.guestBar, { height }]} />
                              </View>

                              <Text style={styles.barValue}>{item.value}</Text>
                              <Text style={styles.barDate}>{item.label}</Text>
                           </View>
                        );
                     })}
                  </View>
               </View>

               <View style={styles.chartCard}>
                  <Text style={styles.cardTitle}>დაკავებული ოთახები</Text>

                  <View style={styles.chart}>
                     {safeChartData.slice(-14).map((item) => {
                        const busyRoomsValue = Number(item.busyRooms || 0);

                        const height =
                           busyRoomsValue === 0
                              ? 12
                              : Math.max(
                                   18,
                                   (busyRoomsValue / maxBooked) * 130,
                                );

                        return (
                           <View key={item.date} style={styles.barItem}>
                              <View style={styles.barWrapper}>
                                 <View style={[styles.bar, { height }]} />
                              </View>

                              <Text style={styles.barValue}>
                                 {busyRoomsValue}
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
                     title="დაკავებული ოთახი"
                     value={`${totals.busyRooms}`}
                     icon="bed"
                     color="#ef4444"
                     bg="#fff1f2"
                  />

                  <StatCard
                     title="დაჯავშნილი ოთახი"
                     value={`${totals.reservedRooms}`}
                     icon="calendar"
                     color="#2563eb"
                     bg="#eff6ff"
                  />

                  <StatCard
                     title="დღეს შევიდა"
                     value={`${guestsToday}`}
                     icon="person-add"
                     color="#16a34a"
                     bg="#ecfdf5"
                  />

                  <StatCard
                     title="გუშინ შევიდა"
                     value={`${guestsYesterday}`}
                     icon="people"
                     color="#2563eb"
                     bg="#eff6ff"
                  />

                  <StatCard
                     title="1 დღეში მოდის"
                     value={`${totals.comingInOneDay}`}
                     icon="log-in-outline"
                     color="#0ea5e9"
                     bg="#f0f9ff"
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

                  <StatCard
                     title="საშ. დარჩენა"
                     value={`${totals.averageStayDays} დღე`}
                     icon="hourglass-outline"
                     color="#9333ea"
                     bg="#faf5ff"
                  />

                  <View style={styles.fullWidthCard}>
                     <Ionicons name="cash" size={26} color="#ef4444" />
                     <View>
                        <Text style={styles.fullWidthValue}>
                           {totals.occupiedIncome}₾
                        </Text>
                        <Text style={styles.fullWidthTitle}>
                           დაკავებული ოთახების თანხა
                        </Text>
                     </View>
                  </View>

                  <View style={styles.fullWidthCard}>
                     <Ionicons name="calendar" size={26} color="#2563eb" />
                     <View>
                        <Text style={styles.fullWidthValue}>
                           {totals.reservedIncome}₾
                        </Text>
                        <Text style={styles.fullWidthTitle}>
                           ჯავშნების თანხა
                        </Text>
                     </View>
                  </View>

                  <View style={styles.fullWidthCard}>
                     <Ionicons name="wallet" size={26} color="#0f172a" />
                     <View>
                        <Text style={styles.fullWidthValue}>
                           {totals.totalIncome}₾
                        </Text>
                        <Text style={styles.fullWidthTitle}>სრული ჯამი</Text>
                     </View>
                  </View>
               </View>

               <View style={styles.reservationTable}>
                  <Text style={styles.cardTitle}>მომავალი ჯავშნები</Text>

                  {upcomingReservations.length === 0 ? (
                     <Text style={styles.emptyText}>
                        აქტიური ჯავშნები არ არის
                     </Text>
                  ) : (
                     upcomingReservations.map((room) => (
                        <View
                           key={`${room.id}-${room.room}`}
                           style={styles.reservationRow}
                        >
                           <View>
                              <Text style={styles.roomNumber}>
                                 ოთახი #{room.room}
                              </Text>

                              <Text style={styles.reservationDate}>
                                 მოსვლა:{" "}
                                 {room.reservedStartTime?.split("T")[0] || "-"}
                              </Text>

                              <Text style={styles.reservationDate}>
                                 მოსვლამდე დარჩა:{" "}
                                 {getDaysUntil(room.reservedStartTime)} დღე
                              </Text>

                              <Text style={styles.reservationDate}>
                                 გასვლა:{" "}
                                 {room.reservedEndTime?.split("T")[0] || "-"}
                              </Text>
                           </View>

                           <View style={styles.reservationRight}>
                              <Text style={styles.reservationDays}>
                                 დარჩება:{" "}
                                 {getRemainingDays(room.reservedEndTime)} დღე
                              </Text>

                              <Text style={styles.reservationPrice}>
                                 {room.reservedAllPrice || 0}₾
                              </Text>
                           </View>
                        </View>
                     ))
                  )}
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
   chartHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6,
   },
   chartSubtitle: {
      fontSize: 13,
      color: "#64748b",
      fontWeight: "700",
   },
   chart: {
      height: 190,
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-around",
   },
   guestChart: {
      height: 190,
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "center",
      gap: 44,
   },
   guestBarItem: {
      alignItems: "center",
      width: 80,
   },
   guestBarWrapper: {
      height: 130,
      justifyContent: "flex-end",
   },
   guestBar: {
      width: 42,
      borderRadius: 999,
      backgroundColor: "#16a34a",
   },
   barItem: {
      alignItems: "center",
      width: 28,
   },
   barWrapper: {
      height: 130,
      justifyContent: "flex-end",
   },
   bar: {
      width: 18,
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
   reservationTable: {
      marginTop: 16,
      backgroundColor: "#fff",
      borderRadius: 24,
      padding: 18,
   },
   reservationRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#f1f5f9",
   },
   roomNumber: {
      fontSize: 16,
      fontWeight: "900",
      color: "#0f172a",
   },
   reservationDate: {
      marginTop: 4,
      fontSize: 13,
      color: "#64748b",
      fontWeight: "700",
   },
   reservationRight: {
      alignItems: "flex-end",
   },
   reservationDays: {
      fontSize: 13,
      fontWeight: "800",
      color: "#2563eb",
   },
   reservationPrice: {
      marginTop: 4,
      fontSize: 16,
      fontWeight: "900",
      color: "#16a34a",
   },
   emptyText: {
      fontSize: 14,
      color: "#94a3b8",
      fontWeight: "700",
      marginTop: 8,
   },
});
