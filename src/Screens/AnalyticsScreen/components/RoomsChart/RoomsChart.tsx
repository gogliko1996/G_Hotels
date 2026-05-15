import { Text, View } from "react-native";
import { styles } from "./roomsChart.styles";

type ChartItem = {
   date: string;
   busyRooms: number;
};

type Props = {
   chartData: ChartItem[];
};

export const RoomsChart = ({ chartData }: Props) => {
   const maxBooked = Math.max(
      ...chartData.map((item) => Number(item.busyRooms || 0)),
      1,
   );

   return (
      <View style={styles.chartCard}>
         <Text style={styles.cardTitle}>დაკავებული ოთახები</Text>

         <View style={styles.chart}>
            {chartData.slice(-14).map((item) => {
               const busyRoomsValue = Number(item.busyRooms || 0);

               const height =
                  busyRoomsValue === 0
                     ? 12
                     : Math.max(18, (busyRoomsValue / maxBooked) * 130);

               return (
                  <View key={item.date} style={styles.barItem}>
                     <View style={styles.barWrapper}>
                        <View style={[styles.bar, { height }]} />
                     </View>

                     <Text style={styles.barValue}>{busyRoomsValue}</Text>
                     <Text style={styles.barDate}>{item.date.slice(5)}</Text>
                  </View>
               );
            })}
         </View>
      </View>
   );
};
