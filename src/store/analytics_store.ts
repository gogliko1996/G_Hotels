import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Room } from "../contstns/roomType";

export type AnalyticsRange = "7d" | "1m" | "3m";

export interface AnalyticsSnapshot {
   date: string;

   totalRooms: number;

   busyRooms: number;
   reservedRooms: number;
   freeRooms: number;

   busyAndReservedRooms: number;

   occupancyPercent: number;
   reservedPercent: number;

   totalIncome: number;
   remainingAmount: number;
   paidAmount: number;

   reservedIncome: number;
   expectedIncome: number;
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
   date.setHours(0, 0, 0, 0);
   return date;
};

const createSnapshot = (rooms: Room[]): AnalyticsSnapshot => {
   const totalRooms = rooms.length;

   // დაკავებული ოთახები
   const busyRooms = rooms.filter((room) => room.isFree);

   // წინასწარ დაჯავშნილი ოთახები
   const reservedRooms = rooms.filter((room) => room.isReserved);

   // დაკავებული + დაჯავშნილი ერთდროულად
   const busyAndReservedRooms = rooms.filter(
      (room) => room.isFree && room.isReserved,
   );

   // სრულად თავისუფალი — არც დაკავებული, არც დაჯავშნილი
   const freeRooms = rooms.filter((room) => !room.isFree && !room.isReserved);

   // მიმდინარე დაკავებებიდან შემოსავალი
   const totalIncome = busyRooms.reduce(
      (sum, room) => sum + Number(room.allPrice || 0),
      0,
   );

   // მიმდინარე დაკავებებიდან დარჩენილი თანხა
   const remainingAmount = busyRooms.reduce(
      (sum, room) => sum + Number(room.remainingAmount || 0),
      0,
   );

   // გადახდილი თანხა
   const paidAmount = totalIncome - remainingAmount;

   // მომავალი ჯავშნებიდან მოსალოდნელი თანხა
   const reservedIncome = reservedRooms.reduce(
      (sum, room) => sum + Number(room.reservedAllPrice || 0),
      0,
   );

   // მიმდინარე + მომავალი ჯავშნების სრული თანხა
   const expectedIncome = totalIncome + reservedIncome;

   return {
      date: getDateKey(),

      totalRooms,

      busyRooms: busyRooms.length,
      reservedRooms: reservedRooms.length,
      freeRooms: freeRooms.length,

      busyAndReservedRooms: busyAndReservedRooms.length,

      occupancyPercent:
         totalRooms > 0 ? Math.round((busyRooms.length / totalRooms) * 100) : 0,

      reservedPercent:
         totalRooms > 0
            ? Math.round((reservedRooms.length / totalRooms) * 100)
            : 0,

      totalIncome,
      remainingAmount,
      paidAmount,

      reservedIncome,
      expectedIncome,
   };
};

export const useAnalyticsStore = create<AnalyticsStore>()(
   persist(
      (set, get) => ({
         history: [],

         saveTodaySnapshot: (rooms: Room[]) => {
            const today = getDateKey();
            const snapshot = createSnapshot(rooms);

            const filteredHistory = get().history.filter(
               (item) => item.date !== today,
            );

            set({
               history: [...filteredHistory, snapshot],
            });
         },

         getHistoryByRange: (range: AnalyticsRange) => {
            const days = range === "7d" ? 7 : range === "1m" ? 30 : 90;
            const startDate = getDaysAgo(days);

            return get()
               .history.filter((item) => {
                  const itemDate = new Date(item.date);
                  itemDate.setHours(0, 0, 0, 0);

                  return itemDate >= startDate;
               })
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
