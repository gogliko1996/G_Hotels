import React, { useEffect, useMemo, useState } from "react";
import {
   ActivityIndicator,
   Alert,
   ScrollView,
   Text,
   TouchableOpacity,
   View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import { StayHistory } from "../../services/type";
import { listenRoomHistory } from "../../services/roomsService";
import { Expense, listenExpenses } from "../../services/expensesService";
import { RoomHistoryTable } from "../AnalyticsScreen/components/RoomHistoryTable/RoomHistoryTable";
import { styles } from "./historyAnalytics.styles";

type RoomFinance = {
   roomId: string;
   roomName: string;
   days: number;
   income: number;
   expense: number;
   profit: number;
   incomePerDay: number;
   expensePerDay: number;
   profitPerDay: number;
};

const roundMoney = (value: number) => Math.round(value * 100) / 100;

const getRoomNumber = (room: RoomFinance) => {
   const match = `${room.roomId} ${room.roomName}`.match(/\d+/);
   return match ? Number(match[0]) : 0;
};

const getRoomSector = (room: RoomFinance) => {
   if (room.roomId.startsWith("A-")) return "A";
   if (room.roomId.startsWith("B-")) return "B";
   return "სხვა";
};

const sortRoomsBottomToTop = (rooms: RoomFinance[]) =>
   [...rooms].sort((a, b) => getRoomNumber(a) - getRoomNumber(b));

const buildRoomsRows = (rooms: RoomFinance[]) => {
   if (rooms.length === 0) {
      return `<tr><td colspan="8" class="empty">ჩანაწერი არ არის</td></tr>`;
   }

   return rooms
      .map(
         (room) => `
            <tr>
               <td>${room.roomName}</td>
               <td>${room.days}</td>
               <td>${room.income} ₾</td>
               <td>${room.expense} ₾</td>
               <td>${room.profit} ₾</td>
               <td>${room.incomePerDay} ₾</td>
               <td>${room.expensePerDay} ₾</td>
               <td>${room.profitPerDay} ₾</td>
            </tr>
         `,
      )
      .join("");
};

const buildFinancePdfHtml = (analytics: ReturnType<typeof createAnalytics>) => {
   const sectorA = sortRoomsBottomToTop(
      analytics.roomFinances.filter((room) => getRoomSector(room) === "A"),
   );
   const sectorB = sortRoomsBottomToTop(
      analytics.roomFinances.filter((room) => getRoomSector(room) === "B"),
   );
   const otherRooms = sortRoomsBottomToTop(
      analytics.roomFinances.filter((room) => getRoomSector(room) === "სხვა"),
   );

   return `
      <!doctype html>
      <html>
         <head>
            <meta charset="utf-8" />
            <style>
               body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #0f172a; padding: 24px; }
               h1 { font-size: 24px; margin: 0 0 8px; }
               h2 { font-size: 18px; margin: 24px 0 10px; }
               .meta { color: #64748b; margin-bottom: 18px; }
               .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 18px; }
               .box { border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; background: #f8fafc; }
               .label { color: #64748b; font-size: 12px; font-weight: 700; }
               .value { font-size: 16px; font-weight: 800; margin-top: 4px; }
               table { width: 100%; border-collapse: collapse; margin-bottom: 18px; }
               th { background: #111827; color: #fff; text-align: left; padding: 8px; font-size: 11px; }
               td { border-bottom: 1px solid #e2e8f0; padding: 8px; font-size: 11px; }
               .empty { text-align: center; color: #94a3b8; }
               .profit { color: #16a34a; }
               .expense { color: #ef4444; }
            </style>
         </head>
         <body>
            <h1>ოთახების ფინანსები</h1>
            <div class="meta">გენერირების თარიღი: ${new Date().toISOString().split("T")[0]}</div>

            <div class="grid">
               <div class="box"><div class="label">სრული შემოსავალი</div><div class="value">${analytics.totalIncome} ₾</div></div>
               <div class="box"><div class="label">სრული ხარჯი</div><div class="value expense">${analytics.totalExpenses} ₾</div></div>
               <div class="box"><div class="label">მოგება</div><div class="value profit">${analytics.profit} ₾</div></div>
               <div class="box"><div class="label">გაქირავებული</div><div class="value">${analytics.totalRooms} ოთახი / ${analytics.totalDays} დღე</div></div>
            </div>

            <h2>A კორპუსი</h2>
            <table>
               <thead>
                  <tr>
                     <th>ოთახი</th><th>დღე</th><th>შემოსავალი</th><th>ხარჯი</th><th>მოგება</th><th>დღ. შემოსავალი</th><th>დღ. ხარჯი</th><th>დღ. მოგება</th>
                  </tr>
               </thead>
               <tbody>${buildRoomsRows(sectorA)}</tbody>
            </table>

            <h2>B კორპუსი</h2>
            <table>
               <thead>
                  <tr>
                     <th>ოთახი</th><th>დღე</th><th>შემოსავალი</th><th>ხარჯი</th><th>მოგება</th><th>დღ. შემოსავალი</th><th>დღ. ხარჯი</th><th>დღ. მოგება</th>
                  </tr>
               </thead>
               <tbody>${buildRoomsRows(sectorB)}</tbody>
            </table>

            ${
               otherRooms.length
                  ? `<h2>სხვა</h2><table><thead><tr><th>ოთახი</th><th>დღე</th><th>შემოსავალი</th><th>ხარჯი</th><th>მოგება</th><th>დღ. შემოსავალი</th><th>დღ. ხარჯი</th><th>დღ. მოგება</th></tr></thead><tbody>${buildRoomsRows(otherRooms)}</tbody></table>`
                  : ""
            }

         </body>
      </html>
   `;
};

const createAnalytics = (expenses: Expense[], history: StayHistory[]) => {
   const totalExpenses = expenses.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0,
   );
   const totalDays = history.reduce(
      (sum, item) => sum + Number(item.daysStayed || 0),
      0,
   );
   const totalIncome = history.reduce(
      (sum, item) => sum + Number(item.totalAmount || 0),
      0,
   );
   const paidIncome = history.reduce(
      (sum, item) => sum + Number(item.paidAmount || 0),
      0,
   );
   const remainingIncome = history.reduce(
      (sum, item) => sum + Number(item.remainingAmount || 0),
      0,
   );

   const expensePerDay = totalDays > 0 ? totalExpenses / totalDays : 0;
   const incomePerDay = totalDays > 0 ? totalIncome / totalDays : 0;
   const profit = totalIncome - totalExpenses;

   const roomsMap = new Map<string, RoomFinance>();

   history.forEach((item) => {
      const roomId = item.roomId || item.roomName || "unknown";
      const previous = roomsMap.get(roomId) || {
         roomId,
         roomName: item.roomName || roomId,
         days: 0,
         income: 0,
         expense: 0,
         profit: 0,
         incomePerDay: 0,
         expensePerDay: 0,
         profitPerDay: 0,
      };

      previous.days += Number(item.daysStayed || 0);
      previous.income += Number(item.totalAmount || 0);
      roomsMap.set(roomId, previous);
   });

   const roomFinances = Array.from(roomsMap.values())
      .map((room) => {
         const expense = room.days * expensePerDay;
         const roomIncomePerDay = room.days > 0 ? room.income / room.days : 0;

         return {
            ...room,
            income: roundMoney(room.income),
            expense: roundMoney(expense),
            profit: roundMoney(room.income - expense),
            incomePerDay: roundMoney(roomIncomePerDay),
            expensePerDay: roundMoney(expensePerDay),
            profitPerDay: roundMoney(roomIncomePerDay - expensePerDay),
         };
      })
      .sort((a, b) => b.days - a.days);

   return {
      totalExpenses: roundMoney(totalExpenses),
      totalDays,
      totalRooms: roomFinances.length,
      totalIncome: roundMoney(totalIncome),
      paidIncome: roundMoney(paidIncome),
      remainingIncome: roundMoney(remainingIncome),
      expensePerDay: roundMoney(expensePerDay),
      incomePerDay: roundMoney(incomePerDay),
      profit: roundMoney(profit),
      roomFinances,
   };
};

