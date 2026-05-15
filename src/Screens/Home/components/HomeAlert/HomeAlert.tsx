import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./homeAlert.styles";

type Props = {
   count: number;
};

export const HomeAlert = ({ count }: Props) => {
   return (
      <View style={styles.alertCard}>
         <Ionicons name="warning" size={24} color="#f59e0b" />

         <View style={{ flex: 1 }}>
            <Text style={styles.alertTitle}>ყურადღება</Text>
            <Text style={styles.alertText}>
               {count} ოთახს დღეს ან ხვალ უმთავრდება დაკავება
            </Text>
         </View>
      </View>
   );
};
