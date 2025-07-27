import React, { useState } from "react";
import {
   View,
   FlatList,
   TouchableOpacity,
   StyleSheet,
   Text,
} from "react-native";

import { SectorAModal } from "../../Components/sectorA_modal";
import { Room } from "../../contstns/sectorB";
import { useSvavesectorA } from "../../store/sectorA_store";
import { useSvavesectorB } from "../../store/sectorB_store";
import { SectorBModal } from "../../Components/sectorB_modal";

export const Home: React.FC = () => {
   const [showCorpusAModal, setShowCorpusAModal] = useState(false);
   const [showCorpusBModal, setShowCorpusBModal] = useState(false);
   const [corpusAItem, setCorpusAItem] = useState<Room>();
   const { sectorA } = useSvavesectorA();
   const { sectorB } = useSvavesectorB();

   return (
      <View style={{ flex: 1 }}>
         <SectorAModal
            isOpen={showCorpusAModal}
            onClose={() => setShowCorpusAModal(!showCorpusAModal)}
            item={corpusAItem}
         />
         <SectorBModal
            item={corpusAItem}
            isOpen={showCorpusBModal}
            onClose={() => setShowCorpusBModal(!showCorpusBModal)}
         />
         <Text style={styles.secdtorAHeaderText}>A-კორპუსი</Text>
         <FlatList
            data={sectorA}
            keyExtractor={(item) => item.id.toString()}
            numColumns={6}
            scrollEnabled={false}
            renderItem={({ item }) => (
               <TouchableOpacity
                  onPress={() => {
                     setCorpusAItem(item);
                     setShowCorpusAModal(!showCorpusAModal);
                  }}
                  style={[
                     styles.secdtorAConteiner,
                     { backgroundColor: item.isFree ? "#A81C12" : "#2BA812" },
                  ]}
               >
                  <Text style={styles.secdtorABodyText}>{item.room}</Text>
               </TouchableOpacity>
            )}
         />

         <Text style={[styles.secdtorAHeaderText, { marginTop: -120 }]}>
            B-კორპუსი
         </Text>
         <FlatList
            data={sectorB}
            keyExtractor={(item) => item.id.toString()}
            numColumns={5}
            scrollEnabled={false}
            renderItem={({ item }) => (
               <TouchableOpacity
                  onPress={() => {
                     setCorpusAItem(item);
                     setShowCorpusBModal(!showCorpusBModal);
                  }}
                  style={[
                     styles.secdtorAConteiner,
                     {
                        backgroundColor: item.isFree ? "#A81C12" : "#2BA812",
                        width: "20%",
                     },
                  ]}
               >
                  <Text style={styles.secdtorABodyText}>{item.room}</Text>
               </TouchableOpacity>
            )}
         />
      </View>
   );
};

const styles = StyleSheet.create({
   secdtorAConteiner: {
      width: "16.5%",
      height: 40,
      borderColor: "#000",
      borderWidth: 1,
      paddingTop: 5,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
   },
   secdtorAHeaderText: {
      fontSize: 20,
      textAlign: "center",
      marginBottom: 10,
   },
   secdtorABodyText: {
      fontSize: 20,
      color: "#fff",
      marginBottom: 10,
   },
});
