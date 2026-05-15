import { FirebaseRoom } from "../store/store_service_type";
import { Reservation } from "../services/type";

const startOfDay = (value: string | Date) => {
   const date = new Date(value);
   date.setHours(0, 0, 0, 0);
   return date;
};

export const datesOverlap = (
   startA: string | Date,
   endA: string | Date,
   startB: string | Date,
   endB: string | Date,
) => {
   const aStart = startOfDay(startA).getTime();
   const aEnd = startOfDay(endA).getTime();
   const bStart = startOfDay(startB).getTime();
   const bEnd = startOfDay(endB).getTime();

   return aStart < bEnd && bStart < aEnd;
};

export const hasRoomConflict = ({
   room,
   startDate,
   endDate,
   ignoreReservationId,
}: {
   room: FirebaseRoom;
   startDate: string;
   endDate: string;
   ignoreReservationId?: string;
}) => {
   if (room.currentStay) {
      const overlapWithStay = datesOverlap(
         startDate,
         endDate,
         room.currentStay.checkInDate,
         room.currentStay.checkOutDate,
      );

      if (overlapWithStay) {
         return "ამ პერიოდში ოთახში მობინადრე გყავს";
      }
   }

   const conflictReservation = (room.reservations || []).find(
      (reservation: Reservation) => {
         if (reservation.id === ignoreReservationId) return false;
         if (reservation.status === "cancelled") return false;

         return datesOverlap(
            startDate,
            endDate,
            reservation.startDate,
            reservation.endDate,
         );
      },
   );

   if (conflictReservation) {
      return "ამ პერიოდში ოთახი უკვე დაჯავშნილია";
   }

   return null;
};
