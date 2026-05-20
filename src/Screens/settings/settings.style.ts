import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
   safe: {
      flex: 1,
      backgroundColor: "#f8fafc",
   },

   container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 30,
   },

   header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 40,
   },

   title: {
      fontSize: 30,
      fontWeight: "800",
      color: "#0f172a",
   },

   logoutButton: {
      height: 58,
      borderRadius: 18,
      backgroundColor: "#ef4444",

      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",

      gap: 10,
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

   createRoomsText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "800",
      textAlign: "center",
      flexShrink: 1,
   },

   logoutText: {
      color: "#fff",
      fontSize: 17,
      fontWeight: "800",
   },
});
