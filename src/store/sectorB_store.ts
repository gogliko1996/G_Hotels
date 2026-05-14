import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Room } from "../contstns/roomType";
import {
   getDateDifferenceInDays,
   getRemainingDays,
   isPastOrNow,
} from "../fun/calculatoionTime";

type SectorBState = {
   sectorB: Room[];
   hasHydrated: boolean;
   setHasHydrated: (value: boolean) => void;
   savesectorB: (rooms: Room[]) => void;
   bookRoomB: (room: Room) => void;
   closeBookB: () => void;
   changePriceB: () => void;
};

export const useSvavesectorB = create<SectorBState>()(
   persist(
      (set, get) => ({
         sectorB: [],
         hasHydrated: false,

         setHasHydrated: (value: boolean) => {
            set({ hasHydrated: value });
         },

         savesectorB: (rooms: Room[]) => {
            const sortArray = [...rooms].sort((a, b) => a.id - b.id);
            set({ sectorB: sortArray });
         },

         bookRoomB: (room: Room) => {
            const { sectorB } = get();

            const filteredRooms = sectorB.filter((item) => item.id !== room.id);
            const newArray = [...filteredRooms, room];

            const sortArray = newArray.sort((a, b) => a.id - b.id);

            set({ sectorB: sortArray });
         },

         changePriceB: () => {
            const { sectorB } = get();

            const changedBooks = sectorB.map((item) => {
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
                     remainingAmount: remainingAmount.toString(),
                  };
               }

               return item;
            });

            const sortBooks = changedBooks.sort((a, b) => a.id - b.id);
            set({ sectorB: sortBooks });
         },

         closeBookB: () => {
            const { sectorB } = get();

            const closeBooks = sectorB.map((item) => {
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
                     isFree: false,
                  };
               }

               return item;
            });

            const sortBooks = closeBooks.sort((a, b) => a.id - b.id);

            set({ sectorB: sortBooks });
         },
      }),
      {
         name: "sectorB",
         storage: createJSONStorage(() => AsyncStorage),
         onRehydrateStorage: () => (state) => {
            state?.setHasHydrated(true);
         },
      },
   ),
);
