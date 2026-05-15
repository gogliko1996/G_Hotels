import React, { useState } from "react";
import {
   Alert,
   Keyboard,
   Modal,
   Pressable,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from "react-native";
import { BlurView } from "expo-blur";
import { styles } from "./occupyRoomModal.styles";
import { FirebaseRoom } from "../../../../../../store/store_service_type";
import { useRoomsStore } from "../../../../../../store/rooms_store";

type Props = {
   visible: boolean;
   room: FirebaseRoom;
   onClose: () => void;
};

const addDays = (date: Date, days: number) => {
   const next = new Date(date);
   next.setDate(next.getDate() + days);
   return next;
};

export const OccupyRoomModal = ({ visible, room, onClose }: Props) => {
   const { startStayInRoom } = useRoomsStore();

   const [guestName, setGuestName] = useState("");
   const [days, setDays] = useState("");
   const [price, setPrice] = useState("");

   const totalPrice = Number(days || 0) * Number(price || 0);

   const handleSave = async () => {
      const stayDays = Number(days);
      const oneDayPrice = Number(price);

      if (stayDays <= 0 || oneDayPrice <= 0) {
         Alert.alert("შეცდომა", "შეიყვანე დღეები და ერთი დღის ფასი");
         return;
      }

      const now = new Date();
      const checkOutDate = addDays(now, stayDays);

      await startStayInRoom(room.firebaseId, {
         guestName,
         checkInDate: now.toISOString(),
         checkOutDate: checkOutDate.toISOString(),
         days: stayDays,
         oneDayPrice,
      });

      setGuestName("");
      setDays("");
      setPrice("");
      onClose();
   };

   return (
      <Modal visible={visible} transparent animationType="fade">
         <BlurView intensity={35} tint="dark" style={styles.container}>
            <Pressable onPress={Keyboard.dismiss} style={styles.modal}>
               <Text style={styles.title}>მომხმარებლის შეშვება</Text>

               <TextInput
                  style={styles.input}
                  placeholder="სტუმრის სახელი"
                  placeholderTextColor={"grey"}
                  value={guestName}
                  onChangeText={setGuestName}
               />

               <TextInput
                  style={styles.input}
                  placeholder="რამდენი დღე ჩერდება"
                  placeholderTextColor={"grey"}
                  keyboardType="numeric"
                  value={days}
                  onChangeText={setDays}
               />

               <TextInput
                  style={styles.input}
                  placeholder="ერთი დღის ფასი"
                  placeholderTextColor={"grey"}
                  keyboardType="numeric"
                  value={price}
                  onChangeText={setPrice}
               />

               <View style={styles.priceBox}>
                  <Text style={styles.priceLabel}>სულ თანხა</Text>
                  <Text style={styles.priceValue}>{totalPrice} ₾</Text>
               </View>

               <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.buttonText}>შენახვა</Text>
               </TouchableOpacity>

               <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.buttonText}>დახურვა</Text>
               </TouchableOpacity>
            </Pressable>
         </BlurView>
      </Modal>
   );
};
