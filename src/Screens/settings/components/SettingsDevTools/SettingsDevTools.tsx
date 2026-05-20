import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { createRoomsInFirebase } from "../../../../services/firebaseRooms";
import { createExpensesTableInFirebase } from "../../../../services/expensesService";
import { createHistoryTableInFirebase } from "../../../../services/roomsService";
import { styles } from "./settingsDevTools.styles";

export const SettingsDevTools: React.FC = () => {
   const [creatingRooms, setCreatingRooms] = useState(false);
   const [creatingExpensesTable, setCreatingExpensesTable] = useState(false);
   const [creatingHistoryTable, setCreatingHistoryTable] = useState(false);

   const handleCreateRooms = () => {
      Alert.alert(
         "ოთახების დამატება",
         "ეს მოქმედება Firebase-ში ოთახების დოკუმენტებს შექმნის ან ახლიდან ჩაწერს. გააგრძელო?",
         [
            {
               text: "გაუქმება",
               style: "cancel",
            },
            {
               text: "დამატება",
               onPress: async () => {
                  try {
                     setCreatingRooms(true);
                     await createRoomsInFirebase();
                     Alert.alert("შესრულდა", "ოთახები დაემატა Firebase-ში");
                  } catch (error) {
                     console.log(error);
                     Alert.alert("შეცდომა", "ოთახების დამატება ვერ მოხერხდა");
                  } finally {
                     setCreatingRooms(false);
                  }
               },
            },
         ],
      );
   };

   const handleCreateExpensesTable = () => {
      Alert.alert(
         "ხარჯების ცხრილი",
         "Firebase-ში შეიქმნას expenses collection ხარჯებისთვის?",
         [
            {
               text: "გაუქმება",
               style: "cancel",
            },
            {
               text: "შექმნა",
               onPress: async () => {
                  try {
                     setCreatingExpensesTable(true);
                     await createExpensesTableInFirebase();
                     Alert.alert("შესრულდა", "ხარჯების ცხრილი შეიქმნა");
                  } catch (error) {
                     console.log(error);
                     Alert.alert("შეცდომა", "ხარჯების ცხრილი ვერ შეიქმნა");
                  } finally {
                     setCreatingExpensesTable(false);
                  }
               },
            },
         ],
      );
   };

   const handleCreateHistoryTable = () => {
      Alert.alert(
         "ისტორიის ცხრილი",
         "Firebase-ში შეიქმნას ცალკე roomHistory ცხრილი ისტორიისთვის?",
         [
            {
               text: "გაუქმება",
               style: "cancel",
            },
            {
               text: "შექმნა",
               onPress: async () => {
                  try {
                     setCreatingHistoryTable(true);
                     await createHistoryTableInFirebase();
                     Alert.alert("შესრულდა", "ისტორიის ცხრილი შეიქმნა");
                  } catch (error) {
                     console.log(error);
                     Alert.alert("შეცდომა", "ისტორიის ცხრილი ვერ შეიქმნა");
                  } finally {
                     setCreatingHistoryTable(false);
                  }
               },
            },
         ],
      );
   };

   return (
      <View style={styles.container}>
         <TouchableOpacity
            activeOpacity={0.8}
            style={styles.createRoomsButton}
            onPress={handleCreateRooms}
            disabled={creatingRooms}
         >
            <Ionicons name="cloud-upload-outline" size={24} color="#fff" />

            <Text style={styles.buttonText}>
               {creatingRooms ? "ემატება..." : "ოთახების დამატება Firebase-ში"}
            </Text>
         </TouchableOpacity>

         <TouchableOpacity
            activeOpacity={0.8}
            style={styles.createExpensesButton}
            onPress={handleCreateExpensesTable}
            disabled={creatingExpensesTable}
         >
            <Ionicons name="receipt-outline" size={24} color="#fff" />

            <Text style={styles.buttonText}>
               {creatingExpensesTable
                  ? "იქმნება..."
                  : "ხარჯების ცხრილის შექმნა"}
            </Text>
         </TouchableOpacity>

         <TouchableOpacity
            activeOpacity={0.8}
            style={styles.createHistoryButton}
            onPress={handleCreateHistoryTable}
            disabled={creatingHistoryTable}
         >
            <Ionicons name="time-outline" size={24} color="#fff" />

            <Text style={styles.buttonText}>
               {creatingHistoryTable
                  ? "იქმნება..."
                  : "ისტორიის ცხრილის შექმნა"}
            </Text>
         </TouchableOpacity>
      </View>
   );
};
