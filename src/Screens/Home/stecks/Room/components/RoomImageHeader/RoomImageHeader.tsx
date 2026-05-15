import React from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { styles } from "./roomImageHeader.styles";
import { FirebaseRoom } from "../../../../../../store/store_service_type";
import roomImage from "../../../../../../../assets/room.jpg";

type Props = {
   room: FirebaseRoom;
};

export const RoomImageHeader = ({ room }: Props) => {
   return (
      <ImageBackground
         source={roomImage}
         imageStyle={styles.imageRadius}
         style={styles.image}
      >
         <View style={styles.overlay}>
            <TouchableOpacity
               style={styles.backButton}
               onPress={() => router.back()}
            >
               <Ionicons name="chevron-back" size={26} color="#fff" />
            </TouchableOpacity>

            <View>
               <Text style={styles.roomTitle}>
                  {room.sector}-კორპუსი / ოთახი {room.room}
               </Text>

               <Text style={styles.roomSubtitle}>სტატუსი: {room.status}</Text>
            </View>
         </View>
      </ImageBackground>
   );
};
