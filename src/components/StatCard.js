import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../theme/colors";

export default function StatCard({ label, value, icon }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statCard: {
    width: "47%",
    minHeight: 118,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    justifyContent: "center",
  },
  statIcon: { fontSize: 22, marginBottom: 8 },
  statValue: { fontSize: 27, fontWeight: "800", color: COLORS.text },
  statLabel: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
});
