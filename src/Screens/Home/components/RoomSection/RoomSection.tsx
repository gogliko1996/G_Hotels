import { FlatList, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FirebaseRoom } from "../../../../store/store_service_type";
import { styles } from "./roomSection.styles";
import { RoomCard } from "./comonents/RoomCard/RoomCard";

type Props = {
   title: string;
   rooms: FirebaseRoom[];
   columns: number;
   width: `${number}%`;
   iconName: keyof typeof MaterialCommunityIcons.glyphMap;
   iconColor: string;
   isRoomDimmed: (room: FirebaseRoom) => boolean;
   onRoomPress: (room: FirebaseRoom) => void;
};

export const RoomSection = ({
   title,
   rooms,
   columns,
   width,
   iconName,
   iconColor,
   isRoomDimmed,
   onRoomPress,
}: Props) => {
   return (
      <View style={styles.section}>
         <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
               name={iconName}
               size={24}
               color={iconColor}
            />

            <Text style={styles.sectionTitle}>{title}</Text>
         </View>

         <FlatList
            data={rooms}
            keyExtractor={(item) => item.firebaseId}
            numColumns={columns}
            scrollEnabled={false}
            columnWrapperStyle={styles.columnGap}
            renderItem={({ item }) => (
               <RoomCard
                  item={item}
                  width={width}
                  dimmed={isRoomDimmed(item)}
                  onPress={() => onRoomPress(item)}
               />
            )}
         />
      </View>
   );
};
