import {
   collection,
   addDoc,
   doc,
   setDoc,
   updateDoc,
   deleteDoc,
   onSnapshot,
   arrayUnion,
   serverTimestamp,
   increment,
   getDoc,
   Timestamp,
   query,
   orderBy,
} from "firebase/firestore";

import { db } from "../../firebase";

import { sectorA } from "../contstns/sectorA";
import { sectorB } from "../contstns/sectorB";
import { Room } from "../contstns/roomType";

import { Reservation, RoomStatus, Sector, Stay, StayHistory } from "./type";

const normalizeRoom = (room: Room, sector: Sector) => ({
   id: room.id,
   room: room.room,
   sector,

   status: "free" as RoomStatus,

   currentStay: null as Stay | null,
   reservations: [] as Reservation[],

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
         await setDoc(doc(db, "rooms", `${room.sector}-${room.room}`), room);
      }

      console.log("ოთახები შეიქმნა Firebase-ში");
   } catch (error) {
      console.log(error);
   }
};

const toDate = (value?: string) => {
   if (!value) return new Date();

   const date = new Date(value);
   return Number.isNaN(date.getTime()) ? new Date() : date;
};

export const createStayHistoryItem = (
   firebaseId: string,
   room: any,
   stay: Stay,
   overrides?: {
      daysStayed?: number;
      totalAmount?: number;
      isPaid?: boolean;
      checkOut?: Date;
   },
): StayHistory => {
   const daysStayed = Number(overrides?.daysStayed ?? stay.days ?? 0);
   const totalAmount = Number(overrides?.totalAmount ?? stay.totalPrice ?? 0);
   const isPaid = Boolean(overrides?.isPaid ?? stay.isPaid);
   const pricePerDay = daysStayed > 0 ? totalAmount / daysStayed : 0;

   return {
      id: Date.now().toString(),
      roomId: firebaseId,
      roomName: `ოთახი ${room?.room || ""}`.trim(),
      guestName: stay.guestName || "",
      guestPhone: stay.guestPhone || "",
      checkIn: Timestamp.fromDate(toDate(stay.checkInDate)),
      checkOut: Timestamp.fromDate(overrides?.checkOut || toDate(stay.checkOutDate)),
      daysStayed,
      pricePerDay,
      totalAmount,
      paidAmount: isPaid ? totalAmount : 0,
      remainingAmount: isPaid ? 0 : totalAmount,
      isPaid,
   };
};

export const listenRooms = (callback: (rooms: any[]) => void) => {
   return onSnapshot(collection(db, "rooms"), (snapshot) => {
      const rooms = snapshot.docs.map((docItem) => ({
         firebaseId: docItem.id,
         ...docItem.data(),
      }));

      callback(rooms);
   });
};

export const listenRoomHistory = (callback: (history: StayHistory[]) => void) => {
   const historyQuery = query(
      collection(db, "roomHistory"),
      orderBy("checkOut", "desc"),
   );

   return onSnapshot(historyQuery, (snapshot) => {
      const history = snapshot.docs
         .filter((docItem) => docItem.id !== "__schema")
         .map((docItem) => ({
            id: docItem.id,
            ...docItem.data(),
         })) as StayHistory[];

      callback(history);
   });
};

export const updateRoom = async (
   firebaseId: string,
   values: Record<string, any>,
) => {
   await updateDoc(doc(db, "rooms", firebaseId), {
      ...values,
      updatedAt: serverTimestamp(),
   });
};

export const deleteRoom = async (firebaseId: string) => {
   await deleteDoc(doc(db, "rooms", firebaseId));
};

export const addReservation = async (
   firebaseId: string,
   reservation: Omit<Reservation, "id" | "status" | "createdAt" | "totalPrice">,
) => {
   const newReservation: Reservation = {
      ...reservation,
      id: Date.now().toString(),
      isPaid: reservation.isPaid ?? false,
      totalPrice: reservation.days * reservation.oneDayPrice,
      status: "reserved",
      createdAt: new Date().toISOString(),
   };

   await updateDoc(doc(db, "rooms", firebaseId), {
      status: "reserved",
      reservations: arrayUnion(newReservation),
      totalReservations: increment(1),
      updatedAt: serverTimestamp(),
   });
};

