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
      marginBottom: 18,
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

   hotelImage: {
      width: "100%",
      height: 210,
      borderRadius: 22,
      marginBottom: 18,
      backgroundColor: "#e2e8f0",
   },

   logoutText: {
      color: "#fff",
      fontSize: 17,
      fontWeight: "800",
   },
});