export const HistoryAnalyticsScreen: React.FC = () => {
   const [history, setHistory] = useState<StayHistory[]>([]);
   const [expenses, setExpenses] = useState<Expense[]>([]);
   const [historyLoading, setHistoryLoading] = useState(true);
   const [expensesLoading, setExpensesLoading] = useState(true);
   const [expensesOpen, setExpensesOpen] = useState(false);

   useEffect(() => {
      const unsubscribe = listenRoomHistory((items) => {
         setHistory(items);
         setHistoryLoading(false);
      });

      return () => {
         unsubscribe();
      };
   }, []);

   useEffect(() => {
      const unsubscribe = listenExpenses((items) => {
         setExpenses(items);
         setExpensesLoading(false);
      });

      return () => {
         unsubscribe();
      };
   }, []);

   const analytics = useMemo(() => {
      return createAnalytics(expenses, history);
   }, [expenses, history]);

   const loading = historyLoading || expensesLoading;

   const handlePrint = async () => {
      try {
         await Print.printAsync({
            html: buildFinancePdfHtml(analytics),
         });
      } catch (error) {
         console.log(error);
         Alert.alert("შეცდომა", "PDF-ის ბეჭდვა ვერ მოხერხდა");
      }
   };

   const handleShare = async () => {
      try {
         const canShare = await Sharing.isAvailableAsync();

         if (!canShare) {
            Alert.alert("გაზიარება მიუწვდომელია", "ამ მოწყობილობაზე გაზიარება არ არის ხელმისაწვდომი");
            return;
         }

         const file = await Print.printToFileAsync({
            html: buildFinancePdfHtml(analytics),
         });

         await Sharing.shareAsync(file.uri, {
            mimeType: "application/pdf",
            dialogTitle: "ოთახების ფინანსები",
            UTI: "com.adobe.pdf",
         });
      } catch (error) {
         console.log(error);
         Alert.alert("შეცდომა", "PDF-ის გაზიარება ვერ მოხერხდა");
         return;
      }
   };

   return (
      <SafeAreaView style={styles.safe}>
         <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
               <Ionicons name="chevron-back" size={26} color="#0f172a" />
            </TouchableOpacity>

            <View style={styles.headerTextBox}>
               <Text style={styles.title}>ისტორია და ფინანსები</Text>
               <Text style={styles.subtitle}>ხარჯები, შემოსავალი და მოგება</Text>
            </View>
         </View>

         {loading ? (
            <View style={styles.loadingBox}>
               <ActivityIndicator size="large" color="#7c3aed" />
            </View>
         ) : (
            <ScrollView
               showsVerticalScrollIndicator={false}
               contentContainerStyle={styles.scrollContent}
            >
               <View style={styles.summaryCard}>
                  <View style={styles.cardHeader}>
                     <Text style={styles.cardTitle}>ოთახების ფინანსები</Text>

                     <View style={styles.exportActions}>
                        <TouchableOpacity
                           activeOpacity={0.85}
                           style={styles.exportButton}
                           onPress={handlePrint}
                        >
                           <Ionicons name="print-outline" size={18} color="#fff" />
                           <Text style={styles.exportButtonText}>ბეჭდვა</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                           activeOpacity={0.85}
                           style={styles.exportButton}
                           onPress={handleShare}
                        >
                           <Ionicons name="share-outline" size={18} color="#fff" />
                           <Text style={styles.exportButtonText}>გაზიარება</Text>
                        </TouchableOpacity>
                     </View>
                  </View>

                  {analytics.roomFinances.length === 0 ? (
                     <Text style={styles.emptyText}>ოთახის ისტორია ჯერ არ არის</Text>
                  ) : (
                     analytics.roomFinances.map((room) => (
                        <View key={room.roomId} style={styles.roomRow}>
                           <View style={styles.roomHeader}>
                              <Text style={styles.roomName}>{room.roomName}</Text>
                           </View>

                           <View style={styles.roomGrid}>
                              <Text style={styles.roomText}>
                                 დღეები: {room.days}
                              </Text>
                              <Text style={styles.roomText}>
                                 შემოსავალი: {room.income} ₾
                              </Text>
                              <Text style={styles.roomProfitLarge}>
                                 მოგება: {room.profit} ₾
                              </Text>
                              <Text style={styles.roomText}>
                                 ხარჯი: {room.expense} ₾
                              </Text>
                           </View>

                           <View style={styles.dailyGrid}>
                              <Text style={styles.dailyIncome}>
                                 დღიური შემოსავალი: {room.incomePerDay} ₾
                              </Text>
                              <Text style={styles.dailyExpense}>
                                 დღიური ხარჯი: {room.expensePerDay} ₾
                              </Text>
                              <Text style={styles.dailyProfit}>
                                 დღიური მოგება: {room.profitPerDay} ₾
                              </Text>
                           </View>
                        </View>
                     ))
                  )}
               </View>

               <RoomHistoryTable history={history} />

               <View style={styles.summaryCard}>
                  <Text style={styles.cardTitle}>ხარჯები</Text>

                  <TouchableOpacity
                     activeOpacity={0.85}
                     style={styles.expensesToggle}
                     onPress={() => setExpensesOpen((value) => !value)}
                  >
                     <Text style={styles.sectionTotal}>
                        სრული ხარჯი: {analytics.totalExpenses} ₾
                     </Text>
                     <Ionicons
                        name={expensesOpen ? "chevron-up" : "chevron-down"}
                        size={22}
                        color="#ef4444"
                     />
                  </TouchableOpacity>

                  {expensesOpen && (
                     <>
                        {expenses.length === 0 ? (
                           <Text style={styles.emptyText}>
                              ხარჯი ჯერ არ არის
                           </Text>
                        ) : (
                           expenses.map((expense) => (
                              <View key={expense.id} style={styles.expenseRow}>
                                 <Text style={styles.expenseTitle}>
                                    {expense.title || "-"}
                                 </Text>
                                 <Text style={styles.expenseAmount}>
                                    {expense.amount || 0} ₾
                                 </Text>
                              </View>
                           ))
                        )}
                     </>
                  )}
               </View>

               <View style={styles.summaryCard}>
                  <Text style={styles.cardTitle}>სრული შეჯამება</Text>

                  <View style={styles.summaryGrid}>
                     <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>სრული შემოსავალი</Text>
                        <Text style={styles.incomeValue}>
                           {analytics.totalIncome} ₾
                        </Text>
                     </View>

                     <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>სრული ხარჯი</Text>
                        <Text style={styles.expenseValue}>
                           {analytics.totalExpenses} ₾
                        </Text>
                     </View>

                     <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>მოგება</Text>
                        <Text
                           style={
                              analytics.profit >= 0
                                 ? styles.profitValue
                                 : styles.expenseValue
                           }
                        >
                           {analytics.profit} ₾
                        </Text>
                     </View>

                     <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>გაქირავებული</Text>
                        <Text style={styles.summaryValue}>
                           {analytics.totalRooms} ოთახი / {analytics.totalDays} დღე
                        </Text>
                     </View>

                     <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>ერთი დღის ხარჯი</Text>
                        <Text style={styles.summaryValue}>
                           {analytics.expensePerDay} ₾
                        </Text>
                     </View>

                     <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>
                           ერთი ოთახის შემოსავალი დღეში
                        </Text>
                        <Text style={styles.summaryValue}>
                           {analytics.incomePerDay} ₾
                        </Text>
                     </View>

                     <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>მიღებული თანხა</Text>
                        <Text style={styles.profitValue}>
                           {analytics.paidIncome} ₾
                        </Text>
                     </View>

                     <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>დარჩენილი თანხა</Text>
                        <Text style={styles.expenseValue}>
                           {analytics.remainingIncome} ₾
                        </Text>
                     </View>
                  </View>
               </View>
            </ScrollView>
         )}
      </SafeAreaView>
   );
};
