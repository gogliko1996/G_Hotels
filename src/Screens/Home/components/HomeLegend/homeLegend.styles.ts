import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
   legendRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 14,
      marginBottom: 16,
   },
   legendItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
   },
   legendDot: {
      width: 10,
      height: 10,
      borderRadius: 10,
   },
   legendText: {
      fontSize: 13,
      color: "#475569",
      fontWeight: "600",
   },
});
