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
   savesectorA: (rooms: Room[]) => void;
   bookRoom: (room: Room) => void;
   closeBookA: () => void;
   changePriceA: () => void;
};

export const useSvavesectorA = create<TokenState>()(
   persist(
      (set, get) => ({
         sectorA: [],

         savesectorA: (rooms: Room[]) => {
            const sorArrai = rooms.sort((a, b) => a.id - b.id);
            set({ sectorA: sorArrai });
         },

         bookRoom: (room: Room) => {
            const { sectorA } = get();

            const findeObj = sectorA?.filter((item) => item.id !== room.id);

            const newarray = [...findeObj, room];
            const sorArrai = newarray.sort((a, b) => a.id - b.id);

            set({ sectorA: sorArrai });
         },

         changePriceA: () => {
            const { sectorA } = get();

            const cangeBooks = sectorA.map((item) => {
               const data = getRemainingDays(item.stayingTime);
               const satatData = getDateDifferenceInDays(
                  item?.startTime,
                  item?.stayingTime,
               );

               if (Number(satatData) - Number(data) > 0) {
                  const num = Number(satatData) - Number(data);
                  const a = Number(satatData) - num;
                  const b = Number(item.onePrice) * a;

                  return {
                     ...item,
                     remainingAmount: b,
                  };
               } else {
                  return item;
               }
            });
            const sortBooks = cangeBooks.sort((a, b) => a.id - b.id);
            set({ sectorA: sortBooks });
         },

         closeBookA: () => {
            const { sectorA } = get();

            const closeBooks = sectorA.map((item) => {
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
               } else {
                  return item;
               }
            });

            const sortBooks = closeBooks.sort((a, b) => a.id - b.id);

            set({ sectorA: sortBooks });
         },
      }),
      {
         name: "sectorA",
         storage: createJSONStorage(() => AsyncStorage),
      },
   ),
);
