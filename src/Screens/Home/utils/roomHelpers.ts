import { FirebaseRoom } from "../../../store/store_service_type";

export const isOccupied = (room: FirebaseRoom) => room.status === "occupied";

export const isReserved = (room: FirebaseRoom) =>
   room.status === "reserved" ||
   (Array.isArray(room.reservations) && room.reservations.length > 0);

export const isFreeRoom = (room: FirebaseRoom) =>
   room.status === "free" && !isReserved(room);

export const getRoomColor = (room: FirebaseRoom) => {
   if (isOccupied(room) && isReserved(room)) return "#7c3aed";
   if (isOccupied(room)) return "#ef4444";
   if (isReserved(room)) return "#2563eb";
   return "#22c55e";
};

export const getRoomBackground = (room: FirebaseRoom) => {
   if (isOccupied(room) && isReserved(room)) return "#f3e8ff";
   if (isOccupied(room)) return "#fff1f2";
   if (isReserved(room)) return "#eff6ff";
   return "#ecfdf5";
};

export const getRoomIcon = (room: FirebaseRoom) => {
   if (isOccupied(room)) return "bed";
   if (isReserved(room)) return "calendar-check";
   return "bed-empty";
};
