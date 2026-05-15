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
      marginBottom: 6,
   },
   chartSubtitle: {
      fontSize: 13,
      color: "#64748b",
      fontWeight: "700",
   },
   guestChart: {
      height: 190,
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "center",
      gap: 44,
   },
   guestBarItem: {
      alignItems: "center",
      width: 80,
   },
   guestBarWrapper: {
      height: 130,
      justifyContent: "flex-end",
   },
   guestBar: {
      width: 42,
      borderRadius: 999,
      backgroundColor: "#16a34a",
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
