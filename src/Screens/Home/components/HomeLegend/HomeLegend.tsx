import { View, Text } from "react-native";
import { styles } from "./homeLegend.styles";

const items = [
   { label: "თავისუფალი", color: "#22c55e" },
   { label: "დაკავებული", color: "#ef4444" },
   { label: "დაჯავშნილი", color: "#2563eb" },
   { label: "ორივე", color: "#7c3aed" },
];

export const HomeLegend = () => {
   return (
      <View style={styles.legendRow}>
         {items.map((item) => (
            <View key={item.label} style={styles.legendItem}>
               <View
                  style={[styles.legendDot, { backgroundColor: item.color }]}
               />
               <Text style={styles.legendText}>{item.label}</Text>
            </View>
         ))}
      </View>
   );
};
