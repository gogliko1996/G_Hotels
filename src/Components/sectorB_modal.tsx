import { BlurView } from "expo-blur";
import React, { useEffect, useState } from "react";
import {
   Alert,
   Keyboard,
   KeyboardAvoidingView,
   Modal,
   Platform,
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   TouchableWithoutFeedback,
   View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

import { Room } from "../contstns/roomType";
import { useSvavesectorB } from "../store/sectorB_store";
import { formatDate, getRemainingDays } from "../fun/calculatoionTime";

interface SectorBModalProps {
   isOpen: boolean;
   onClose?: () => void;
   item?: Room;
}

type ActionMode =
   | null
   | "reserve"
   | "updateReservation"
   | "occupy"
   | "updateOccupied";

const addDays = (date: Date, days: number) => {
   const newDate = new Date(date);
   newDate.setDate(newDate.getDate() + days);
   return newDate;
};

const getStartOfDay = (date: Date) => {
   const newDate = new Date(date);
   newDate.setHours(0, 0, 0, 0);
   return newDate;
};

export const SectorBModal: React.FC<SectorBModalProps> = ({
   isOpen,
   onClose,
   item,
}) => {
   const [actionMode, setActionMode] = useState<ActionMode>(null);
   const [days, setDays] = useState("");
   const [price, setPrice] = useState("");
   const [reserveStartDate, setReserveStartDate] = useState<Date>(new Date());
   const [showDatePicker, setShowDatePicker] = useState(false);

   const { bookRoomB } = useSvavesectorB();

   const resetForm = () => {
      setActionMode(null);
      setPrice("");
      setDays("");
      setReserveStartDate(new Date());
      setShowDatePicker(false);
   };

   const closeModal = () => {
      Keyboard.dismiss();
      onClose && onClose();
      resetForm();
   };

   const openReserveForm = () => {
      setActionMode("reserve");
      setPrice("");
      setDays("");
      setReserveStartDate(new Date());
      setShowDatePicker(false);
   };

   const openUpdateReservationForm = () => {
      if (!item) return;

      setActionMode("updateReservation");
      setPrice(item.reservedOnePrice || "");
      setDays("");

      if (item.reservedStartTime) {
         setReserveStartDate(new Date(item.reservedStartTime));
      } else {
         setReserveStartDate(new Date());
      }

      setShowDatePicker(false);
   };

   const openOccupyForm = () => {
      setActionMode("occupy");
      setPrice(item?.onePrice || "");
      setDays("");
      setShowDatePicker(false);
   };

   const openUpdateOccupiedForm = () => {
      if (!item) return;

      setActionMode("updateOccupied");
      setPrice(item.onePrice || "");
      setDays("");
      setShowDatePicker(false);
   };

   const saveOccupied = () => {
      if (!item) return;

      const stayingDays = Number(days || 0);
      const oneDayPrice = Number(price || 0);

      if (stayingDays <= 0 || oneDayPrice <= 0) {
         Alert.alert("შეცდომა", "შეიყვანე დღეები და ერთი დღის ფასი");
         return;
      }

      const now = new Date();
      const endDate = addDays(now, stayingDays);

      if (item.isReserved && item.reservedStartTime) {
         const reservedStart = getStartOfDay(new Date(item.reservedStartTime));
         const busyEnd = getStartOfDay(endDate);

         if (busyEnd > reservedStart) {
            Alert.alert(
               "ვერ შეიყვან",
               "ამ თარიღის შემდეგ ოთახში ჯავშანი შედის",
            );
            return;
         }
      }

      const allPrice = oneDayPrice * stayingDays;

      bookRoomB({
         ...item,
         startTime: now.toISOString(),
         stayingTime: endDate.toISOString(),
         onePrice: oneDayPrice.toString(),
         allPrice: allPrice.toString(),
         remainingAmount: allPrice.toString(),
         isFree: true,
      });

      closeModal();
   };

   const updateOccupied = () => {
      if (!item) return;

      const addedDays = Number(days || 0);
      const oneDayPrice = Number(price || 0);

      if (addedDays <= 0 || oneDayPrice <= 0) {
         Alert.alert(
            "შეცდომა",
            "შეიყვანე დასამატებელი დღეები და ერთი დღის ფასი",
         );
         return;
      }

      const currentEndDate = item.stayingTime
         ? new Date(item.stayingTime)
         : new Date();

      const newEndDate = addDays(currentEndDate, addedDays);

      if (item.isReserved && item.reservedStartTime) {
         const reservedStart = getStartOfDay(new Date(item.reservedStartTime));
         const newBusyEnd = getStartOfDay(newEndDate);

         if (newBusyEnd > reservedStart) {
            Alert.alert(
               "ვერ განაახლებ",
               "ამ თარიღის შემდეგ ოთახში ჯავშანი შედის",
            );
            return;
         }
      }

      const addedPrice = oneDayPrice * addedDays;

      bookRoomB({
         ...item,
         stayingTime: newEndDate.toISOString(),
         onePrice: oneDayPrice.toString(),
         allPrice: (Number(item.allPrice || 0) + addedPrice).toString(),
         remainingAmount: (
            Number(item.remainingAmount || 0) + addedPrice
         ).toString(),
         isFree: true,
      });

      closeModal();
   };

   const saveReservation = () => {
      if (!item) return;

      const stayingDays = Number(days || 0);
      const oneDayPrice = Number(price || 0);
      const startDate = getStartOfDay(reserveStartDate);

      if (stayingDays <= 0 || oneDayPrice <= 0) {
         Alert.alert("შეცდომა", "შეიყვანე დღეები და ერთი დღის ფასი");
         return;
      }

      const today = getStartOfDay(new Date());
      const endDate = addDays(startDate, stayingDays);

      if (startDate < today) {
         Alert.alert("შეცდომა", "წარსული თარიღით დაჯავშნა შეუძლებელია");
         return;
      }

      if (item.isFree && item.stayingTime) {
         const busyEnd = getStartOfDay(new Date(item.stayingTime));

         if (startDate < busyEnd) {
            Alert.alert(
               "ვერ დაჯავშნი",
               "ოთახი ამ პერიოდში დაკავებულია. დაჯავშნა შეგიძლია დაკავების დასრულების დღიდან ზემოთ.",
            );
            return;
         }
      }

      const allPrice = oneDayPrice * stayingDays;

      bookRoomB({
         ...item,
         isReserved: true,
         reservedStartTime: startDate.toISOString(),
         reservedEndTime: endDate.toISOString(),
         reservedOnePrice: oneDayPrice.toString(),
         reservedAllPrice: allPrice.toString(),
      });

      closeModal();
   };

   const removeOccupied = () => {
      if (!item) return;

      bookRoomB({
         ...item,
         startTime: "",
         stayingTime: "",
         allPrice: "",
         onePrice: "",
         remainingAmount: "",
         isFree: false,
      });

      closeModal();
   };

   const removeReservation = () => {
      if (!item) return;

      bookRoomB({
         ...item,
         isReserved: false,
         reservedStartTime: "",
         reservedEndTime: "",
         reservedOnePrice: "",
         reservedAllPrice: "",
      });

      closeModal();
   };

   useEffect(() => {
      if (isOpen) {
         resetForm();
      }
   }, [isOpen, item]);

   const totalPrice = Number(price || 0) * Number(days || 0);

   const isReservationForm =
      actionMode === "reserve" || actionMode === "updateReservation";

   const isOccupyForm =
      actionMode === "occupy" || actionMode === "updateOccupied";

   const statusColor = item?.isFree
      ? "#dc2626"
      : item?.isReserved
        ? "#2563eb"
        : "#16a34a";

   const statusText =
      item?.isFree && item?.isReserved
         ? "დაკავებული + დაჯავშნილი"
         : item?.isFree
           ? "დაკავებული"
           : item?.isReserved
             ? "დაჯავშნილი"
             : "თავისუფალი";

   return (
      <Modal visible={isOpen} transparent animationType="fade">
         <BlurView intensity={35} tint="dark" style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
               <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
                  style={styles.keyboardView}
               >
                  <View style={styles.modal}>
                     <View style={styles.header}>
                        <View
                           style={[
                              styles.headerIcon,
                              {
                                 backgroundColor: item?.isFree
                                    ? "#fee2e2"
                                    : item?.isReserved
                                      ? "#dbeafe"
                                      : "#dcfce7",
                              },
                           ]}
                        >
                           <Ionicons
                              name={item?.isFree ? "bed" : "bed-outline"}
                              size={26}
                              color={statusColor}
                           />
                        </View>

                        <View>
                           <Text style={styles.roomTitle}>
                              B ოთახი #{item?.room}
                           </Text>

                           <Text
                              style={[
                                 styles.statusText,
                                 { color: statusColor },
                              ]}
                           >
                              {statusText}
                           </Text>
                        </View>
                     </View>

                     {item?.isFree && (
                        <View style={styles.infoContainer}>
                           <Text style={styles.infoText}>
                              დაკავება: {formatDate(item.startTime)}
                           </Text>
                           <Text style={styles.infoText}>
                              დასრულება: {formatDate(item.stayingTime)}
                           </Text>
                           <Text style={styles.infoText}>
                              თანხა: {item.allPrice || 0} ₾
                           </Text>
                           <Text style={styles.infoText}>
                              დარჩენილი თანხა: {item.remainingAmount || 0} ₾
                           </Text>
                           <Text style={styles.infoText}>
                              დარჩა: {getRemainingDays(item.stayingTime)} დღე
                           </Text>
                        </View>
                     )}

                     {item?.isReserved && (
                        <View
                           style={[styles.infoContainer, styles.reservedInfo]}
                        >
                           <Text style={styles.infoText}>
                              ჯავშანი იწყება:{" "}
                              {formatDate(item.reservedStartTime)}
                           </Text>
                           <Text style={styles.infoText}>
                              ჯავშანი მთავრდება:{" "}
                              {formatDate(item.reservedEndTime)}
                           </Text>
                           <Text style={styles.infoText}>
                              ჯავშნის თანხა: {item.reservedAllPrice || 0} ₾
                           </Text>
                        </View>
                     )}

                     {isReservationForm && (
                        <View style={styles.inputWrapper}>
                           <Text style={styles.label}>
                              მოსვლის თარიღი ჯავშნისთვის
                           </Text>

                           <TouchableOpacity
                              activeOpacity={0.8}
                              style={styles.inputContainer}
                              onPress={() => setShowDatePicker(true)}
                           >
                              <Feather
                                 name="calendar"
                                 size={20}
                                 color="#64748b"
                              />

                              <Text style={styles.dateText}>
                                 {reserveStartDate.toISOString().split("T")[0]}
                              </Text>

                              <Ionicons
                                 name="chevron-down"
                                 size={20}
                                 color="#64748b"
                              />
                           </TouchableOpacity>

                           {showDatePicker && (
                              <DateTimePicker
                                 value={reserveStartDate}
                                 mode="date"
                                 textColor="black"
                                 display={
                                    Platform.OS === "ios"
                                       ? "spinner"
                                       : "default"
                                 }
                                 minimumDate={new Date()}
                                 onChange={(event, selectedDate) => {
                                    if (Platform.OS === "android") {
                                       setShowDatePicker(false);
                                    }

                                    if (selectedDate) {
                                       setReserveStartDate(selectedDate);
                                    }
                                 }}
                              />
                           )}

                           {Platform.OS === "ios" && showDatePicker && (
                              <TouchableOpacity
                                 activeOpacity={0.8}
                                 style={styles.doneButton}
                                 onPress={() => setShowDatePicker(false)}
                              >
                                 <Text style={styles.doneButtonText}>
                                    არჩევა
                                 </Text>
                              </TouchableOpacity>
                           )}
                        </View>
                     )}

                     {(isReservationForm || isOccupyForm) && (
                        <>
                           <View style={styles.inputWrapper}>
                              <Text style={styles.label}>ერთი დღის ფასი</Text>

                              <View style={styles.inputContainer}>
                                 <MaterialCommunityIcons
                                    name="currency-usd"
                                    size={20}
                                    color="#64748b"
                                 />

                                 <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    value={price}
                                    onChangeText={setPrice}
                                    placeholder="0"
                                    placeholderTextColor="#94a3b8"
                                 />

                                 <Text style={styles.currency}>₾</Text>
                              </View>
                           </View>

                           <View style={styles.inputWrapper}>
                              <Text style={styles.label}>
                                 {actionMode === "updateOccupied"
                                    ? "რამდენი დღე დაემატოს"
                                    : actionMode === "occupy"
                                      ? "რამდენი დღე დარჩება მომხმარებელი"
                                      : "რამდენი დღე იქნება ჯავშანი"}
                              </Text>

                              <View style={styles.inputContainer}>
                                 <Ionicons
                                    name="calendar-outline"
                                    size={20}
                                    color="#64748b"
                                 />

                                 <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    value={days}
                                    onChangeText={setDays}
                                    placeholder="0"
                                    placeholderTextColor="#94a3b8"
                                 />

                                 <Text style={styles.currency}>დღე</Text>
                              </View>
                           </View>

                           <View style={styles.priceCard}>
                              <Text style={styles.priceLabel}>
                                 {actionMode === "updateOccupied"
                                    ? "დასამატებელი თანხა"
                                    : "სულ თანხა"}
                              </Text>
                              <Text style={styles.priceValue}>
                                 {totalPrice} ₾
                              </Text>
                           </View>
                        </>
                     )}

                     {isReservationForm && (
                        <TouchableOpacity
                           activeOpacity={0.8}
                           style={styles.reserveButton}
                           onPress={saveReservation}
                        >
                           <Ionicons
                              name="save-outline"
                              size={20}
                              color="#fff"
                           />
                           <Text style={styles.buttonText}>
                              ჯავშნის შენახვა
                           </Text>
                        </TouchableOpacity>
                     )}

                     {isOccupyForm && (
                        <TouchableOpacity
                           activeOpacity={0.8}
                           style={styles.saveButton}
                           onPress={
                              actionMode === "updateOccupied"
                                 ? updateOccupied
                                 : saveOccupied
                           }
                        >
                           <Ionicons
                              name="checkmark-circle"
                              size={20}
                              color="#fff"
                           />
                           <Text style={styles.buttonText}>
                              {actionMode === "updateOccupied"
                                 ? "განახლება"
                                 : "შენახვა"}
                           </Text>
                        </TouchableOpacity>
                     )}

                     {!actionMode && item?.isFree && (
                        <TouchableOpacity
                           activeOpacity={0.8}
                           style={styles.saveButton}
                           onPress={openUpdateOccupiedForm}
                        >
                           <Ionicons
                              name="add-circle-outline"
                              size={20}
                              color="#fff"
                           />
                           <Text style={styles.buttonText}>
                              დაკავების განახლება
                           </Text>
                        </TouchableOpacity>
                     )}

                     {!actionMode && item?.isReserved && (
                        <>
                           <TouchableOpacity
                              activeOpacity={0.8}
                              style={styles.reserveButton}
                              onPress={openUpdateReservationForm}
                           >
                              <Ionicons
                                 name="create-outline"
                                 size={20}
                                 color="#fff"
                              />
                              <Text style={styles.buttonText}>
                                 ჯავშნის განახლება
                              </Text>
                           </TouchableOpacity>

                           <TouchableOpacity
                              activeOpacity={0.8}
                              style={styles.removeReservationButton}
                              onPress={removeReservation}
                           >
                              <Ionicons
                                 name="trash-outline"
                                 size={20}
                                 color="#fff"
                              />
                              <Text style={styles.buttonText}>
                                 ჯავშნის გაუქმება
                              </Text>
                           </TouchableOpacity>
                        </>
                     )}

                     {!actionMode && !item?.isReserved && (
                        <TouchableOpacity
                           activeOpacity={0.8}
                           style={styles.reserveButton}
                           onPress={openReserveForm}
                        >
                           <Ionicons name="calendar" size={20} color="#fff" />
                           <Text style={styles.buttonText}>
                              წინასწარ დაჯავშნა
                           </Text>
                        </TouchableOpacity>
                     )}

                     {!actionMode && !item?.isFree && (
                        <TouchableOpacity
                           activeOpacity={0.8}
                           style={styles.saveButton}
                           onPress={openOccupyForm}
                        >
                           <Ionicons
                              name="person-add-outline"
                              size={20}
                              color="#fff"
                           />
                           <Text style={styles.buttonText}>
                              {item?.isReserved
                                 ? "მომხმარებლის შეშვება "
                                 : "ახლავე დაკავება"}
                           </Text>
                        </TouchableOpacity>
                     )}

                     <View style={styles.buttonsRow}>
                        <TouchableOpacity
                           activeOpacity={0.8}
                           style={styles.cancelButton}
                           onPress={actionMode ? resetForm : closeModal}
                        >
                           <Text style={styles.buttonText}>
                              {actionMode ? "უკან" : "დახურვა"}
                           </Text>
                        </TouchableOpacity>

                        {!actionMode && item?.isFree && (
                           <TouchableOpacity
                              activeOpacity={0.8}
                              style={styles.removeButton}
                              onPress={removeOccupied}
                           >
                              <Text style={styles.buttonText}>გაუქმება</Text>
                           </TouchableOpacity>
                        )}
                     </View>
                  </View>
               </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
         </BlurView>
      </Modal>
   );
};

const styles = StyleSheet.create({
   container: { flex: 1, paddingHorizontal: 18 },
   keyboardView: { flex: 1, justifyContent: "center" },
   modal: { backgroundColor: "#fff", borderRadius: 28, padding: 20 },
   header: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
   headerIcon: {
      width: 58,
      height: 58,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 14,
   },
   roomTitle: { fontSize: 24, fontWeight: "800", color: "#0f172a" },
   statusText: { fontSize: 15, fontWeight: "700", marginTop: 2 },
   infoContainer: {
      backgroundColor: "#f8fafc",
      borderRadius: 20,
      padding: 14,
      marginBottom: 12,
      gap: 6,
   },
   reservedInfo: {
      backgroundColor: "#eff6ff",
      borderWidth: 1,
      borderColor: "#bfdbfe",
   },
   infoText: {
      fontSize: 14,
      color: "#334155",
      fontWeight: "600",
   },
   inputWrapper: { marginBottom: 12 },
   label: {
      fontSize: 14,
      fontWeight: "700",
      color: "#334155",
      marginBottom: 8,
   },
   inputContainer: {
      height: 54,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: "#e2e8f0",
      backgroundColor: "#f8fafc",
      paddingHorizontal: 14,
      flexDirection: "row",
      alignItems: "center",
   },
   input: {
      flex: 1,
      fontSize: 16,
      color: "#0f172a",
      textAlign: "center",
      fontWeight: "700",
   },
   dateText: {
      flex: 1,
      textAlign: "center",
      fontSize: 16,
      fontWeight: "700",
      color: "#0f172a",
   },
   doneButton: {
      height: 44,
      borderRadius: 14,
      backgroundColor: "#2563eb",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 8,
   },
   doneButtonText: {
      color: "#fff",
      fontSize: 15,
      fontWeight: "800",
   },
   currency: {
      fontSize: 15,
      fontWeight: "700",
      color: "#475569",
   },
   priceCard: {
      backgroundColor: "#eff6ff",
      borderRadius: 22,
      paddingVertical: 14,
      alignItems: "center",
      marginTop: 4,
      marginBottom: 12,
   },
   priceLabel: { fontSize: 14, color: "#64748b", marginBottom: 4 },
   priceValue: { fontSize: 28, fontWeight: "900", color: "#2563eb" },
   reserveButton: {
      height: 54,
      borderRadius: 18,
      backgroundColor: "#2563eb",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      gap: 8,
      marginBottom: 10,
   },
   removeReservationButton: {
      height: 54,
      borderRadius: 18,
      backgroundColor: "#ef4444",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      gap: 8,
      marginBottom: 10,
   },
   saveButton: {
      height: 54,
      borderRadius: 18,
      backgroundColor: "#16a34a",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      gap: 8,
      marginBottom: 10,
   },
   buttonsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 10,
   },
   cancelButton: {
      flex: 1,
      height: 54,
      borderRadius: 18,
      backgroundColor: "#94a3b8",
      justifyContent: "center",
      alignItems: "center",
   },
   removeButton: {
      flex: 1,
      height: 54,
      borderRadius: 18,
      backgroundColor: "#ef4444",
      justifyContent: "center",
      alignItems: "center",
   },
   buttonText: {
      color: "#fff",
      fontSize: 15,
      fontWeight: "800",
   },
});
