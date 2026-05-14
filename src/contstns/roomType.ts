export type Room = {
   id: number;
   room: number;

   // true = ახლა დაკავებულია
   isFree: boolean;

   // მიმდინარე დაკავება
   stayingTime: string;
   startTime: string;
   allPrice: string;
   onePrice: string;
   remainingAmount: string;

   // წინასწარი ჯავშანი
   isReserved: boolean;
   reservedStartTime: string;
   reservedEndTime: string;
   reservedAllPrice: string;
   reservedOnePrice: string;
};
