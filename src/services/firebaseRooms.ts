import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import { sectorA } from "../contstns/sectorA";
import { sectorB } from "../contstns/sectorB";

import { db } from "../../firebase";

const normalizeRoom = (room: any, sector: "A" | "B") => ({
   id: room.id,

   room: room.room,

   sector,

   status: "free",

   currentStay: null,

   reservations: [],

   totalIncome: 0,

   totalReservations: 0,

   totalOccupiedDays: 0,

   createdAt: serverTimestamp(),

   updatedAt: serverTimestamp(),
});

export const createRoomsInFirebase = async () => {
   try {
      const rooms = [
         ...sectorA.map((room) => normalizeRoom(room, "A")),

         ...sectorB.map((room) => normalizeRoom(room, "B")),
      ];

      for (const room of rooms) {
         await setDoc(
            doc(db, "rooms", `${room.sector}-${room.room}`),

            room,
         );
      }

      console.log("ოთახები შეიქმნა Firebase-ში");
   } catch (error) {
      console.log(error);
   }
};
