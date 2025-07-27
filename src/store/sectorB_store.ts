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
   sectorB: Room[];
   savesectorB: (rooms: Room[]) => void;
   bookRoomB: (room: Room) => void;
   closeBookB: () => void;
   changePriceB: () => void;
};

export const useSvavesectorB = create<TokenState>()(
   persist(
      (set, get) => ({
         sectorB: [],

         savesectorB: (rooms: Room[]) => {
            const sorArrai = rooms.sort((a, b) => a.id - b.id);
            set({ sectorB: sorArrai });
         },

         bookRoomB: (room: Room) => {
            const { sectorB } = get();

            const findeObj = sectorB?.filter((item) => item.id !== room.id);

            const newarray = [...findeObj, room];
            const sorArrai = newarray.sort((a, b) => a.id - b.id);

            set({ sectorB: sorArrai });
         },

         changePriceB: () => {
            const { sectorB } = get();

            const cangeBooks = sectorB.map((item) => {
               const data = getRemainingDays(item.stayingTime);
               const satatData = getDateDifferenceInDays(
                  item?.startTime,
                  item?.stayingTime,
               );

               if (Number(satatData) - Number(data) > 0) {
                  const num = Number(satatData) - Number(data);
                  const a = Number(satatData) - num;
                  const b = Number(item.allPrice) * a;

                  return {
                     ...item,
                     remainingAmount: b,
                  };
               } else {
                  return item;
               }
            });
            const sortBooks = cangeBooks.sort((a, b) => a.id - b.id);
            set({ sectorB: sortBooks });
         },

         closeBookB: () => {
            const { sectorB } = get();

            const closeBooks = sectorB.map((item) => {
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

            set({ sectorB: sortBooks });
         },
      }),
      {
         name: "sectorB",
         storage: createJSONStorage(() => AsyncStorage),
      },
   ),
);
