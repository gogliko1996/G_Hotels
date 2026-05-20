export type Sector = "A" | "B";

export type RoomStatus = "free" | "occupied" | "reserved";

export type Stay = {
   id: string;
   guestName?: string;
   guestPhone?: string;
   isPaid: boolean;
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
   guestPhone?: string;
   isPaid: boolean;
   startDate: string;
   endDate: string;
   days: number;
   oneDayPrice: number;
   totalPrice: number;
   status: "reserved" | "active" | "finished" | "cancelled";
   createdAt: string;
};
