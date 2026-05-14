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

export const sectorB: Room[] = [
   createRoom(1, 407),
   createRoom(2, 408),
   createRoom(3, 409),
   createRoom(4, 410),
   createRoom(5, 411),

   createRoom(7, 307),
   createRoom(8, 308),
   createRoom(9, 309),
   createRoom(10, 310),
   createRoom(11, 311),

   createRoom(13, 207),
   createRoom(14, 208),
   createRoom(15, 209),
   createRoom(16, 210),
   createRoom(17, 211),

   createRoom(19, 107),
   createRoom(20, 108),
   createRoom(21, 109),
   createRoom(22, 110),
   createRoom(23, 111),
];
