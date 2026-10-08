import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { COLORS } from "../theme/colors";
import { todayISO } from "../utils/dateUtils";

const EMPTY_FORM = {
  title: "",
  subject: "",
  dueDate: todayISO(),
  priority: "Medium",
  notes: "",
};

export default function TaskFormModal({
  visible,
  editingTask,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (!visible) return;

    if (editingTask) {
      setForm({
        title: editingTask.title,
        subject: editingTask.subject || "",
        dueDate: editingTask.dueDate || "",
        priority: editingTask.priority || "Medium",
        notes: editingTask.notes || "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [visible, editingTask]);

  function handleSave() {
    if (!form.title.trim()) {
      Alert.alert("Missing title", "Please enter the assignment/task name.");
      return;
    }

    onSave({
      ...form,
      title: form.title.trim(),
      subject: form.subject.trim(),
    });
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.modal}>
          <View style={styles.rowBetween}>
            <Text style={styles.modalTitle}>
              {editingTask ? "Edit Task" : "New Assignment"}
            </Text>
            <Pressable onPress={onClose}>
              <Text style={styles.close}>✕</Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.inputLabel}>Task title *</Text>
            <TextInput
              value={form.title}
              onChangeText={(value) => setForm({ ...form, title: value })}
              placeholder="e.g. Programming Project"
              placeholderTextColor="#A0AEC0"
              style={styles.input}
            />

            <Text style={styles.inputLabel}>Subject</Text>
            <TextInput
              value={form.subject}
              onChangeText={(value) => setForm({ ...form, subject: value })}
              placeholder="e.g. BSIT 4E - Logic"
              placeholderTextColor="#A0AEC0"
              style={styles.input}
            />

            <Text style={styles.inputLabel}>Due date</Text>
            <TextInput
              value={form.dueDate}
              onChangeText={(value) => setForm({ ...form, dueDate: value })}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#A0AEC0"
              style={styles.input}
              autoCapitalize="none"
            />
            <Text style={styles.helper}>
              Use YYYY-MM-DD, e.g. 2026-10-10
            </Text>

            <Text style={styles.inputLabel}>Priority</Text>
            <View style={styles.priorityChoices}>
              {["Low", "Medium", "High"].map((priority) => (
                <Pressable
                  key={priority}
                  onPress={() => setForm({ ...form, priority })}
                  style={[
                    styles.priorityChoice,
                    form.priority === priority && styles.priorityChoiceActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.priorityChoiceText,
                      form.priority === priority &&
                        styles.priorityChoiceTextActive,
                    ]}
                  >
                    {priority}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.inputLabel}>Notes</Text>
            <TextInput
              value={form.notes}
              onChangeText={(value) => setForm({ ...form, notes: value })}
              placeholder="Instructions, reminders, group members..."
              placeholderTextColor="#A0AEC0"
              style={[styles.input, styles.notesInput]}
              multiline
              textAlignVertical="top"
            />

            <Pressable onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>
                {editingTask ? "Save Changes" : "Add Assignment"}
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.45)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "92%",
    padding: 20,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: { fontSize: 21, fontWeight: "800", color: COLORS.text },
  close: { fontSize: 20, color: COLORS.muted, padding: 5 },
  inputLabel: {
    marginTop: 16,
    marginBottom: 7,
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.text,
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 12,
    color: COLORS.text,
    fontSize: 14,
  },
  helper: { color: COLORS.muted, fontSize: 10, marginTop: 5 },
  priorityChoices: { flexDirection: "row", gap: 8 },
  priorityChoice: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    alignItems: "center",
  },
  priorityChoiceActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  priorityChoiceText: { fontWeight: "700", color: COLORS.muted },
  priorityChoiceTextActive: { color: "white" },
  notesInput: { minHeight: 90 },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 22,
    marginBottom: 20,
  },
  saveButtonText: { color: "white", fontWeight: "800", fontSize: 15 },
});
