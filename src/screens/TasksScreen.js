import React, { useMemo } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import TaskCard from "../components/TaskCard";
import { COLORS } from "../theme/colors";

export default function TasksScreen({
  tasks,
  filter,
  onFilterChange,
  onAdd,
  onToggle,
  onEdit,
  onDelete,
}) {
  const visibleTasks = useMemo(() => {
    let list = [...tasks];

    if (filter === "Active") list = list.filter((task) => !task.completed);
    if (filter === "Completed") list = list.filter((task) => task.completed);
    if (filter === "Overdue") {
      const today = new Date();
      const local = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
      );
      const todayISO = local.toISOString().slice(0, 10);
      list = list.filter(
        (task) =>
          !task.completed && task.dueDate && task.dueDate < todayISO
      );
    }

    return list.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return (a.dueDate || "9999-12-31").localeCompare(
        b.dueDate || "9999-12-31"
      );
    });
  }, [tasks, filter]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.taskToolbar}>
        <View>
          <Text style={styles.greeting}>My Assignments</Text>
          <Text style={styles.dashboardSub}>
            {visibleTasks.length} task(s)
          </Text>
        </View>
        <Pressable onPress={onAdd} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        {["All", "Active", "Completed", "Overdue"].map((item) => (
          <Pressable
            key={item}
            onPress={() => onFilterChange(item)}
            style={[styles.filter, filter === item && styles.filterActive]}
          >
            <Text
              style={[
                styles.filterText,
                filter === item && styles.filterTextActive,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <FlatList
        data={visibleTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <TaskCard
              task={item}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </View>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🎉</Text>
            <Text style={styles.emptyTitle}>No tasks here</Text>
            <Text style={styles.mutedText}>
              Add an assignment to start tracking.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  taskToolbar: {
    padding: 18,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: { fontSize: 24, fontWeight: "800", color: COLORS.text },
  dashboardSub: { color: COLORS.muted, marginTop: 4 },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 12,
  },
  addButtonText: { color: "white", fontWeight: "800" },
  filters: { paddingHorizontal: 18, paddingVertical: 8, gap: 8 },
  filter: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { color: COLORS.muted, fontWeight: "700", fontSize: 12 },
  filterTextActive: { color: "white" },
  list: { padding: 18, paddingTop: 6, paddingBottom: 110 },
  listItem: { marginBottom: 10 },
  empty: { alignItems: "center", paddingTop: 80 },
  emptyIcon: { fontSize: 45 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 10,
  },
  mutedText: { color: COLORS.muted, fontSize: 12, marginTop: 8 },
});
