import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
   statsRow: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 14,
   },
   statCard: {
      flex: 1,
      backgroundColor: "#fff",
      borderRadius: 18,
      paddingVertical: 14,
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#e2e8f0",
   },
   statValue: {
      fontSize: 22,
      fontWeight: "900",
      color: "#22c55e",
   },
   statLabel: {
      marginTop: 4,
      fontSize: 12,
      fontWeight: "700",
      color: "#64748b",
   },
});
