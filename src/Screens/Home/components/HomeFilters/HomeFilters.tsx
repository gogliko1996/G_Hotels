import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./homeFilters.styles";

export type FilterType = "all" | "free" | "busy" | "reserved" | "ending";

type Props = {
   search: string;
   setSearch: (value: string) => void;
   filter: FilterType;
   setFilter: (value: FilterType) => void;
};

const filters: { label: string; value: FilterType }[] = [
   { label: "ყველა", value: "all" },
   { label: "თავისუფალი", value: "free" },
   { label: "დაკავებული", value: "busy" },
   { label: "დაჯავშნილი", value: "reserved" },
   { label: "გასასვლელი", value: "ending" },
];

export const HomeFilters = ({
   search,
   setSearch,
   filter,
   setFilter,
}: Props) => {
   return (
      <>
         <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#64748b" />

            <TextInput
               value={search}
               onChangeText={setSearch}
               placeholder="ოთახის ნომრით ძებნა..."
               placeholderTextColor="#94a3b8"
               style={styles.searchInput}
               keyboardType="numeric"
            />
         </View>

         <View style={styles.filtersRow}>
            {filters.map((item) => (
               <TouchableOpacity
                  key={item.value}
                  onPress={() => setFilter(item.value)}
                  style={[
                     styles.filterButton,
                     filter === item.value && styles.activeFilterButton,
                  ]}
               >
                  <Text
                     style={[
                        styles.filterText,
                        filter === item.value && styles.activeFilterText,
                     ]}
                  >
                     {item.label}
                  </Text>
               </TouchableOpacity>
            ))}
         </View>
      </>
   );
};
