import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./compareCard.styles";

type Props = {
   todayBusyRooms: number;
   bookedDifference: number;
};

export const CompareCard = ({ todayBusyRooms, bookedDifference }: Props) => {
   const isMore = bookedDifference > 0;
   const isLess = bookedDifference < 0;

   return (
      <View style={styles.compareCard}>
         <Text style={styles.cardTitle}>დღევანდელი შედარება</Text>

         <View style={styles.compareRow}>
            <View>
               <Text style={styles.bigNumber}>{todayBusyRooms}</Text>
               <Text style={styles.smallLabel}>დღეს დაკავებული</Text>
            </View>

            <View
               style={[
                  styles.compareBadge,
                  {
                     backgroundColor: isMore
                        ? "#dcfce7"
                        : isLess
                          ? "#fee2e2"
                          : "#e0f2fe",
                  },
               ]}
            >
               <Ionicons
                  name={isMore ? "arrow-up" : isLess ? "arrow-down" : "remove"}
                  size={18}
                  color={isMore ? "#16a34a" : isLess ? "#dc2626" : "#0284c7"}
               />

               <Text
                  style={[
                     styles.compareText,
                     {
                        color: isMore
                           ? "#16a34a"
                           : isLess
                             ? "#dc2626"
                             : "#0284c7",
                     },
                  ]}
               >
                  {bookedDifference > 0 ? "+" : ""}
                  {bookedDifference}
               </Text>
            </View>
         </View>

         <Text style={styles.compareDescription}>
            {isMore
               ? "დღეს უფრო მეტი ოთახია დაკავებული, ვიდრე წინა ჩანაწერში."
               : isLess
                 ? "დღეს ნაკლები ოთახია დაკავებული, ვიდრე წინა ჩანაწერში."
                 : "დაკავებული ოთახების რაოდენობა არ შეცვლილა."}
         </Text>
      </View>
   );
};
