import {
   collection,
   doc,
   setDoc,
   updateDoc,
   deleteDoc,
   onSnapshot,
   arrayUnion,
   serverTimestamp,
   increment,
} from "firebase/firestore";

import { db } from "../../firebase";

import { sectorA } from "../contstns/sectorA";
import { sectorB } from "../contstns/sectorB";
import { Room } from "../contstns/roomType";

import { Reservation, RoomStatus, Sector, Stay } from "./type";

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

export const listenRooms = (callback: (rooms: any[]) => void) => {
   return onSnapshot(collection(db, "rooms"), (snapshot) => {
      const rooms = snapshot.docs.map((docItem) => ({
         firebaseId: docItem.id,
         ...docItem.data(),
      }));

      callback(rooms);
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

export const finishStay = async (firebaseId: string) => {
   await updateDoc(doc(db, "rooms", firebaseId), {
      status: "free",
      currentStay: null,
      updatedAt: serverTimestamp(),
   });
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
   await updateDoc(doc(db, "rooms", firebaseId), {
      status: "free",
      currentStay: null,
      updatedAt: serverTimestamp(),
   });
};
