import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../theme/colors";
import { dueLabel, priorityStyle } from "../utils/dateUtils";

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const priority = priorityStyle(task.priority, COLORS);

  return (
    <View style={[styles.taskCard, task.completed && styles.taskCompleted]}>
      <Pressable onPress={() => onToggle(task)} style={styles.checkButton}>
        <View
          style={[styles.checkbox, task.completed && styles.checkboxDone]}
        >
          {task.completed ? <Text style={styles.checkMark}>✓</Text> : null}
        </View>
      </Pressable>

      <View style={{ flex: 1 }}>
        <Text style={[styles.taskTitle, task.completed && styles.strike]}>
          {task.title}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.subject}>{task.subject || "General"}</Text>
          <View
            style={[styles.priorityPill, { backgroundColor: priority.bg }]}
          >
            <Text style={[styles.priorityText, { color: priority.text }]}>
              {task.priority}
            </Text>
          </View>
        </View>

        <Text
          style={[
            styles.dueText,
            dueLabel(task) === "Overdue" && { color: COLORS.red },
          ]}
        >
          📅 {dueLabel(task)}
        </Text>

        {task.notes ? (
          <Text style={styles.notes} numberOfLines={2}>
            {task.notes}
          </Text>
        ) : null}

        <View style={styles.actions}>
          <Pressable onPress={() => onEdit(task)} style={styles.smallButton}>
            <Text style={styles.smallButtonText}>Edit</Text>
          </Pressable>
          <Pressable
            onPress={() =>
              Alert.alert(
                "Delete task?",
                "This task will be removed from your phone.",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => onDelete(task.id),
                  },
                ]
              )
            }
            style={[styles.smallButton, styles.deleteButton]}
          >
            <Text style={[styles.smallButtonText, { color: COLORS.red }]}>
              Delete
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  taskCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    flexDirection: "row",
    gap: 11,
  },
  taskCompleted: { opacity: 0.72 },
  checkButton: { paddingTop: 2 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxDone: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  checkMark: { color: "white", fontWeight: "900" },
  taskTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 7,
  },
  strike: { textDecorationLine: "line-through" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  subject: { color: COLORS.primary, fontWeight: "700", fontSize: 12 },
  priorityPill: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4 },
  priorityText: { fontSize: 10, fontWeight: "800" },
  dueText: { marginTop: 7, color: COLORS.muted, fontSize: 12 },
  notes: { color: COLORS.muted, fontSize: 12, marginTop: 7, lineHeight: 17 },
  actions: { flexDirection: "row", gap: 8, marginTop: 10 },
  smallButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.primarySoft,
  },
  smallButtonText: { color: COLORS.primary, fontSize: 11, fontWeight: "800" },
  deleteButton: { backgroundColor: COLORS.redSoft },
});
