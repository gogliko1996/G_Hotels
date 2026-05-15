import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
   reservationTable: {
      marginTop: 16,
      backgroundColor: "#fff",
      borderRadius: 24,
      padding: 18,
   },
   cardTitle: {
      fontSize: 18,
      fontWeight: "900",
      color: "#0f172a",
      marginBottom: 12,
   },
   reservationRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#f1f5f9",
   },
   roomNumber: {
      fontSize: 16,
      fontWeight: "900",
      color: "#0f172a",
   },
   reservationDate: {
      marginTop: 4,
      fontSize: 13,
      color: "#64748b",
      fontWeight: "700",
   },
   reservationRight: {
      alignItems: "flex-end",
   },
   reservationDays: {
      fontSize: 13,
      fontWeight: "800",
      color: "#2563eb",
   },
   reservationPrice: {
      marginTop: 4,
      fontSize: 16,
      fontWeight: "900",
      color: "#16a34a",
   },
   emptyText: {
      fontSize: 14,
      color: "#94a3b8",
      fontWeight: "700",
      marginTop: 8,
   },
});
