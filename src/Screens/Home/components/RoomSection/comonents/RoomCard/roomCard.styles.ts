import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
   roomCard: {
      height: 72,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
   },
   warningBadge: {
      position: "absolute",
      top: -5,
      right: -5,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: "#f59e0b",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2,
   },
   reservedBadge: {
      position: "absolute",
      top: -5,
      left: -5,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: "#2563eb",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2,
   },
   iconCircle: {
      width: 26,
      height: 26,
      borderRadius: 13,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 3,
   },
   roomText: {
      fontSize: 15,
      fontWeight: "800",
   },
   daysText: {
      fontSize: 9,
      fontWeight: "800",
      marginTop: 1,
   },
});
