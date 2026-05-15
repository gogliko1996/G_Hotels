import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
   compareCard: {
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
   compareRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
   },
   bigNumber: {
      fontSize: 42,
      fontWeight: "900",
      color: "#0f172a",
   },
   smallLabel: {
      fontSize: 13,
      color: "#64748b",
      fontWeight: "700",
   },
   compareBadge: {
      minWidth: 78,
      height: 44,
      borderRadius: 999,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      paddingHorizontal: 12,
   },
   compareText: {
      fontSize: 18,
      fontWeight: "900",
   },
   compareDescription: {
      marginTop: 12,
      fontSize: 14,
      color: "#475569",
      fontWeight: "600",
      lineHeight: 20,
   },
});
