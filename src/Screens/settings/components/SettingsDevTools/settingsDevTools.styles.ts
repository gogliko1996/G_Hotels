import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
   container: {
      marginBottom: 14,
   },
   createRoomsButton: {
      minHeight: 58,
      borderRadius: 18,
      backgroundColor: "#2563eb",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 14,
      marginBottom: 14,
      gap: 10,
   },
   createExpensesButton: {
      minHeight: 58,
      borderRadius: 18,
      backgroundColor: "#16a34a",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 14,
      marginBottom: 14,
      gap: 10,
   },
   createHistoryButton: {
      minHeight: 58,
      borderRadius: 18,
      backgroundColor: "#7c3aed",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 14,
      gap: 10,
   },
   buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "800",
      textAlign: "center",
      flexShrink: 1,
   },
});
