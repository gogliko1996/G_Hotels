import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
   card: {
      backgroundColor: "#fff",
      borderRadius: 22,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: "#e2e8f0",
   },
   title: {
      fontSize: 20,
      fontWeight: "900",
      color: "#0f172a",
      marginBottom: 14,
   },
   subTitle: {
      fontSize: 16,
      fontWeight: "900",
      color: "#334155",
      marginBottom: 10,
   },
   row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
   },
   label: {
      fontSize: 14,
      color: "#64748b",
      fontWeight: "700",
   },
   value: {
      fontSize: 14,
      color: "#0f172a",
      fontWeight: "900",
   },
   phoneText: {
      fontSize: 14,
      color: "#2563eb",
      fontWeight: "900",
   },
   paidText: {
      fontSize: 14,
      color: "#16a34a",
      fontWeight: "900",
   },
   unpaidText: {
      fontSize: 14,
      color: "#ef4444",
      fontWeight: "900",
   },
   divider: {
      height: 1,
      backgroundColor: "#e2e8f0",
      marginVertical: 12,
   },
});
