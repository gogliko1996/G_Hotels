import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";

import { useSvavesectorA } from "../src/store/sectorA_store";
import { useSvavesectorB } from "../src/store/sectorB_store";

import { sectorA } from "../src/contstns/sectorA";
import { sectorB } from "../src/contstns/sectorB";

export default function RootLayout() {
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
      if (allSectorA.length <= 0) {
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
      if (allSectorB.length <= 0) {
         savesectorB(sectorB);
      }
   }, []);

   return (
      <>
         <Stack screenOptions={{ headerShown: false }} />
         <StatusBar style="auto" />
      </>
   );
}
