import { Room } from "./roomType";

const createRoom = (id: number, room: number): Room => ({
   id,
   room,
   isFree: false,
   stayingTime: "",
   startTime: "",
   allPrice: "",
   onePrice: "",
   remainingAmount: "",
   isReserved: false,
   reservedStartTime: "",
   reservedEndTime: "",
   reservedAllPrice: "",
   reservedOnePrice: "",
});

export const sectorA: Room[] = [
   createRoom(1, 401),
   createRoom(2, 402),
   createRoom(3, 403),
   createRoom(4, 404),
   createRoom(5, 405),
   createRoom(6, 406),

   createRoom(7, 301),
   createRoom(8, 302),
   createRoom(9, 303),
   createRoom(10, 304),
   createRoom(11, 305),
   createRoom(12, 306),

   createRoom(13, 201),
   createRoom(14, 202),
   createRoom(15, 204),
   createRoom(16, 205),
   createRoom(17, 203),
   createRoom(18, 206),

   createRoom(19, 101),
   createRoom(20, 102),
   createRoom(21, 103),
   createRoom(22, 104),
   createRoom(23, 105),
   createRoom(24, 106),
];
