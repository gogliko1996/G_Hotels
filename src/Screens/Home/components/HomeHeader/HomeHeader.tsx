import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./homeHeader.styles";

export const HomeHeader = () => {
   return (
      <View style={styles.header}>
         <View>
            <Text style={styles.title}>სასტუმროს პანელი</Text>
            <Text style={styles.subtitle}>
               ოთახების დაკავება და წინასწარი ჯავშნები
            </Text>
         </View>

         <View style={styles.headerIcon}>
            <Ionicons name="business" size={28} color="#fff" />
         </View>
      </View>
   );
};
