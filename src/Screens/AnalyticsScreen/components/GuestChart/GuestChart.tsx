import { Text, View } from "react-native";
import { styles } from "./guestChart.styles";

type Props = {
   guestsToday: number;
   guestsYesterday: number;
   guestsDifference: number;
};

export const GuestChart = ({
   guestsToday,
   guestsYesterday,
   guestsDifference,
}: Props) => {
   const maxValue = Math.max(guestsToday, guestsYesterday, 1);

   return (
      <View style={styles.chartCard}>
         <Text style={styles.cardTitle}>შესული სტუმრები დღეს / გუშინ</Text>

         <Text style={styles.chartSubtitle}>
            სხვაობა: {guestsDifference > 0 ? "+" : ""}
            {guestsDifference}
         </Text>

         <View style={styles.guestChart}>
            {[
               { label: "გუშინ", value: guestsYesterday },
               { label: "დღეს", value: guestsToday },
            ].map((item) => {
               const height = Math.max(10, (item.value / maxValue) * 130);

               return (
                  <View key={item.label} style={styles.guestBarItem}>
                     <View style={styles.guestBarWrapper}>
                        <View style={[styles.guestBar, { height }]} />
                     </View>

                     <Text style={styles.barValue}>{item.value}</Text>
                     <Text style={styles.barDate}>{item.label}</Text>
                  </View>
               );
            })}
         </View>
      </View>
   );
};
