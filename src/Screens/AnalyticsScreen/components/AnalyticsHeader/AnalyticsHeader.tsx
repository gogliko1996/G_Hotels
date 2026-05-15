import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./analyticsHeader.styles";

type Props = {
   todayKey: string;
};

export const AnalyticsHeader = ({ todayKey }: Props) => {
   return (
      <View style={styles.header}>
         <View>
            <Text style={styles.title}>ანალიტიკა</Text>
            <Text style={styles.subtitle}>
               დღევანდელი სტატისტიკა: {todayKey}
            </Text>
         </View>

         <View style={styles.headerIcon}>
            <Ionicons name="analytics" size={28} color="#fff" />
         </View>
      </View>
   );
};
