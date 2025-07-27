import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useSvavesectorA } from "./src/store/sectorA_store";
import { useEffect } from "react";
import { sectorA } from "./src/contstns/sectorA";
import { Home } from "./src/Screens/Home/Home";
import { useSvavesectorB } from "./src/store/sectorB_store";
import { sectorB } from "./src/contstns/sectorB";

export default function App() {
   const {
      savesectorA,
      sectorA: allSectorA,
      closeBookA,
      changePriceA,
   } = useSvavesectorA();
   const {
      savesectorB,
      sectorB: allSectorB,
      closeBookB,
      changePriceB,
   } = useSvavesectorB();

   useEffect(() => {
      if (!allSectorA) {
         savesectorA(sectorA);
      }
   }, []);

   useEffect(() => {
      closeBookA();
      closeBookB();
      changePriceA();
      changePriceB();
   }, []);

   useEffect(() => {
      if (!allSectorB) {
         savesectorB(sectorB);
      }
   }, []);

   return (
      <View style={styles.container}>
         <Home />
         <StatusBar style="auto" />
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      paddingTop: 100,
      backgroundColor: "#fff",
      paddingRight: 10,
      paddingLeft: 10,
   },
});
