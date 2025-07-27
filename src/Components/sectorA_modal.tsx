import { BlurView } from "expo-blur";
import React, { useEffect, useState } from "react";
import {
   Modal,
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from "react-native";
import { Room } from "../contstns/sectorB";
import { useSvavesectorA } from "../store/sectorA_store";
import {
   formatDate,
   getDateDifferenceInDays,
   getRemainingDays,
} from "../fun/calculatoionTime";

interface SectorAModalProps {
   isOpen: boolean;
   onClose?: () => void;
   item?: Room;
}

export const SectorAModal: React.FC<SectorAModalProps> = ({
   isOpen,
   onClose,
   item,
}) => {
   const [value, setValue] = useState<string>("");
   const [price, setPrice] = useState<string>("");

   const { bookRoom } = useSvavesectorA();

   const closeModal = () => {
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
         onePrice: price,
         allPrice,
         remainingAmount: allPrice,
         isFree: true,
      };
      bookRoom(newItem);
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

      bookRoom(newItem);

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
            allPrice: plasAllPrice.toString(),
            stayingTime: tenDaysLater,
            remainingAmount: neWRemainingAmount,
         };

         bookRoom(newItem);
         closeModal();
      }
   };

   useEffect(() => {
      if (isOpen) {
         setPrice(item?.onePrice || "");
      }
   }, [isOpen]);
   return (
      <Modal visible={isOpen} transparent>
         <BlurView intensity={20} tint="regular" style={styles.constiner}>
            {item?.isFree ? (
               <View style={styles.bodyB}>
                  <Text
                     style={styles.bookRomText}
                  >{`დაკავებული ოთახი - #${item?.room}`}</Text>

                  <Text
                     style={styles.bookTime}
                  >{`დაჯავშნის თარიღი: ${formatDate(item.startTime)}`}</Text>
                  <Text
                     style={styles.bookTime}
                  >{`ჯავშნის დასრულება: ${formatDate(item.stayingTime)}`}</Text>
                  <Text
                     style={styles.bookTime}
                  >{`გადახდილი თანხა: ${item.allPrice ?? 0} ლ `}</Text>
                  <Text
                     style={styles.bookTime}
                  >{`დარჩენილი თანხა: ${item?.remainingAmount ?? 0} ლ`}</Text>
                  <Text
                     style={styles.bookTime}
                  >{`დარჩა: ${getRemainingDays(item.stayingTime)} დღე`}</Text>

                  <View
                     style={[
                        styles.inputConteiner,
                        {
                           marginTop: 5,
                           marginBottom: 15,
                           marginLeft: -10,
                        },
                     ]}
                  >
                     <Text>ერთი დღის თანხა</Text>
                     <TextInput
                        style={styles.inpit}
                        onChangeText={(e) => setPrice(e)}
                        keyboardType="numeric"
                        value={price}
                     />
                     <Text>ლარი</Text>
                  </View>

                  <View
                     style={[
                        styles.inputConteiner,
                        {
                           marginTop: 5,
                           marginBottom: 15,
                           marginLeft: -10,
                        },
                     ]}
                  >
                     <Text> დღეების დამატება</Text>
                     <TextInput
                        style={styles.inpit}
                        onChangeText={(e) => setValue(e)}
                        keyboardType="numeric"
                     />
                     <Text>დღე</Text>
                  </View>

                  <Text
                     style={[styles.priceText, { marginTop: 10 }]}
                  >{`დასამატებელი თანხა: ${Number(price ?? 0) * Number(value ?? 0)}`}</Text>

                  <View style={[styles.bottonConteinter, { marginBottom: 20 }]}>
                     <TouchableOpacity
                        style={[
                           styles.bootan,
                           { backgroundColor: "#EA7070", width: "100%" },
                        ]}
                        onPress={removeBook}
                     >
                        <Text style={styles.bootanText}>ჯავშნის გაუქმება</Text>
                     </TouchableOpacity>
                  </View>

                  <View style={styles.bottonConteinter}>
                     <TouchableOpacity
                        style={[styles.bootan, { backgroundColor: "#EA7070" }]}
                        onPress={closeModal}
                     >
                        <Text style={styles.bootanText}>გაუქმება</Text>
                     </TouchableOpacity>

                     <TouchableOpacity
                        style={[styles.bootan, { backgroundColor: "#BFEA70" }]}
                        onPress={() => {
                           updateBook();
                        }}
                     >
                        <Text style={styles.bootanText}>შენახვა</Text>
                     </TouchableOpacity>
                  </View>
               </View>
            ) : (
               <View style={styles.body}>
                  <Text
                     style={styles.freeRomText}
                  >{`თავისუფალია ოთახი- #${item?.room}`}</Text>

                  <View style={[styles.inputConteiner, { marginBottom: -1 }]}>
                     <Text>ერთი დღის თანხა</Text>
                     <TextInput
                        style={styles.inpit}
                        onChangeText={(e) => setPrice(e)}
                        keyboardType="numeric"
                        value={price}
                     />
                     <Text>ლარი</Text>
                  </View>

                  <View style={styles.inputConteiner}>
                     <Text>დარჩენის დრო</Text>
                     <TextInput
                        value={value}
                        style={styles.inpit}
                        onChangeText={(e) => setValue(e)}
                        keyboardType="numeric"
                     />
                     <Text>დღე</Text>
                  </View>

                  <Text
                     style={styles.priceText}
                  >{`გადასახდელი თანხა: ${Number(price ?? 0) * Number(value ?? 0)}`}</Text>

                  <View style={styles.bottonConteinter}>
                     <TouchableOpacity
                        style={[styles.bootan, { backgroundColor: "#EA7070" }]}
                        onPress={closeModal}
                     >
                        <Text style={styles.bootanText}>გაუქმება</Text>
                     </TouchableOpacity>

                     <TouchableOpacity
                        style={[styles.bootan, { backgroundColor: "#BFEA70" }]}
                        onPress={() => {
                           save();
                        }}
                     >
                        <Text style={styles.bootanText}>შენახვა</Text>
                     </TouchableOpacity>
                  </View>
               </View>
            )}
         </BlurView>
      </Modal>
   );
};

const styles = StyleSheet.create({
   constiner: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      paddingTop: 110,
   },
   body: {
      width: "80%",
      height: 270,
      borderRadius: 12,
      backgroundColor: "#fff",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,

      elevation: 2,
   },
   bodyB: {
      width: "80%",
      height: 440,
      borderRadius: 12,
      backgroundColor: "#fff",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,

      elevation: 2,
   },
   bottonConteinter: {
      paddingHorizontal: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
   },
   bootan: {
      width: "40%",
      height: 50,
      borderRadius: 12,
      borderWidth: 0.1,
      borderColor: "#000",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
   },
   bootanText: {
      fontSize: 16,
      color: "#fff",
   },
   freeRomText: {
      marginTop: 10,
      fontSize: 19,
      color: "#B6E364",
      textAlign: "center",
   },

   bookRomText: {
      marginTop: 10,
      marginBottom: 10,
      fontSize: 19,
      color: "#A81C12",
      textAlign: "center",
   },
   inputConteiner: {
      paddingHorizontal: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 20,
      marginBottom: 50,
   },
   inpit: {
      height: 40,
      width: 100,
      borderColor: "#000",
      borderWidth: 0.5,
      borderRadius: 12,
      textAlign: "center",
   },

   bookTime: {
      fontSize: 13,
      marginLeft: 15,
      marginBottom: 5,
   },
   priceText: {
      marginTop: -30,
      marginBottom: 20,
      marginLeft: 10,
   },
});
