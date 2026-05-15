import { Text, TouchableOpacity, View } from "react-native";
import { AnalyticsRange } from "../../../../store/analytics_store";
import { styles } from "./rangeSelector.styles";

type Props = {
   range: AnalyticsRange;
   setRange: (range: AnalyticsRange) => void;
};

const ranges: { label: string; value: AnalyticsRange }[] = [
   { label: "7 დღე", value: "7d" },
   { label: "1 თვე", value: "1m" },
   { label: "3 თვე", value: "3m" },
];

export const RangeSelector = ({ range, setRange }: Props) => {
   return (
      <View style={styles.rangeRow}>
         {ranges.map((item) => (
            <TouchableOpacity
               key={item.value}
               onPress={() => setRange(item.value)}
               style={[
                  styles.rangeButton,
                  range === item.value && styles.activeRangeButton,
               ]}
            >
               <Text
                  style={[
                     styles.rangeText,
                     range === item.value && styles.activeRangeText,
                  ]}
               >
                  {item.label}
               </Text>
            </TouchableOpacity>
         ))}
      </View>
   );
};
