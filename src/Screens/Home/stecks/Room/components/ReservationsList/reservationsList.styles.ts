import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
   card: {
      backgroundColor: "#fff",
      borderRadius: 22,
      padding: 16,
      borderWidth: 1,
      borderColor: "#e2e8f0",
   },
   title: {
      fontSize: 20,
      fontWeight: "900",
      color: "#0f172a",
      marginBottom: 12,
   },
   emptyText: {
      fontSize: 14,
      fontWeight: "700",
      color: "#64748b",
   },
   reservationCard: {
      backgroundColor: "#eff6ff",
      borderRadius: 18,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: "#bfdbfe",
   },
   guestName: {
      fontSize: 16,
      fontWeight: "900",
      color: "#1d4ed8",
      marginBottom: 6,
   },
   text: {
      fontSize: 14,
      fontWeight: "700",
      color: "#334155",
      marginBottom: 4,
   },
   price: {
      marginTop: 6,
      fontSize: 18,
      fontWeight: "900",
      color: "#2563eb",
   },
   paymentText: {
      marginTop: 4,
      fontSize: 14,
      fontWeight: "900",
      color: "#0f172a",
   },
   actionsRow: {
      flexDirection: "row",
      gap: 10,
      marginTop: 10,
   },
   editButton: {
      flex: 1,
      height: 42,
      borderRadius: 14,
      backgroundColor: "#2563eb",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 6,
   },
   deleteButton: {
      flex: 1,
      height: 42,
      borderRadius: 14,
      backgroundColor: "#ef4444",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 6,
   },
   buttonText: {
      color: "#fff",
      fontSize: 13,
      fontWeight: "900",
   },
});
