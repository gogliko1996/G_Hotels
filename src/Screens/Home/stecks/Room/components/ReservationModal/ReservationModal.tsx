import React, { useState } from "react";
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
import { styles } from "./reservationModal.styles";
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

export const ReservationModal = ({ visible, room, onClose }: Props) => {
   const { addReservationToRoom } = useRoomsStore();

   const [guestName, setGuestName] = useState("");
   const [startDate, setStartDate] = useState(new Date());
   const [showPicker, setShowPicker] = useState(false);
   const [days, setDays] = useState("");
   const [price, setPrice] = useState("");

   const totalPrice = Number(days || 0) * Number(price || 0);

   const handleSave = async () => {
      const reserveDays = Number(days);
      const oneDayPrice = Number(price);

      if (reserveDays <= 0 || oneDayPrice <= 0) {
         Alert.alert("შეცდომა", "შეიყვანე დღეები და ერთი დღის ფასი");
         return;
      }

      const endDate = addDays(startDate, reserveDays);

      await addReservationToRoom(room.firebaseId, {
         guestName,
         startDate: startDate.toISOString(),
         endDate: endDate.toISOString(),
         days: reserveDays,
         oneDayPrice,
      });

      setGuestName("");
      setDays("");
      setPrice("");
      setStartDate(new Date());
      onClose();
   };

   return (
      <Modal visible={visible} transparent animationType="fade">
         <BlurView intensity={35} tint="dark" style={styles.container}>
            <Pressable onPress={Keyboard.dismiss}>
               <View style={styles.modal}>
                  <Text style={styles.title}>ოთახის დაჯავშნა</Text>

                  <TextInput
                     style={styles.input}
                     placeholder="სტუმრის სახელი"
                     value={guestName}
                     onChangeText={setGuestName}
                  />

                  <TouchableOpacity
                     style={styles.dateButton}
                     onPress={() => setShowPicker(true)}
                  >
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
                           if (Platform.OS === "android") {
                              setShowPicker(false);
                           }

                           if (date) {
                              setStartDate(date);
                           }
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

                  <TextInput
                     style={styles.input}
                     placeholder="რამდენი დღე"
                     keyboardType="numeric"
                     value={days}
                     onChangeText={setDays}
                  />

                  <TextInput
                     style={styles.input}
                     placeholder="ერთი დღის ფასი"
                     keyboardType="numeric"
                     value={price}
                     onChangeText={setPrice}
                  />

                  <View style={styles.priceBox}>
                     <Text style={styles.priceLabel}>სულ თანხა</Text>
                     <Text style={styles.priceValue}>{totalPrice} ₾</Text>
                  </View>

                  <TouchableOpacity
                     style={styles.saveButton}
                     onPress={handleSave}
                  >
                     <Text style={styles.buttonText}>ჯავშნის შენახვა</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                     style={styles.cancelButton}
                     onPress={onClose}
                  >
                     <Text style={styles.buttonText}>დახურვა</Text>
                  </TouchableOpacity>
               </View>
            </Pressable>
         </BlurView>
      </Modal>
   );
};
