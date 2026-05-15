import { FirebaseRoom } from "../../../store/store_service_type";

export const hasReservations = (room: FirebaseRoom) =>
   Array.isArray(room.reservations) && room.reservations.length > 0;

export const isOccupied = (room: FirebaseRoom) =>
   room.status === "occupied" || !!room.currentStay;

export const isReserved = (room: FirebaseRoom) =>
   room.status === "reserved" || hasReservations(room);

export const isOccupiedAndReserved = (room: FirebaseRoom) =>
   isOccupied(room) && hasReservations(room);

export const isFreeRoom = (room: FirebaseRoom) =>
   !isOccupied(room) && !isReserved(room);

export const getRoomColor = (room: FirebaseRoom) => {
   if (isOccupiedAndReserved(room)) return "#000000";
   if (isOccupied(room)) return "#ef4444";
   if (isReserved(room)) return "#2563eb";
   return "#22c55e";
};

export const getRoomBackground = (room: FirebaseRoom) => {
   if (isOccupiedAndReserved(room)) return "#e5e7eb";
   if (isOccupied(room)) return "#fff1f2";
   if (isReserved(room)) return "#eff6ff";
   return "#ecfdf5";
};

export const getRoomIcon = (room: FirebaseRoom) => {
   if (isOccupiedAndReserved(room)) return "bed-clock";
   if (isOccupied(room)) return "bed";
   if (isReserved(room)) return "calendar-check";
   return "bed-empty";
};
