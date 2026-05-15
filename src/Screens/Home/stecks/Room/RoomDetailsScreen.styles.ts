import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
   safe: {
      flex: 1,
      backgroundColor: "#f8fafc",
   },
   content: {
      padding: 16,
      paddingBottom: 40,
   },
   center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
   },
   loadingText: {
      marginTop: 12,
      fontSize: 16,
      fontWeight: "800",
      color: "#0f172a",
   },
   notFoundText: {
      fontSize: 18,
      fontWeight: "800",
      color: "#ef4444",
   },
});
