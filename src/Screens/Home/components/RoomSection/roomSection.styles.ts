import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
   section: {
      backgroundColor: "#fff",
      borderRadius: 22,
      padding: 14,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 4,
   },
   sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 12,
   },
   sectionTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: "#0f172a",
   },
   columnGap: {
      justifyContent: "space-between",
      marginBottom: 8,
   },
});
