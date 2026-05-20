import React, { useEffect, useMemo, useState } from "react";
import {
   ActivityIndicator,
   ScrollView,
   Text,
   TouchableOpacity,
   View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

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
};

const roundMoney = (value: number) => Math.round(value * 100) / 100;

export const HistoryAnalyticsScreen: React.FC = () => {
   const [history, setHistory] = useState<StayHistory[]>([]);
   const [expenses, setExpenses] = useState<Expense[]>([]);
   const [historyLoading, setHistoryLoading] = useState(true);
   const [expensesLoading, setExpensesLoading] = useState(true);

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
         };

         previous.days += Number(item.daysStayed || 0);
         previous.income += Number(item.totalAmount || 0);
         roomsMap.set(roomId, previous);
      });

      const roomFinances = Array.from(roomsMap.values())
         .map((room) => {
            const expense = room.days * expensePerDay;
            const roomIncomePerDay =
               room.days > 0 ? room.income / room.days : 0;

            return {
               ...room,
               income: roundMoney(room.income),
               expense: roundMoney(expense),
               profit: roundMoney(room.income - expense),
               incomePerDay: roundMoney(roomIncomePerDay),
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
   }, [expenses, history]);

   const loading = historyLoading || expensesLoading;

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
                  <Text style={styles.cardTitle}>ოთახების ფინანსები</Text>

                  {analytics.roomFinances.length === 0 ? (
                     <Text style={styles.emptyText}>ოთახის ისტორია ჯერ არ არის</Text>
                  ) : (
                     analytics.roomFinances.map((room) => (
                        <View key={room.roomId} style={styles.roomRow}>
                           <View style={styles.roomHeader}>
                              <Text style={styles.roomName}>{room.roomName}</Text>
                              <Text style={styles.roomProfit}>
                                 მოგება: {room.profit} ₾
                              </Text>
                           </View>

                           <View style={styles.roomGrid}>
                              <Text style={styles.roomText}>
                                 დღეები: {room.days}
                              </Text>
                              <Text style={styles.roomText}>
                                 ხარჯი: {room.expense} ₾
                              </Text>
                              <Text style={styles.roomText}>
                                 შემოსავალი: {room.income} ₾
                              </Text>
                              <Text style={styles.roomText}>
                                 დღიური შემოსავალი: {room.incomePerDay} ₾
                              </Text>
                           </View>
                        </View>
                     ))
                  )}
               </View>

               <RoomHistoryTable history={history} />

               <View style={styles.summaryCard}>
                  <Text style={styles.cardTitle}>ხარჯები</Text>

                  <Text style={styles.sectionTotal}>
                     სრული ხარჯი: {analytics.totalExpenses} ₾
                  </Text>

                  {expenses.length === 0 ? (
                     <Text style={styles.emptyText}>ხარჯი ჯერ არ არის</Text>
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
