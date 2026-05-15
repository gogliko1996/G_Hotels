import { View, Text } from "react-native";
import { styles } from "./homeStats.styles";

type Props = {
   freeCount: number;
   busyCount: number;
   reservedCount: number;
};

export const HomeStats = ({ freeCount, busyCount, reservedCount }: Props) => {
   return (
      <View style={styles.statsRow}>
         <View style={styles.statCard}>
            <Text style={styles.statValue}>{freeCount}</Text>
            <Text style={styles.statLabel}>თავისუფალი</Text>
         </View>

         <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: "#ef4444" }]}>
               {busyCount}
            </Text>
            <Text style={styles.statLabel}>დაკავებული</Text>
         </View>

         <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: "#2563eb" }]}>
               {reservedCount}
            </Text>
            <Text style={styles.statLabel}>დაჯავშნილი</Text>
         </View>
      </View>
   );
};
