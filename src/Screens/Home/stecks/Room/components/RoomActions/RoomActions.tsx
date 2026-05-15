import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { styles } from "./roomActions.styles";
import { FirebaseRoom } from "../../../../../../store/store_service_type";

type Props = {
   room: FirebaseRoom;
   onOccupyPress: () => void;
   onReservationPress: () => void;
   onFinishPress: () => void;
   onDeletePress: () => void;
};

export const RoomActions = ({
   room,
   onOccupyPress,
   onReservationPress,
   onFinishPress,
}: Props) => {
   return (
      <View style={styles.card}>
         <Text style={styles.title}>მოქმედებები</Text>

         <TouchableOpacity style={styles.greenButton} onPress={onOccupyPress}>
            <Ionicons name="person-add-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>
               {room.currentStay
                  ? "მობინადრის განახლება"
                  : "მომხმარებლის შეშვება"}
            </Text>
         </TouchableOpacity>

         <TouchableOpacity
            style={styles.blueButton}
            onPress={onReservationPress}
         >
            <Ionicons name="calendar-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>ოთახის დაჯავშნა</Text>
         </TouchableOpacity>

         {room.currentStay && (
            <TouchableOpacity style={styles.grayButton} onPress={onFinishPress}>
               <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color="#fff"
               />
               <Text style={styles.buttonText}>ოთახის გათავისუფლება</Text>
            </TouchableOpacity>
         )}
      </View>
   );
};
