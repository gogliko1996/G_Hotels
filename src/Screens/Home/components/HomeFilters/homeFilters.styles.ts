import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
   searchBox: {
      height: 54,
      backgroundColor: "#fff",
      borderRadius: 18,
      paddingHorizontal: 14,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
      borderWidth: 1,
      borderColor: "#e2e8f0",
   },
   searchInput: {
      flex: 1,
      marginLeft: 8,
      fontSize: 15,
      color: "#0f172a",
      fontWeight: "600",
   },
   filtersRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 14,
   },
   filterButton: {
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 999,
      backgroundColor: "#fff",
      borderWidth: 1,
      borderColor: "#e2e8f0",
   },
   activeFilterButton: {
      backgroundColor: "#2563eb",
      borderColor: "#2563eb",
   },
   filterText: {
      fontSize: 13,
      fontWeight: "700",
      color: "#475569",
   },
   activeFilterText: {
      color: "#fff",
   },
});
