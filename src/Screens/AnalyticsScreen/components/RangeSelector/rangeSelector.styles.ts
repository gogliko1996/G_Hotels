import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
   rangeRow: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 14,
   },
   rangeButton: {
      flex: 1,
      height: 44,
      borderRadius: 999,
      backgroundColor: "#fff",
      borderWidth: 1,
      borderColor: "#e2e8f0",
      alignItems: "center",
      justifyContent: "center",
   },
   activeRangeButton: {
      backgroundColor: "#2563eb",
      borderColor: "#2563eb",
   },
   rangeText: {
      fontSize: 13,
      color: "#475569",
      fontWeight: "800",
   },
   activeRangeText: {
      color: "#fff",
   },
});
