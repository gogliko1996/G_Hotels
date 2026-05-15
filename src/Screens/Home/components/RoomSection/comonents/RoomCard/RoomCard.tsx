import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { styles } from "./roomCard.styles";
import {
   getRoomBackground,
   getRoomColor,
   getRoomIcon,
   isOccupied,
   isReserved,
} from "../../../../utils/roomHelpers";
import { FirebaseRoom } from "../../../../../../store/store_service_type";
import { getRemainingDays } from "../../../../../../fun/calculatoionTime";

type Props = {
   item: FirebaseRoom;
   width: `${number}%`;
   dimmed: boolean;
   onPress: () => void;
};

export const RoomCard = ({ item, width, dimmed, onPress }: Props) => {
   const color = getRoomColor(item);

   const remainingDays =
      isOccupied(item) && item.currentStay?.checkOutDate
         ? getRemainingDays(item.currentStay.checkOutDate)
         : null;

   return (
      <TouchableOpacity
         activeOpacity={0.75}
         onPress={onPress}
         style={[
            styles.roomCard,
            {
               width,
               borderColor: color,
               backgroundColor: getRoomBackground(item),
               borderWidth: isOccupied(item) && isReserved(item) ? 2.5 : 1.5,
               opacity: dimmed ? 0.18 : 1,
            },
         ]}
      >
         {remainingDays !== null && remainingDays <= 1 && (
            <View style={styles.warningBadge}>
               <Ionicons name="warning" size={10} color="#fff" />
            </View>
         )}

         {isReserved(item) && (
            <View style={styles.reservedBadge}>
               <Ionicons name="calendar" size={10} color="#fff" />
            </View>
         )}

         <View style={[styles.iconCircle, { backgroundColor: color }]}>
            <MaterialCommunityIcons
               name={getRoomIcon(item)}
               size={18}
               color="#fff"
            />
         </View>

         <Text style={[styles.roomText, { color }]}>{item.room}</Text>

         {remainingDays !== null && (
            <Text
               style={[
                  styles.daysText,
                  {
                     color:
                        remainingDays <= 1
                           ? "#ef4444"
                           : remainingDays <= 2
                             ? "#f59e0b"
                             : "#22c55e",
                  },
               ]}
            >
               {remainingDays} დღე
            </Text>
         )}

         {!isOccupied(item) && isReserved(item) && (
            <Text style={[styles.daysText, { color: "#2563eb" }]}>ჯავშანი</Text>
         )}

         {isOccupied(item) && isReserved(item) && (
            <Text style={[styles.daysText, { color: "#7c3aed" }]}>
               +ჯავშანი
            </Text>
         )}
      </TouchableOpacity>
   );
};
