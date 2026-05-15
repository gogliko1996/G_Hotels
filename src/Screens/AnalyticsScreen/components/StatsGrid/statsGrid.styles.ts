import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
   grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
   },
   statCard: {
      width: "48%",
      borderRadius: 20,
      padding: 16,
   },
   statValue: {
      marginTop: 8,
      fontSize: 24,
      fontWeight: "900",
      color: "#0f172a",
   },
   statTitle: {
      marginTop: 2,
      fontSize: 13,
      color: "#64748b",
      fontWeight: "700",
   },
   fullWidthCard: {
      width: "100%",
      borderRadius: 20,
      padding: 18,
      backgroundColor: "#fff",
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
   },
   fullWidthValue: {
      fontSize: 28,
      fontWeight: "900",
      color: "#0f172a",
   },
   fullWidthTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: "#64748b",
   },
});
