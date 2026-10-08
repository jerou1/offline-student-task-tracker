import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../theme/colors";
import TaskCard from "../components/TaskCard";
import StatCard from "../components/StatCard";

export default function HomeScreen({
  tasks,
  stats,
  onToggle,
  onEdit,
  onDelete,
  onViewAll,
  onClearCompleted,
}) {
  const upcomingTasks = tasks
    .filter((task) => !task.completed)
    .slice()
    .sort((a, b) =>
      (a.dueDate || "9999").localeCompare(b.dueDate || "9999")
    )
    .slice(0, 3);

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.greeting}>My Study Dashboard</Text>
      <Text style={styles.dashboardSub}>
        Keep your assignments organized and on time.
      </Text>

      <View style={styles.statsGrid}>
        <StatCard label="Total Tasks" value={stats.total} icon="📚" />
        <StatCard label="Active" value={stats.active} icon="📝" />
        <StatCard label="Completed" value={stats.completed} icon="✓" />
        <StatCard label="Overdue" value={stats.overdue} icon="⚠️" />
      </View>

      <View style={styles.progressCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Progress</Text>
          <Text style={styles.percent}>
            {stats.total
              ? Math.round((stats.completed / stats.total) * 100)
              : 0}
            %
          </Text>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${
                  stats.total
                    ? Math.round((stats.completed / stats.total) * 100)
                    : 0
                }%`,
              },
            ]}
          />
        </View>
        <Text style={styles.mutedText}>
          {stats.completed} of {stats.total} tasks completed
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Upcoming</Text>
        <Pressable onPress={onViewAll}>
          <Text style={styles.link}>View all</Text>
        </Pressable>
      </View>

      {upcomingTasks.map((task) => (
        <View key={task.id} style={styles.taskGap}>
          <TaskCard
            task={task}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </View>
      ))}

      {stats.completed > 0 && (
        <Pressable onPress={onClearCompleted} style={styles.clearCompleted}>
          <Text style={styles.clearText}>Clear completed tasks</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 18, paddingBottom: 110 },
  greeting: { fontSize: 24, fontWeight: "800", color: COLORS.text },
  dashboardSub: { color: COLORS.muted, marginTop: 4, marginBottom: 16 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  progressCard: {
    marginTop: 14,
    padding: 16,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: COLORS.text },
  percent: { fontWeight: "800", color: COLORS.primary },
  progressTrack: {
    height: 9,
    borderRadius: 10,
    backgroundColor: "#E8ECF4",
    overflow: "hidden",
    marginTop: 12,
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  mutedText: { color: COLORS.muted, fontSize: 12, marginTop: 8 },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  link: { color: COLORS.primary, fontWeight: "700" },
  taskGap: { marginBottom: 10 },
  clearCompleted: { marginTop: 12, padding: 14, alignItems: "center" },
  clearText: { color: COLORS.red, fontWeight: "700" },
});
