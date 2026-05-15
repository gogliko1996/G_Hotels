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

import { styles } from "./occupyRoomModal.styles";
import { FirebaseRoom } from "../../../../../../store/store_service_type";
import { useRoomsStore } from "../../../../../../store/rooms_store";
import { hasRoomConflict } from "../../../../../../utils/roomDateValidation";

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
   const { startStayInRoom, updateStayInRoom } = useRoomsStore();

   const [guestName, setGuestName] = useState("");
   const [days, setDays] = useState("");
   const [price, setPrice] = useState("");

   const isUpdate = Boolean(room.currentStay);

   useEffect(() => {
      if (!visible) return;

      if (room.currentStay) {
         setGuestName(room.currentStay.guestName || "");
         setDays("");
         setPrice(String(room.currentStay.oneDayPrice || ""));
      } else {
         setGuestName("");
         setDays("");
         setPrice("");
      }
   }, [visible, room.currentStay]);

   const totalPrice = Number(days || 0) * Number(price || 0);

   const handleSave = async () => {
      const addedDays = Number(days);
      const oneDayPrice = Number(price);

      if (addedDays <= 0 || oneDayPrice <= 0) {
         Alert.alert("შეცდომა", "შეიყვანე დღეები და ერთი დღის ფასი");
         return;
      }

      if (isUpdate && room.currentStay) {
         const oldStay = room.currentStay;
         const newCheckOutDate = addDays(
            new Date(oldStay.checkOutDate),
            addedDays,
         );

         const conflict = hasRoomConflict({
            room: {
               ...room,
               currentStay: null,
            },
            startDate: oldStay.checkInDate,
            endDate: newCheckOutDate.toISOString(),
         });

         if (conflict) {
            Alert.alert("ვერ განახლდება", conflict);
            return;
         }

         await updateStayInRoom(room.firebaseId, {
            ...oldStay,
            guestName,
            checkOutDate: newCheckOutDate.toISOString(),
            days: oldStay.days + addedDays,
            oneDayPrice,
            totalPrice: oldStay.totalPrice + totalPrice,
         });

         onClose();
         return;
      }

      const now = new Date();
      const checkOutDate = addDays(now, addedDays);

      const conflict = hasRoomConflict({
         room,
         startDate: now.toISOString(),
         endDate: checkOutDate.toISOString(),
      });

      if (conflict) {
         Alert.alert("ვერ შეიყვან", conflict);
         return;
      }

      await startStayInRoom(room.firebaseId, {
         guestName,
         checkInDate: now.toISOString(),
         checkOutDate: checkOutDate.toISOString(),
         days: addedDays,
         oneDayPrice,
      });

      onClose();
   };

   return (
      <Modal visible={visible} transparent animationType="fade">
         <BlurView intensity={35} tint="dark" style={styles.container}>
            <Pressable onPress={Keyboard.dismiss} style={styles.modal}>
               <Text style={styles.title}>
                  {isUpdate ? "მობინადრის განახლება" : "მომხმარებლის შეშვება"}
               </Text>

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
                  <Ionicons name="calendar-outline" size={20} color="#64748b" />
                  <TextInput
                     style={styles.input}
                     placeholder={
                        isUpdate
                           ? "რამდენი დღე დაემატოს"
                           : "რამდენი დღე ჩერდება"
                     }
                     placeholderTextColor="grey"
                     keyboardType="numeric"
                     value={days}
                     onChangeText={setDays}
                     textAlign="center"
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
                     placeholder="ერთი დღის ფასი"
                     placeholderTextColor="grey"
                     keyboardType="numeric"
                     value={price}
                     onChangeText={setPrice}
                     textAlign="center"
                  />
               </View>

               <View style={styles.priceBox}>
                  <Text style={styles.priceLabel}>
                     {isUpdate ? "დასამატებელი თანხა" : "სულ თანხა"}
                  </Text>
                  <Text style={styles.priceValue}>{totalPrice} ₾</Text>
               </View>

               <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Ionicons name="save-outline" size={20} color="#fff" />
                  <Text style={styles.buttonText}>
                     {isUpdate ? "განახლება" : "შენახვა"}
                  </Text>
               </TouchableOpacity>

               <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.buttonText}>დახურვა</Text>
               </TouchableOpacity>
            </Pressable>
         </BlurView>
      </Modal>
   );
};
