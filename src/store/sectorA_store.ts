import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Room } from "../contstns/sectorB";
import {
   getDateDifferenceInDays,
   getRemainingDays,
   isPastOrNow,
} from "../fun/calculatoionTime";

type TokenState = {
   sectorA: Room[];
   hasHydrated: boolean;
   setHasHydrated: (value: boolean) => void;
   savesectorA: (rooms: Room[]) => void;
   bookRoom: (room: Room) => void;
   closeBookA: () => void;
   changePriceA: () => void;
};

export const useSvavesectorA = create<TokenState>()(
   persist(
      (set, get) => ({
         sectorA: [],
         hasHydrated: false,

         setHasHydrated: (value: boolean) => {
            set({ hasHydrated: value });
         },

         savesectorA: (rooms: Room[]) => {
            const sortArray = [...rooms].sort((a, b) => a.id - b.id);
            set({ sectorA: sortArray });
         },

         bookRoom: (room: Room) => {
            const { sectorA } = get();

            const filteredRooms = sectorA.filter((item) => item.id !== room.id);
            const newArray = [...filteredRooms, room];

            const sortArray = newArray.sort((a, b) => a.id - b.id);

            set({ sectorA: sortArray });
         },

         changePriceA: () => {
            const { sectorA } = get();

            const changedBooks = sectorA.map((item) => {
               if (!item.startTime || !item.stayingTime || !item.onePrice) {
                  return item;
               }

               const remainingDays = getRemainingDays(item.stayingTime);
               const totalDays = getDateDifferenceInDays(
                  item.startTime,
                  item.stayingTime,
               );

               if (Number(totalDays) - Number(remainingDays) > 0) {
                  const usedDays = Number(totalDays) - Number(remainingDays);
                  const leftDays = Number(totalDays) - usedDays;
                  const remainingAmount = Number(item.onePrice) * leftDays;

                  return {
                     ...item,
                     remainingAmount,
                  };
               }

               return item;
            });

            const sortBooks = changedBooks.sort((a, b) => a.id - b.id);
            set({ sectorA: sortBooks });
         },

         closeBookA: () => {
            const { sectorA } = get();

            const closeBooks = sectorA.map((item) => {
               if (!item.stayingTime) {
                  return item;
               }

               if (isPastOrNow(item.stayingTime)) {
                  return {
                     ...item,
                     startTime: "",
                     stayingTime: "",
                     allPrice: "",
                     onePrice: "",
                     remainingAmount: "",
                     isFree: true,
                  };
               }

               return item;
            });

            const sortBooks = closeBooks.sort((a, b) => a.id - b.id);

            set({ sectorA: sortBooks });
         },
      }),
      {
         name: "sectorA",
         storage: createJSONStorage(() => AsyncStorage),
         onRehydrateStorage: () => (state) => {
            state?.setHasHydrated(true);
         },
      },
   ),
);
