import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
   image: {
      height: 220,
      marginBottom: 16,
   },
   imageRadius: {
      borderRadius: 24,
   },
   overlay: {
      flex: 1,
      justifyContent: "space-between",
      padding: 16,
      borderRadius: 24,
      backgroundColor: "rgba(15, 23, 42, 0.45)",
   },
   backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: "rgba(0,0,0,0.35)",
      alignItems: "center",
      justifyContent: "center",
   },
   roomTitle: {
      color: "#fff",
      fontSize: 26,
      fontWeight: "900",
   },
   roomSubtitle: {
      marginTop: 4,
      color: "#e2e8f0",
      fontSize: 15,
      fontWeight: "700",
   },
});
