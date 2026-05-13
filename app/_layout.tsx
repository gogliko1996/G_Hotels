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
      hasHydrated: hasHydratedA,
   } = useSvavesectorA();

   const {
      savesectorB,
      sectorB: allSectorB,
      closeBookB,
      changePriceB,
      hasHydrated: hasHydratedB,
   } = useSvavesectorB();

   useEffect(() => {
      if (!hasHydratedA || !hasHydratedB) return;

      if (allSectorA.length === 0) {
         savesectorA([...sectorA]);
      }

      if (allSectorB.length === 0) {
         savesectorB([...sectorB]);
      }
   }, [hasHydratedA, hasHydratedB, allSectorA.length, allSectorB.length]);

   useEffect(() => {
      if (!hasHydratedA || !hasHydratedB) return;

      if (allSectorA.length > 0) {
         closeBookA();
         changePriceA();
      }

      if (allSectorB.length > 0) {
         closeBookB();
         changePriceB();
      }
   }, [hasHydratedA, hasHydratedB, allSectorA.length, allSectorB.length]);

   return (
      <>
         <Stack screenOptions={{ headerShown: false }} />
         <StatusBar style="auto" />
      </>
   );
}
