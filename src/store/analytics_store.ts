import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Room } from "../contstns/sectorB";

export type AnalyticsRange = "7d" | "1m" | "3m";

export interface AnalyticsSnapshot {
   date: string;
   totalRooms: number;
   bookedRooms: number;
   freeRooms: number;
   occupancyPercent: number;
   totalIncome: number;
   remainingAmount: number;
   paidAmount: number;
}

interface AnalyticsStore {
   history: AnalyticsSnapshot[];
   saveTodaySnapshot: (rooms: Room[]) => void;
   getHistoryByRange: (range: AnalyticsRange) => AnalyticsSnapshot[];
   clearAnalytics: () => void;
}

const getDateKey = (date = new Date()) => {
   return date.toISOString().split("T")[0];
};

const getDaysAgo = (days: number) => {
   const date = new Date();
   date.setDate(date.getDate() - days);
   return date;
};

const createSnapshot = (rooms: Room[]): AnalyticsSnapshot => {
   const bookedRooms = rooms.filter((room) => room.isFree);
   const freeRooms = rooms.filter((room) => !room.isFree);

   const totalIncome = bookedRooms.reduce(
      (sum, room) => sum + Number(room.allPrice || 0),
      0,
   );

   const remainingAmount = bookedRooms.reduce(
      (sum, room) => sum + Number(room.remainingAmount || 0),
      0,
   );

   const paidAmount = totalIncome - remainingAmount;

   const totalRooms = rooms.length;

   return {
      date: getDateKey(),
      totalRooms,
      bookedRooms: bookedRooms.length,
      freeRooms: freeRooms.length,
      occupancyPercent:
         totalRooms > 0
            ? Math.round((bookedRooms.length / totalRooms) * 100)
            : 0,
      totalIncome,
      remainingAmount,
      paidAmount,
   };
};

export const useAnalyticsStore = create<AnalyticsStore>()(
   persist(
      (set, get) => ({
         history: [],

         saveTodaySnapshot: (rooms) => {
            const today = getDateKey();
            const snapshot = createSnapshot(rooms);

            const filteredHistory = get().history.filter(
               (item) => item.date !== today,
            );

            set({
               history: [...filteredHistory, snapshot],
            });
         },

         getHistoryByRange: (range) => {
            const days = range === "7d" ? 7 : range === "1m" ? 30 : 90;
            const startDate = getDaysAgo(days);

            return get()
               .history.filter((item) => new Date(item.date) >= startDate)
               .sort(
                  (a, b) =>
                     new Date(a.date).getTime() - new Date(b.date).getTime(),
               );
         },

         clearAnalytics: () => {
            set({ history: [] });
         },
      }),
      {
         name: "hotel-analytics-store",
         storage: createJSONStorage(() => AsyncStorage),
      },
   ),
);
