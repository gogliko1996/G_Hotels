import React from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/auth_store";
import { styles } from "./settings.style";
// import { SettingsDevTools } from "./components/SettingsDevTools/SettingsDevTools";

export const SettingsScreen: React.FC = () => {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert("გასვლა", "ნამდვილად გსურს ანგარიშიდან გასვლა?", [
      {
        text: "გაუქმება",
        style: "cancel",
      },
      {
        text: "გასვლა",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="settings-outline" size={34} color="#2563eb" />

          <Text style={styles.title}>სეთინგები</Text>
        </View>

        <Image
          source={require("../../../assets/room.jpg")}
          style={styles.hotelImage}
          resizeMode="cover"
        />

        {/* <SettingsDevTools /> */}

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.logoutButton}
          onPress={() => handleLogout()}
        >
          <Ionicons name="log-out-outline" size={24} color="#fff" />

          <Text style={styles.logoutText}>გასვლა</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
