import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
   header: {
      backgroundColor: "#111827",
      borderRadius: 24,
      padding: 18,
      marginBottom: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
   },
   title: {
      fontSize: 26,
      fontWeight: "900",
      color: "#fff",
   },
   subtitle: {
      marginTop: 4,
      fontSize: 13,
      color: "#cbd5e1",
   },
   headerIcon: {
      width: 52,
      height: 52,
      borderRadius: 18,
      backgroundColor: "#2563eb",
      alignItems: "center",
      justifyContent: "center",
   },
});
