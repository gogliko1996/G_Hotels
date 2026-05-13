import { BlurView } from "expo-blur";
import React, { useEffect, useState } from "react";

import {
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

import { Room } from "../contstns/sectorB";

import { useSvavesectorB } from "../store/sectorB_store";

import { formatDate, getRemainingDays } from "../fun/calculatoionTime";

interface SectorAModalProps {
   isOpen: boolean;
   onClose?: () => void;
   item?: Room;
}

export const SectorBModal: React.FC<SectorAModalProps> = ({
   isOpen,
   onClose,
   item,
}) => {
   const [value, setValue] = useState<string>("");
   const [price, setPrice] = useState<string>("");

   const { bookRoomB } = useSvavesectorB();

   const closeModal = () => {
      Keyboard.dismiss();
      onClose && onClose();
      setPrice("");
      setValue("");
   };

   const save = () => {
      const now = new Date();

      const tenDaysLater = new Date(
         now.getTime() + Number(value) * 24 * 60 * 60 * 1000,
      );

      const allPrice = Number(price ?? 0) * Number(value ?? 0);

      const newItem = {
         ...item,
         startTime: new Date(),
         stayingTime: tenDaysLater,
         isFree: true,
         onePrice: price?.toString(),
         remainingAmount: allPrice,
         allPrice,
      };

      bookRoomB(newItem as any);
      closeModal();
   };

   const removeBook = () => {
      const newItem = {
         ...item,
         startTime: "",
         stayingTime: "",
         allPrice: "",
         onePrice: "",
         remainingAmount: "",
         isFree: false,
      };

      bookRoomB(newItem as any);

      closeModal();
   };

   const updateBook = () => {
      if (item) {
         const now = new Date();

         const fulldata = getRemainingDays(item.stayingTime) + Number(value);

         const tenDaysLater = new Date(
            now.getTime() + Number(fulldata) * 24 * 60 * 60 * 1000,
         );

         const allPrice = Number(price ?? 0) * Number(value ?? 0);

         const plasAllPrice = allPrice + Number(item.allPrice);

         const neWRemainingAmount =
            Number(item.remainingAmount) + Number(allPrice);

         const newItem = {
            ...item,
            onePrice: price?.toString(),
            allPrice: plasAllPrice,
            stayingTime: tenDaysLater,
            remainingAmount: neWRemainingAmount,
         };

         bookRoomB(newItem);

         closeModal();
      }
   };

   useEffect(() => {
      if (isOpen) {
         setPrice(item?.onePrice || "");
         setValue("");
      }
   }, [isOpen]);

   const totalPrice = Number(price ?? 0) * Number(value ?? 0);

   return (
      <Modal visible={isOpen} transparent animationType="fade">
         <BlurView intensity={35} tint="dark" style={styles.container}>
            <TouchableWithoutFeedback
               onPress={Keyboard.dismiss}
               accessible={false}
            >
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
                                    : "#dcfce7",
                              },
                           ]}
                        >
                           <Ionicons
                              name={item?.isFree ? "bed" : "bed-outline"}
                              size={26}
                              color={item?.isFree ? "#dc2626" : "#16a34a"}
                           />
                        </View>

                        <View>
                           <Text style={styles.roomTitle}>
                              ოთახი #{item?.room}
                           </Text>

                           <Text
                              style={[
                                 styles.statusText,
                                 {
                                    color: item?.isFree ? "#dc2626" : "#16a34a",
                                 },
                              ]}
                           >
                              {item?.isFree ? "დაკავებული" : "თავისუფალი"}
                           </Text>
                        </View>
                     </View>

                     {item?.isFree && (
                        <View style={styles.infoContainer}>
                           <View style={styles.infoRow}>
                              <Feather
                                 name="calendar"
                                 size={16}
                                 color="#64748b"
                              />

                              <Text style={styles.infoText}>
                                 დაწყება: {formatDate(item.startTime)}
                              </Text>
                           </View>

                           <View style={styles.infoRow}>
                              <Ionicons
                                 name="time-outline"
                                 size={16}
                                 color="#64748b"
                              />

                              <Text style={styles.infoText}>
                                 დასრულება: {formatDate(item.stayingTime)}
                              </Text>
                           </View>

                           <View style={styles.infoRow}>
                              <MaterialCommunityIcons
                                 name="cash"
                                 size={16}
                                 color="#64748b"
                              />

                              <Text style={styles.infoText}>
                                 გადახდილი: {item.allPrice ?? 0} ₾
                              </Text>
                           </View>

                           <View style={styles.infoRow}>
                              <Ionicons
                                 name="wallet-outline"
                                 size={16}
                                 color="#64748b"
                              />

                              <Text style={styles.infoText}>
                                 დარჩენილი: {item?.remainingAmount ?? 0} ₾
                              </Text>
                           </View>

                           <View style={styles.infoRow}>
                              <Ionicons
                                 name="hourglass-outline"
                                 size={16}
                                 color="#64748b"
                              />

                              <Text style={styles.infoText}>
                                 დარჩა: {getRemainingDays(item.stayingTime)} დღე
                              </Text>
                           </View>
                        </View>
                     )}

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
                              onChangeText={(e) => setPrice(e)}
                              placeholder="0"
                              placeholderTextColor="#94a3b8"
                           />

                           <Text style={styles.currency}>₾</Text>
                        </View>
                     </View>

                     <View style={styles.inputWrapper}>
                        <Text style={styles.label}>
                           {item?.isFree ? "დღეების დამატება" : "დარჩენის დრო"}
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
                              value={value}
                              onChangeText={(e) => setValue(e)}
                              placeholder="0"
                              placeholderTextColor="#94a3b8"
                           />

                           <Text style={styles.currency}>დღე</Text>
                        </View>
                     </View>

                     <View style={styles.priceCard}>
                        <Text style={styles.priceLabel}>
                           {item?.isFree
                              ? "დასამატებელი თანხა"
                              : "გადასახდელი თანხა"}
                        </Text>

                        <Text style={styles.priceValue}>{totalPrice} ₾</Text>
                     </View>

                     {item?.isFree ? (
                        <TouchableOpacity
                           activeOpacity={0.8}
                           style={styles.saveButton}
                           onPress={() => {
                              item?.isFree ? updateBook() : save();
                           }}
                        >
                           <Ionicons
                              name="checkmark-circle"
                              size={20}
                              color="#fff"
                           />

                           <Text style={styles.buttonText}>შენახვა</Text>
                        </TouchableOpacity>
                     ) : null}

                     <View style={styles.buttonsRow}>
                        <TouchableOpacity
                           activeOpacity={0.8}
                           style={styles.cancelButton}
                           onPress={closeModal}
                        >
                           <Text style={styles.buttonText}>დახურვა</Text>
                        </TouchableOpacity>

                        {item?.isFree ? (
                           <TouchableOpacity
                              activeOpacity={0.8}
                              style={styles.removeButton}
                              onPress={removeBook}
                           >
                              <Ionicons
                                 name="trash-outline"
                                 size={20}
                                 color="#fff"
                              />

                              <Text style={styles.buttonText}>გაუქმება</Text>
                           </TouchableOpacity>
                        ) : (
                           <TouchableOpacity
                              activeOpacity={0.8}
                              style={[styles.saveButton, { width: "48%" }]}
                              onPress={() => {
                                 item?.isFree ? updateBook() : save();
                              }}
                           >
                              <Ionicons
                                 name="checkmark-circle"
                                 size={20}
                                 color="#fff"
                              />

                              <Text style={styles.buttonText}>შენახვა</Text>
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
   container: {
      flex: 1,
      paddingHorizontal: 18,
   },

   keyboardView: {
      flex: 1,
      justifyContent: "center",
   },

   modal: {
      backgroundColor: "#fff",
      borderRadius: 28,
      padding: 20,
   },

   header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 22,
   },

   headerIcon: {
      width: 58,
      height: 58,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 14,
   },

   roomTitle: {
      fontSize: 24,
      fontWeight: "800",
      color: "#0f172a",
   },

   statusText: {
      fontSize: 15,
      fontWeight: "700",
      marginTop: 2,
   },

   infoContainer: {
      backgroundColor: "#f8fafc",
      borderRadius: 20,
      padding: 14,
      marginBottom: 18,
   },

   infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
   },

   infoText: {
      marginLeft: 10,
      fontSize: 14,
      color: "#334155",
      fontWeight: "500",
   },

   inputWrapper: {
      marginBottom: 16,
   },

   label: {
      fontSize: 14,
      fontWeight: "700",
      color: "#334155",
      marginBottom: 8,
   },

   inputContainer: {
      height: 58,
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
      fontSize: 18,
      color: "#0f172a",
      textAlign: "center",
      fontWeight: "700",
   },

   currency: {
      fontSize: 15,
      fontWeight: "700",
      color: "#475569",
   },

   priceCard: {
      backgroundColor: "#eff6ff",
      borderRadius: 22,
      paddingVertical: 18,
      alignItems: "center",
      marginTop: 10,
      marginBottom: 18,
   },

   priceLabel: {
      fontSize: 14,
      color: "#64748b",
      marginBottom: 4,
   },

   priceValue: {
      fontSize: 30,
      fontWeight: "900",
      color: "#2563eb",
   },

   removeButton: {
      height: 56,
      width: "48%",
      borderRadius: 18,
      backgroundColor: "#ef4444",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      marginBottom: 14,
      gap: 8,
   },

   buttonsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
   },

   cancelButton: {
      width: "48%",
      height: 56,
      borderRadius: 18,
      backgroundColor: "#94a3b8",
      justifyContent: "center",
      alignItems: "center",
   },

   saveButton: {
      width: "100%",
      height: 56,
      borderRadius: 18,
      backgroundColor: "#2563eb",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      gap: 8,
   },

   buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "800",
   },
});
