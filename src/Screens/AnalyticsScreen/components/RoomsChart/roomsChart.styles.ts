import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
   chartCard: {
      backgroundColor: "#fff",
      borderRadius: 24,
      padding: 18,
      marginBottom: 16,
   },
   cardTitle: {
      fontSize: 18,
      fontWeight: "900",
      color: "#0f172a",
      marginBottom: 12,
   },
   chart: {
      height: 190,
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-around",
   },
   barItem: {
      alignItems: "center",
      width: 28,
   },
   barWrapper: {
      height: 130,
      justifyContent: "flex-end",
   },
   bar: {
      width: 18,
      borderRadius: 999,
      backgroundColor: "#2563eb",
   },
   barValue: {
      marginTop: 6,
      fontSize: 11,
      fontWeight: "800",
      color: "#0f172a",
   },
   barDate: {
      marginTop: 2,
      fontSize: 9,
      fontWeight: "700",
      color: "#94a3b8",
   },
});
