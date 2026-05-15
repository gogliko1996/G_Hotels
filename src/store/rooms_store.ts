import { create } from "zustand";

import { Reservation, Stay } from "../services/type";
import {
   addReservation,
   deleteRoom,
   finishStay,
   listenRooms,
   startStay,
   updateRoom,
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

   removeRoomById: (firebaseId: string) => Promise<void>;

   addReservationToRoom: (
      firebaseId: string,
      reservation: Omit<
         Reservation,
         "id" | "status" | "createdAt" | "totalPrice"
      >,
   ) => Promise<void>;

   startStayInRoom: (
      firebaseId: string,
      stay: Omit<Stay, "id" | "createdAt" | "totalPrice">,
   ) => Promise<void>;

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
      const { sectorA, sectorB } = get();

      const selectedRoom = [...sectorA, ...sectorB].find(
         (room) => room.firebaseId === firebaseId,
      );

      set({
         room: selectedRoom || null,
      });

      return selectedRoom;
   },

   listenFirebaseRooms: () => {
      const oldUnsubscribe = get().unsubscribe;

      if (oldUnsubscribe) {
         oldUnsubscribe();
      }

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

      if (unsubscribe) {
         unsubscribe();
      }

      set({ unsubscribe: null });
   },

   updateRoomById: async (firebaseId, values) => {
      await updateRoom(firebaseId, values);
   },

   removeRoomById: async (firebaseId) => {
      await deleteRoom(firebaseId);

      const currentRoom = get().room;

      if (currentRoom?.firebaseId === firebaseId) {
         set({ room: null });
      }
   },

   addReservationToRoom: async (firebaseId, reservation) => {
      await addReservation(firebaseId, reservation);
   },

   startStayInRoom: async (firebaseId, stay) => {
      await startStay(firebaseId, stay);
   },

   finishStayInRoom: async (firebaseId) => {
      await finishStay(firebaseId);
   },
}));
