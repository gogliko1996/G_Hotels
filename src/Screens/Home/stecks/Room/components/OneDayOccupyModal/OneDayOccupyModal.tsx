import React, { useEffect, useState } from "react";
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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { styles } from "../OccupyRoomModal/occupyRoomModal.styles";
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

export const OneDayOccupyModal = ({ visible, room, onClose }: Props) => {
   const { startStayInRoom } = useRoomsStore();
   const [guestName, setGuestName] = useState("");
   const [guestPhone, setGuestPhone] = useState("");
   const [price, setPrice] = useState("");
   const [isPaid, setIsPaid] = useState(false);

   useEffect(() => {
      if (!visible) return;

      setGuestName("");
      setGuestPhone("");
      setPrice("");
      setIsPaid(false);
   }, [visible]);

   const handleSave = async () => {
      const oneDayPrice = Number(price);

      if (room.currentStay) {
         Alert.alert("ვერ შეიყვან", "ოთახში უკვე არის მობინადრე");
         onClose();
         return;
      }

      if (oneDayPrice <= 0) {
         Alert.alert("შეცდომა", "შეიყვანე თანხა");
         return;
      }

      const now = new Date();
      const checkOutDate = addDays(now, 1);

      await startStayInRoom(room.firebaseId, {
         guestName,
         guestPhone,
         isPaid,
         checkInDate: now.toISOString(),
         checkOutDate: checkOutDate.toISOString(),
         days: 1,
         oneDayPrice,
      });

      onClose();
   };

   return (
      <Modal visible={visible} transparent animationType="fade">
         <BlurView intensity={35} tint="dark" style={styles.container}>
            <Pressable onPress={Keyboard.dismiss} style={styles.modal}>
               <Text style={styles.title}>ერთი დღით შეშვება</Text>

               <View style={styles.inputBox}>
                  <Ionicons name="person-outline" size={20} color="#64748b" />
                  <TextInput
                     style={styles.input}
                     placeholder="სტუმრის სახელი"
                     placeholderTextColor="grey"
                     value={guestName}
                     onChangeText={setGuestName}
                  />
               </View>

               <View style={styles.inputBox}>
                  <Ionicons name="call-outline" size={20} color="#64748b" />
                  <TextInput
                     style={styles.input}
                     placeholder="ტელეფონის ნომერი"
                     placeholderTextColor="grey"
                     keyboardType="phone-pad"
                     value={guestPhone}
                     onChangeText={setGuestPhone}
                  />
               </View>

               <View style={styles.inputBox}>
                  <MaterialCommunityIcons
                     name="cash"
                     size={20}
                     color="#64748b"
                  />
                  <TextInput
                     style={styles.input}
                     placeholder="თანხა"
                     placeholderTextColor="grey"
                     keyboardType="numeric"
                     value={price}
                     onChangeText={setPrice}
                     textAlign="center"
                  />
               </View>

               <View style={styles.priceBox}>
                  <Text style={styles.priceLabel}>სულ თანხა</Text>
                  <Text style={styles.priceValue}>{Number(price || 0)} ₾</Text>
               </View>

               <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.checkboxRow}
                  onPress={() => setIsPaid((value) => !value)}
               >
                  <Ionicons
                     name={isPaid ? "checkbox-outline" : "square-outline"}
                     size={24}
                     color={isPaid ? "#16a34a" : "#64748b"}
                  />
                  <Text style={styles.checkboxText}>თანხა გადახდილია</Text>
               </TouchableOpacity>

               <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Ionicons name="save-outline" size={20} color="#fff" />
                  <Text style={styles.buttonText}>შეშვება</Text>
               </TouchableOpacity>

               <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.buttonText}>დახურვა</Text>
               </TouchableOpacity>
            </Pressable>
         </BlurView>
      </Modal>
   );
};
