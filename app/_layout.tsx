import { Stack } from "expo-router";
import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

import { useSvavesectorA } from "../src/store/sectorA_store";
import { useSvavesectorB } from "../src/store/sectorB_store";

import { sectorA } from "../src/contstns/sectorA";
import { sectorB } from "../src/contstns/sectorB";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {
   const [started, setStarted] = useState(false);

   const { savesectorA, sectorA: allSectorA } = useSvavesectorA();

   const { savesectorB, sectorB: allSectorB } = useSvavesectorB();

   const startApp = () => {
      savesectorA([...sectorA]);
      savesectorB([...sectorB]);
      setStarted(true);
   };

   const hasData = allSectorA.length > 0 && allSectorB.length > 0;

   if (!hasData && !started) {
      return (
         <View style={styles.container}>
            <Text style={styles.title}>სასტუმროს სისტემა</Text>

            <TouchableOpacity style={styles.button} onPress={() => startApp()}>
               <Text style={styles.buttonText}>დაწყება</Text>
            </TouchableOpacity>

            <StatusBar style="auto" />
         </View>
      );
   }

   return (
      <>
         <Stack screenOptions={{ headerShown: false }} />
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

   button: {
      width: 220,
      height: 58,
      borderRadius: 18,
      backgroundColor: "#2563eb",
      justifyContent: "center",
      alignItems: "center",
   },

   buttonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "800",
   },
});
