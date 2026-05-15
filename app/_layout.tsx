import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
   View,
   Text,
   TouchableOpacity,
   StyleSheet,
   TextInput,
   Pressable,
   Keyboard,
   ActivityIndicator,
} from "react-native";

import { StatusBar } from "expo-status-bar";

import { createRoomsInFirebase } from "../src/services/firebaseRooms";
import { useAuthStore } from "../src/store/auth_store";

export default function RootLayout() {
   const [inputEmail, setInputEmail] = useState("");
   const [password, setPassword] = useState("");
   const [errorText, setErrorText] = useState("");

   const { user, loading, login, listenAuth } = useAuthStore();

   useEffect(() => {
      const unsubscribe = listenAuth();
      return unsubscribe;
   }, []);

   const handleLogin = async () => {
      try {
         setErrorText("");
         await login(inputEmail.trim(), password);
      } catch (error) {
         console.log(error);
         setErrorText("Email ან პაროლი არასწორია");
      }
   };

   if (loading) {
      return (
         <View style={styles.container}>
            <ActivityIndicator size="large" color="#fff" />
         </View>
      );
   }

   if (!user) {
      return (
         <Pressable onPress={Keyboard.dismiss} style={styles.container}>
            <Text style={styles.title}>სასტუმროს სისტემა</Text>

            <TextInput
               placeholder="Email"
               placeholderTextColor="#999"
               style={styles.input}
               value={inputEmail}
               onChangeText={setInputEmail}
               autoCapitalize="none"
               keyboardType="email-address"
            />

            <TextInput
               placeholder="Password"
               placeholderTextColor="#999"
               style={styles.input}
               secureTextEntry
               value={password}
               onChangeText={setPassword}
            />

            {errorText ? (
               <Text style={styles.errorText}>{errorText}</Text>
            ) : null}

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
               <Text style={styles.buttonText}>შესვლა</Text>
            </TouchableOpacity>
         </Pressable>
      );
   }

   return (
      <>
         <Stack screenOptions={{ headerShown: false }} />

         {/*<TouchableOpacity
            style={styles.createButton}
            onPress={createRoomsInFirebase}
         >
            <Text style={styles.buttonText}>Firebase-ში შექმნა</Text>
         </TouchableOpacity>*/}

         <StatusBar style="auto" />
      </>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#0f172a",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
   },

   title: {
      color: "#fff",
      fontSize: 32,
      fontWeight: "800",
      marginBottom: 30,
   },

   input: {
      width: "100%",
      height: 56,
      backgroundColor: "#1e293b",
      borderRadius: 14,
      paddingHorizontal: 16,
      color: "#fff",
      marginBottom: 14,
   },

   errorText: {
      color: "#ef4444",
      fontSize: 14,
      marginBottom: 8,
      fontWeight: "700",
   },

   button: {
      width: "100%",
      height: 58,
      borderRadius: 18,
      backgroundColor: "#2563eb",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10,
   },

   createButton: {
      position: "absolute",
      right: 16,
      bottom: 40,
      width: 170,
      height: 48,
      borderRadius: 16,
      backgroundColor: "#2563eb",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
   },

   buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "800",
   },
});
