import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { FirebaseRoom } from "../store/store_service_type";
import { createStayHistoryItem, updateRoom } from "./roomsService";
import { Reservation } from "./type";

const startOfDay = (value: Date | string) => {
   const date = new Date(value);
   date.setHours(0, 0, 0, 0);
   return date;
};

const getDiffDays = (from: Date | string, to: Date | string) => {
   const start = startOfDay(from).getTime();
   const end = startOfDay(to).getTime();

   return Math.max(0, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
};

export const autoUpdateRooms = async (rooms: FirebaseRoom[]) => {
   const today = startOfDay(new Date());

   for (const room of rooms) {
      let changed = false;

      let currentStay = room.currentStay || null;
      let reservations = [...(room.reservations || [])];
      let historyItem: ReturnType<typeof createStayHistoryItem> | null = null;

      /**
       * 1. ჯერ მობინადრე შემოწმდეს.
       * თუ დღეს checkout დღეა ან გასულია — წაიშალოს.
       */
      if (currentStay) {
         const calculatedRemainingDays = getDiffDays(
            today,
            currentStay.checkOutDate,
         );

         const savedRemainingDays = Number(
            (currentStay as any).remainingDays ?? currentStay.days,
         );

         if (savedRemainingDays !== calculatedRemainingDays) {
            currentStay = {
               ...currentStay,
               remainingDays: calculatedRemainingDays,
            } as any;

            changed = true;
         }

         if (calculatedRemainingDays <= 0) {
            historyItem = createStayHistoryItem(
               room.firebaseId,
               room,
               currentStay as any,
            );
            currentStay = null;
            changed = true;
         }
      }

      /**
       * 2. ახლა უკვე თუ ოთახი თავისუფალია,
       * დღევანდელი ჯავშანი გადავიდეს მობინადრედ.
       */
      let reservationToMove: Reservation | null = null;

      reservations = reservations.filter((reservation) => {
         const reservationStart = startOfDay(reservation.startDate);
         const reservationEnd = startOfDay(reservation.endDate);

         /**
          * ვადაგასული ჯავშანი წაიშალოს.
          */
         if (today >= reservationEnd) {
            changed = true;
            return false;
         }

         /**
          * თუ ჯავშნის დაწყების დღე მოვიდა
          * და currentStay უკვე ცარიელია,
          * გადავიტანოთ მობინადრედ და ჯავშნებიდან წავშალოთ.
          */
         if (
            today >= reservationStart &&
            today < reservationEnd &&
            !currentStay &&
            !reservationToMove
         ) {
            reservationToMove = reservation;
            changed = true;
            return false;
         }

         return true;
      });
      const selectedReservation = reservationToMove as Reservation | null;

      if (selectedReservation) {
         currentStay = {
            id: selectedReservation.id,
            guestName: selectedReservation.guestName,
            guestPhone: selectedReservation.guestPhone,
            isPaid: selectedReservation.isPaid ?? false,
            checkInDate: selectedReservation.startDate,
            checkOutDate: selectedReservation.endDate,
            days: selectedReservation.days,
            remainingDays: getDiffDays(today, selectedReservation.endDate),
            oneDayPrice: selectedReservation.oneDayPrice,
            totalPrice: selectedReservation.totalPrice,
            createdAt: new Date().toISOString(),
         } as any;

         changed = true;
      }

      const nextStatus = currentStay
         ? "occupied"
         : reservations.length > 0
           ? "reserved"
           : "free";

      if (nextStatus !== room.status) {
         changed = true;
      }

      if (changed) {
         const values: Record<string, any> = {
            currentStay,
            reservations,
            status: nextStatus,
            totalReservations: reservations.length,
         };

         if (historyItem) {
            await addDoc(collection(db, "roomHistory"), historyItem);
         }

         await updateRoom(room.firebaseId, values);
      }
   }
};
