import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: {
    backgroundColor: "#111827",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#fff",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#cbd5e1",
  },
  headerActions: {
    alignItems: "flex-end",
    gap: 10,
  },
  expensesButton: {
    minHeight: 38,
    borderRadius: 14,
    marginBottom: 20,
    backgroundColor: "#16a34a",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  expensesText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "900",
  },
  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },
});
