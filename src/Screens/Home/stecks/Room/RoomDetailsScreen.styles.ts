import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
   safe: {
      flex: 1,
      backgroundColor: "#f8fafc",
   },
   content: {
      padding: 16,
      paddingBottom: 40,
   },
   center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
   },
   loadingText: {
      marginTop: 12,
      fontSize: 16,
      fontWeight: "800",
      color: "#0f172a",
   },
   notFoundText: {
      fontSize: 18,
      fontWeight: "800",
      color: "#ef4444",
   },
   modalOverlay: {
      flex: 1,
      justifyContent: "center",
      padding: 18,
      backgroundColor: "rgba(15, 23, 42, 0.55)",
   },
   finishModal: {
      backgroundColor: "#fff",
      borderRadius: 24,
      padding: 18,
   },
   modalTitle: {
      fontSize: 22,
      fontWeight: "900",
      color: "#0f172a",
      marginBottom: 8,
   },
   modalText: {
      fontSize: 14,
      fontWeight: "700",
      color: "#64748b",
      marginBottom: 14,
   },
   unpaidWarning: {
      fontSize: 14,
      fontWeight: "900",
      color: "#ef4444",
      marginBottom: 12,
   },
   inputBox: {
      height: 54,
      borderRadius: 16,
      backgroundColor: "#f8fafc",
      borderWidth: 1,
      borderColor: "#e2e8f0",
      paddingHorizontal: 14,
      marginBottom: 10,
      justifyContent: "center",
   },
   input: {
      fontSize: 15,
      fontWeight: "800",
      color: "#0f172a",
   },
   checkboxRow: {
      minHeight: 54,
      borderRadius: 16,
      backgroundColor: "#f8fafc",
      borderWidth: 1,
      borderColor: "#e2e8f0",
      paddingHorizontal: 14,
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
   },
   checkboxText: {
      fontSize: 15,
      fontWeight: "800",
      color: "#0f172a",
   },
   saveButton: {
      height: 54,
      borderRadius: 18,
      backgroundColor: "#16a34a",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
   },
   cancelButton: {
      height: 54,
      borderRadius: 18,
      backgroundColor: "#64748b",
      alignItems: "center",
      justifyContent: "center",
   },
   saveButtonText: {
      color: "#fff",
      fontSize: 15,
      fontWeight: "900",
   },
});
