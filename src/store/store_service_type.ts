export type Sector = "A" | "B";

export type RoomStatus = "free" | "occupied" | "reserved";

export type Stay = {
   id: string;
   guestName?: string;
   checkInDate: string;
   checkOutDate: string;
   days: number;
   oneDayPrice: number;
   totalPrice: number;
   createdAt: string;
};

export type Reservation = {
   id: string;
   guestName?: string;
   startDate: string;
   endDate: string;
   days: number;
   oneDayPrice: number;
   totalPrice: number;
   status: "reserved" | "active" | "finished" | "cancelled";
   createdAt: string;
};

export type FirebaseRoom = {
   firebaseId: string;
   id: number;
   room: number;
   sector: Sector;
   status: RoomStatus;
   currentStay: Stay | null;
   reservations: Reservation[];
   totalIncome: number;
   totalReservations: number;
   totalOccupiedDays: number;
};
