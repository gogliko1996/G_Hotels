import React, { useEffect, useState } from "react";
import {
   Alert,
   Keyboard,
   Modal,
   Platform,
   Pressable,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from "react-native";
import { BlurView } from "expo-blur";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { styles } from "./reservationModal.styles";
import { FirebaseRoom } from "../../../../../../store/store_service_type";
import { Reservation } from "../../../../../../services/type";
import { useRoomsStore } from "../../../../../../store/rooms_store";
import { hasRoomConflict } from "../../../../../../utils/roomDateValidation";

type Props = {
   visible: boolean;
   room: FirebaseRoom;
   reservation?: Reservation | null;
   onClose: () => void;
};

const addDays = (date: Date, days: number) => {
   const next = new Date(date);
   next.setDate(next.getDate() + days);
   return next;
};

export const ReservationModal = ({
   visible,
   room,
   reservation,
   onClose,
}: Props) => {
   const { addReservationToRoom, updateReservationInRoom } = useRoomsStore();

   const [guestName, setGuestName] = useState("");
   const [startDate, setStartDate] = useState(new Date());
   const [showPicker, setShowPicker] = useState(false);
   const [days, setDays] = useState("");
   const [price, setPrice] = useState("");

   const isUpdate = Boolean(reservation);

   useEffect(() => {
      if (!visible) return;

      if (reservation) {
         setGuestName(reservation.guestName || "");
         setStartDate(new Date(reservation.startDate));
         setDays(String(reservation.days || ""));
         setPrice(String(reservation.oneDayPrice || ""));
      } else {
         setGuestName("");
         setStartDate(new Date());
         setDays("");
         setPrice("");
      }
   }, [visible, reservation]);

   const totalPrice = Number(days || 0) * Number(price || 0);

   const handleSave = async () => {
      const reserveDays = Number(days);
      const oneDayPrice = Number(price);

      if (reserveDays <= 0 || oneDayPrice <= 0) {
         Alert.alert("შეცდომა", "შეიყვანე დღეები და ერთი დღის ფასი");
         return;
      }

      const endDate = addDays(startDate, reserveDays);

      const conflict = hasRoomConflict({
         room,
         startDate: startDate.toISOString(),
         endDate: endDate.toISOString(),
         ignoreReservationId: reservation?.id,
      });

      if (conflict) {
         Alert.alert("ვერ დაჯავშნი", conflict);
         return;
      }

      if (reservation) {
         await updateReservationInRoom(room.firebaseId, reservation.id, {
            ...reservation,
            guestName,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            days: reserveDays,
            oneDayPrice,
            totalPrice,
            status: "reserved",
         });
      } else {
         await addReservationToRoom(room.firebaseId, {
            guestName,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            days: reserveDays,
            oneDayPrice,
         });
      }

      onClose();
   };

   return (
      <Modal visible={visible} transparent animationType="fade">
         <BlurView intensity={35} tint="dark" style={styles.container}>
            <Pressable onPress={Keyboard.dismiss} style={styles.modal}>
               <Text style={styles.title}>
                  {isUpdate ? "ჯავშნის განახლება" : "ოთახის დაჯავშნა"}
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

               <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowPicker(true)}
               >
                  <Ionicons name="calendar-outline" size={20} color="#2563eb" />
                  <Text style={styles.dateText}>
                     {startDate.toISOString().split("T")[0]}
                  </Text>
               </TouchableOpacity>

               {showPicker && (
                  <DateTimePicker
                     value={startDate}
                     mode="date"
                     textColor="#000"
                     minimumDate={new Date()}
                     display={Platform.OS === "ios" ? "spinner" : "default"}
                     onChange={(_, date) => {
                        if (Platform.OS === "android") setShowPicker(false);
                        if (date) setStartDate(date);
                     }}
                  />
               )}

               {Platform.OS === "ios" && showPicker && (
                  <TouchableOpacity
                     style={styles.doneButton}
                     onPress={() => setShowPicker(false)}
                  >
                     <Text style={styles.buttonText}>არჩევა</Text>
                  </TouchableOpacity>
               )}

               <View style={styles.inputBox}>
                  <Ionicons name="time-outline" size={20} color="#64748b" />
                  <TextInput
                     style={styles.input}
                     placeholder="რამდენი დღე"
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
                  <Text style={styles.priceLabel}>სულ თანხა</Text>
                  <Text style={styles.priceValue}>{totalPrice} ₾</Text>
               </View>

               <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Ionicons name="save-outline" size={20} color="#fff" />
                  <Text style={styles.buttonText}>
                     {isUpdate ? "ჯავშნის განახლება" : "ჯავშნის შენახვა"}
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
