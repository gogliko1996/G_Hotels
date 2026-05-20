import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/auth_store";
import { styles } from "./settings.style";
import { createRoomsInFirebase } from "../../services/firebaseRooms";
import { createExpensesTableInFirebase } from "../../services/expensesService";

export const SettingsScreen: React.FC = () => {
   const { logout } = useAuthStore();
   const [creatingRooms, setCreatingRooms] = useState(false);
   const [creatingExpensesTable, setCreatingExpensesTable] = useState(false);

   const handleLogout = () => {
      Alert.alert("გასვლა", "ნამდვილად გსურს ანგარიშიდან გასვლა?", [
         {
            text: "გაუქმება",
            style: "cancel",
         },
         {
            text: "გასვლა",
            style: "destructive",
            onPress: async () => {
               await logout();
            },
         },
      ]);
   };

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

   return (
      <SafeAreaView style={styles.safe}>
         <View style={styles.container}>
            <View style={styles.header}>
               <Ionicons name="settings-outline" size={34} color="#2563eb" />

               <Text style={styles.title}>სეთინგები</Text>
            </View>

            <TouchableOpacity
               activeOpacity={0.8}
               style={styles.createRoomsButton}
               onPress={handleCreateRooms}
               disabled={creatingRooms}
            >
               <Ionicons name="cloud-upload-outline" size={24} color="#fff" />

               <Text style={styles.createRoomsText}>
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

               <Text style={styles.createRoomsText}>
                  {creatingExpensesTable
                     ? "იქმნება..."
                     : "ხარჯების ცხრილის შექმნა"}
               </Text>
            </TouchableOpacity>

            <TouchableOpacity
               activeOpacity={0.8}
               style={styles.logoutButton}
               onPress={() => handleLogout()}
            >
               <Ionicons name="log-out-outline" size={24} color="#fff" />

               <Text style={styles.logoutText}>გასვლა</Text>
            </TouchableOpacity>
         </View>
      </SafeAreaView>
   );
};
