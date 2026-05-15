import { create } from "zustand";
import { Reservation, Stay } from "../services/type";
import {
   addReservation,
   deleteReservation,
   finishStay,
   listenRooms,
   removeStay,
   startStay,
   updateReservation,
   updateRoom,
   updateStay,
} from "../services/roomsService";
import { FirebaseRoom } from "./store_service_type";

type RoomsStore = {
   rooms: FirebaseRoom[];
   sectorA: FirebaseRoom[];
   sectorB: FirebaseRoom[];
   room: FirebaseRoom | null;
   loading: boolean;
   error: string | null;
   unsubscribe: null | (() => void);

   getRoomById: (firebaseId: string) => FirebaseRoom | undefined;
   listenFirebaseRooms: () => void;
   stopListenFirebaseRooms: () => void;

   updateRoomById: (
      firebaseId: string,
      values: Partial<FirebaseRoom>,
   ) => Promise<void>;

   addReservationToRoom: (
      firebaseId: string,
      reservation: Omit<
         Reservation,
         "id" | "status" | "createdAt" | "totalPrice"
      >,
   ) => Promise<void>;

   updateReservationInRoom: (
      firebaseId: string,
      reservationId: string,
      updatedReservation: Reservation,
   ) => Promise<void>;

   deleteReservationFromRoom: (
      firebaseId: string,
      reservationId: string,
   ) => Promise<void>;

   startStayInRoom: (
      firebaseId: string,
      stay: Omit<Stay, "id" | "createdAt" | "totalPrice">,
   ) => Promise<void>;

   updateStayInRoom: (firebaseId: string, stay: Stay) => Promise<void>;

   removeStayFromRoom: (firebaseId: string) => Promise<void>;
   finishStayInRoom: (firebaseId: string) => Promise<void>;
};

const sortRooms = (rooms: FirebaseRoom[]) =>
   [...rooms].sort((a, b) => a.id - b.id);

const splitSectors = (rooms: FirebaseRoom[]) => ({
   sectorA: sortRooms(rooms.filter((room) => room.sector === "A")),
   sectorB: sortRooms(rooms.filter((room) => room.sector === "B")),
});

export const useRoomsStore = create<RoomsStore>((set, get) => ({
   rooms: [],
   sectorA: [],
   sectorB: [],
   room: null,
   loading: true,
   error: null,
   unsubscribe: null,

   getRoomById: (firebaseId) => {
      const selectedRoom = get().rooms.find(
         (room) => room.firebaseId === firebaseId,
      );

      set({ room: selectedRoom || null });

      return selectedRoom;
   },

   listenFirebaseRooms: () => {
      const oldUnsubscribe = get().unsubscribe;

      if (oldUnsubscribe) oldUnsubscribe();

      set({ loading: true, error: null });

      const unsubscribe = listenRooms((firebaseRooms) => {
         const rooms = firebaseRooms as FirebaseRoom[];
         const { sectorA, sectorB } = splitSectors(rooms);

         const currentRoomId = get().room?.firebaseId;

         const updatedSelectedRoom = currentRoomId
            ? rooms.find((room) => room.firebaseId === currentRoomId) || null
            : null;

         set({
            rooms,
            sectorA,
            sectorB,
            room: updatedSelectedRoom,
            loading: false,
            error: null,
            unsubscribe,
         });
      });

      set({ unsubscribe });
   },

   stopListenFirebaseRooms: () => {
      const unsubscribe = get().unsubscribe;
      if (unsubscribe) unsubscribe();
      set({ unsubscribe: null });
   },

   updateRoomById: async (firebaseId, values) => {
      await updateRoom(firebaseId, values);
   },

   addReservationToRoom: async (firebaseId, reservation) => {
      await addReservation(firebaseId, reservation);
   },

   updateReservationInRoom: async (
      firebaseId,
      reservationId,
      updatedReservation,
   ) => {
      const currentRoom = get().room;
      if (!currentRoom) return;

      await updateReservation(
         firebaseId,
         reservationId,
         currentRoom.reservations || [],
         updatedReservation,
      );
   },

   deleteReservationFromRoom: async (firebaseId, reservationId) => {
      const currentRoom = get().room;
      if (!currentRoom) return;

      await deleteReservation(
         firebaseId,
         reservationId,
         currentRoom.reservations || [],
      );
   },

   startStayInRoom: async (firebaseId, stay) => {
      await startStay(firebaseId, stay);
   },

   updateStayInRoom: async (firebaseId, stay) => {
      await updateStay(firebaseId, stay);
   },

   removeStayFromRoom: async (firebaseId) => {
      await removeStay(firebaseId);
   },

   finishStayInRoom: async (firebaseId) => {
      await finishStay(firebaseId);
   },
}));
