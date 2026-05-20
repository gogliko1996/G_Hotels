import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
   safe: {
      flex: 1,
      backgroundColor: "#f8fafc",
   },
   scrollContent: {
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 30,
   },
   historyButton: {
      minHeight: 58,
      borderRadius: 18,
      backgroundColor: "#7c3aed",
      marginTop: 16,
      paddingHorizontal: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
   },
   historyButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "900",
   },
});