export const startStay = async (
   firebaseId: string,
   stay: Omit<Stay, "id" | "createdAt" | "totalPrice">,
) => {
   const newStay: Stay = {
      ...stay,
      id: Date.now().toString(),
      isPaid: stay.isPaid ?? false,
      totalPrice: stay.days * stay.oneDayPrice,
      createdAt: new Date().toISOString(),
   };

   await updateDoc(doc(db, "rooms", firebaseId), {
      status: "occupied",
      currentStay: newStay,
      totalIncome: increment(newStay.totalPrice),
      totalOccupiedDays: increment(newStay.days),
      updatedAt: serverTimestamp(),
   });
};

export const finishStay = async (
   firebaseId: string,
   historyOverrides?: {
      daysStayed?: number;
      totalAmount?: number;
      isPaid?: boolean;
      checkOut?: Date;
   },
) => {
   const roomRef = doc(db, "rooms", firebaseId);
   const snapshot = await getDoc(roomRef);
   const room = snapshot.data();
   const currentStay = room?.currentStay as Stay | null | undefined;

   const values: Record<string, any> = {
      status: "free",
      currentStay: null,
      updatedAt: serverTimestamp(),
   };

   if (currentStay) {
      const daysStayed = Number(historyOverrides?.daysStayed ?? currentStay.days);
      const totalAmount = Number(
         historyOverrides?.totalAmount ?? currentStay.totalPrice,
      );
      const daysDelta = daysStayed - Number(currentStay.days || 0);
      const totalDelta = totalAmount - Number(currentStay.totalPrice || 0);

      if (daysDelta !== 0) {
         values.totalOccupiedDays = increment(daysDelta);
      }

      if (totalDelta !== 0) {
         values.totalIncome = increment(totalDelta);
      }

      await addDoc(
         collection(db, "roomHistory"),
         createStayHistoryItem(firebaseId, room, currentStay, historyOverrides),
      );
   }

   await updateDoc(roomRef, values);
};

export const updateReservation = async (
   firebaseId: string,
   reservationId: string,
   reservations: Reservation[],
   updatedReservation: Reservation,
) => {
   const updatedReservations = reservations.map((reservation) =>
      reservation.id === reservationId ? updatedReservation : reservation,
   );

   await updateDoc(doc(db, "rooms", firebaseId), {
      reservations: updatedReservations,
      updatedAt: serverTimestamp(),
   });
};

export const deleteReservation = async (
   firebaseId: string,
   reservationId: string,
   reservations: Reservation[],
) => {
   const updatedReservations = reservations.filter(
      (reservation) => reservation.id !== reservationId,
   );

   await updateDoc(doc(db, "rooms", firebaseId), {
      reservations: updatedReservations,
      totalReservations: increment(-1),
      status: updatedReservations.length ? "reserved" : "free",
      updatedAt: serverTimestamp(),
   });
};

export const updateStay = async (firebaseId: string, stay: Stay) => {
   await updateDoc(doc(db, "rooms", firebaseId), {
      status: "occupied",
      currentStay: stay,
      updatedAt: serverTimestamp(),
   });
};

export const removeStay = async (firebaseId: string) => {
   await finishStay(firebaseId);
};

export const createHistoryTableInFirebase = async () => {
   try {
      await setDoc(doc(db, "roomHistory", "__schema"), {
         type: "room-history-table",
         roomId: "",
         roomName: "",
         guestName: "",
         guestPhone: "",
         checkIn: serverTimestamp(),
         checkOut: serverTimestamp(),
         daysStayed: 0,
         pricePerDay: 0,
         totalAmount: 0,
         paidAmount: 0,
         remainingAmount: 0,
         isPaid: false,
         createdAt: serverTimestamp(),
         updatedAt: serverTimestamp(),
      });

      console.log("ისტორიის ცხრილი შეიქმნა Firebase-ში");
   } catch (error) {
      console.log(error);
      throw error;
   }
};

export const clearStayWithoutHistory = async (firebaseId: string) => {
   await updateDoc(doc(db, "rooms", firebaseId), {
      status: "free",
      currentStay: null,
      updatedAt: serverTimestamp(),
   });
};
