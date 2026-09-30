import React, { useEffect, useMemo, useState } from "react";

import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@student_tracker_tasks_v1";

const COLORS = {
  bg: "#F6F8FC",
  card: "#FFFFFF",
  text: "#172033",
  muted: "#718096",
  primary: "#4F46E5",
  primarySoft: "#EEF2FF",
  green: "#16A34A",
  greenSoft: "#DCFCE7",
  orange: "#EA580C",
  orangeSoft: "#FFEDD5",
  red: "#DC2626",
  redSoft: "#FEE2E2",
  border: "#E6EAF0",
};

const seedTasks = [
  {
    id: "1",
    title: "React Native UI Prototype",
    subject: "Programming",
    dueDate: "2026-10-03",
    priority: "High",
    notes: "Finish the mobile tracker screens and test on Android.",
    completed: false,
  },
  {
    id: "2",
    title: "Logic Worksheet",
    subject: "Logic",
    dueDate: "2026-10-05",
    priority: "Medium",
    notes: "Answer all items and review before submission.",
    completed: false,
  },
  {
    id: "3",
    title: "Project Documentation",
    subject: "Documentation",
    dueDate: "2026-09-29",
    priority: "Low",
    notes: "README, screenshots, and setup instructions.",
    completed: true,
  },
];

function todayISO() {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function formatDate(value) {
  if (!value) return "No due date";
  const d = new Date(value + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function dueLabel(task) {
  if (task.completed) return "Completed";
  if (!task.dueDate) return "No due date";
  if (task.dueDate < todayISO()) return "Overdue";
  if (task.dueDate === todayISO()) return "Due today";
  return formatDate(task.dueDate);
}

function priorityStyle(priority) {
  if (priority === "High") return { bg: COLORS.redSoft, text: COLORS.red };
  if (priority === "Medium") return { bg: COLORS.orangeSoft, text: COLORS.orange };
  return { bg: COLORS.greenSoft, text: COLORS.green };
}

function StatCard({ label, value, icon }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const p = priorityStyle(task.priority);
  return (
    <View style={[styles.taskCard, task.completed && styles.taskCompleted]}>
      <Pressable onPress={() => onToggle(task)} style={styles.checkButton}>
        <View style={[styles.checkbox, task.completed && styles.checkboxDone]}>
          {task.completed ? <Text style={styles.checkMark}>✓</Text> : null}
        </View>
      </Pressable>

      <View style={{ flex: 1 }}>
        <Text style={[styles.taskTitle, task.completed && styles.strike]}>
          {task.title}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.subject}>{task.subject || "General"}</Text>
          <View style={[styles.priorityPill, { backgroundColor: p.bg }]}>
            <Text style={[styles.priorityText, { color: p.text }]}>
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
              Alert.alert("Delete task?", "This task will be removed from your phone.", [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => onDelete(task.id) },
              ])
            }
            style={[styles.smallButton, styles.deleteButton]}
          >
            <Text style={[styles.smallButtonText, { color: COLORS.red }]}>Delete</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("Tasks");
  const [filter, setFilter] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    subject: "",
    dueDate: "",
    priority: "Medium",
    notes: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        setTasks(saved ? JSON.parse(saved) : seedTasks);
      } catch {
        setTasks(seedTasks);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, loaded]);

  const stats = useMemo(() => {
    const completed = tasks.filter((t) => t.completed).length;
    const active = tasks.length - completed;
    const overdue = tasks.filter((t) => !t.completed && t.dueDate && t.dueDate < todayISO()).length;
    const dueToday = tasks.filter((t) => !t.completed && t.dueDate === todayISO()).length;
    return { total: tasks.length, completed, active, overdue, dueToday };
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    let list = [...tasks];
    if (filter === "Active") list = list.filter((t) => !t.completed);
    if (filter === "Completed") list = list.filter((t) => t.completed);
    if (filter === "Overdue") list = list.filter((t) => !t.completed && t.dueDate && t.dueDate < todayISO());
    return list.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return (a.dueDate || "9999-12-31").localeCompare(b.dueDate || "9999-12-31");
    });
  }, [tasks, filter]);

  function openAdd() {
    setEditing(null);
    setForm({
      title: "",
      subject: "",
      dueDate: todayISO(),
      priority: "Medium",
      notes: "",
    });
    setModalVisible(true);
  }

  function openEdit(task) {
    setEditing(task);
    setForm({
      title: task.title,
      subject: task.subject || "",
      dueDate: task.dueDate || "",
      priority: task.priority || "Medium",
      notes: task.notes || "",
    });
    setModalVisible(true);
  }

  function saveTask() {
    if (!form.title.trim()) {
      Alert.alert("Missing title", "Please enter the assignment/task name.");
      return;
    }

    if (editing) {
      setTasks((current) =>
        current.map((t) =>
          t.id === editing.id
            ? { ...t, ...form, title: form.title.trim(), subject: form.subject.trim() }
            : t
        )
      );
    } else {
      setTasks((current) => [
        ...current,
        {
          id: Date.now().toString(),
          ...form,
          title: form.title.trim(),
          subject: form.subject.trim(),
          completed: false,
        },
      ]);
    }

    setModalVisible(false);
  }

  function toggleTask(task) {
    setTasks((current) =>
      current.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t))
    );
  }

  function deleteTask(id) {
    setTasks((current) => current.filter((t) => t.id !== id));
  }

  function clearCompleted() {
    if (!stats.completed) return;
    Alert.alert("Clear completed?", "Completed tasks will be removed.", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: () => setTasks((c) => c.filter((t) => !t.completed)) },
    ]);
  }

  if (!loaded) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.loading}>Loading your tasks...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.appTitle}>Student Task Tracker</Text>
          <Text style={styles.subtitle}>Offline • Your data stays on this phone</Text>
        </View>
        <View style={styles.offlineBadge}>
          <View style={styles.greenDot} />
          <Text style={styles.offlineText}>OFFLINE</Text>
        </View>
      </View>

      {tab === "Home" ? (
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.greeting}>My Study Dashboard</Text>
          <Text style={styles.dashboardSub}>Keep your assignments organized and on time.</Text>

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
                {stats.total ? Math.round((stats.completed / stats.total) * 100) : 0}%
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${stats.total ? Math.round((stats.completed / stats.total) * 100) : 0}%`,
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
            <Pressable onPress={() => setTab("Tasks")}>
              <Text style={styles.link}>View all</Text>
            </Pressable>
          </View>

          {tasks
            .filter((t) => !t.completed)
            .slice()
            .sort((a, b) => (a.dueDate || "9999").localeCompare(b.dueDate || "9999"))
            .slice(0, 3)
            .map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onEdit={openEdit}
                onDelete={deleteTask}
              />
            ))}

          {stats.completed > 0 && (
            <Pressable onPress={clearCompleted} style={styles.clearCompleted}>
              <Text style={styles.clearText}>Clear completed tasks</Text>
            </Pressable>
          )}
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.taskToolbar}>
            <View>
              <Text style={styles.greeting}>My Assignments</Text>
              <Text style={styles.dashboardSub}>{visibleTasks.length} task(s)</Text>
            </View>
            <Pressable onPress={openAdd} style={styles.addButton}>
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
                onPress={() => setFilter(item)}
                style={[styles.filter, filter === item && styles.filterActive]}
              >
                <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>
                  {item}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <FlatList
            data={visibleTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TaskCard
                task={item}
                onToggle={toggleTask}
                onEdit={openEdit}
                onDelete={deleteTask}
              />
            )}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>🎉</Text>
                <Text style={styles.emptyTitle}>No tasks here</Text>
                <Text style={styles.mutedText}>Add an assignment to start tracking.</Text>
              </View>
            }
          />
        </View>
      )}

      <View style={styles.bottomNav}>
        <Pressable onPress={() => setTab("Home")} style={styles.navItem}>
          <Text style={[styles.navIcon, tab === "Home" && styles.navActive]}>⌂</Text>
          <Text style={[styles.navLabel, tab === "Home" && styles.navActive]}>Home</Text>
        </Pressable>
        <Pressable onPress={() => setTab("Tasks")} style={styles.navItem}>
          <Text style={[styles.navIcon, tab === "Tasks" && styles.navActive]}>☑</Text>
          <Text style={[styles.navLabel, tab === "Tasks" && styles.navActive]}>Tasks</Text>
        </Pressable>
        <Pressable onPress={openAdd} style={styles.fab}>
          <Text style={styles.fabText}>+</Text>
        </Pressable>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.modal}>
            <View style={styles.rowBetween}>
              <Text style={styles.modalTitle}>{editing ? "Edit Task" : "New Assignment"}</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={styles.close}>✕</Text>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Task title *</Text>
              <TextInput
                value={form.title}
                onChangeText={(v) => setForm({ ...form, title: v })}
                placeholder="e.g. Programming Project"
                placeholderTextColor="#A0AEC0"
                style={styles.input}
              />

              <Text style={styles.inputLabel}>Subject</Text>
              <TextInput
                value={form.subject}
                onChangeText={(v) => setForm({ ...form, subject: v })}
                placeholder="e.g. BSIT 4E - Logic"
                placeholderTextColor="#A0AEC0"
                style={styles.input}
              />

              <Text style={styles.inputLabel}>Due date</Text>
              <TextInput
                value={form.dueDate}
                onChangeText={(v) => setForm({ ...form, dueDate: v })}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#A0AEC0"
                style={styles.input}
                autoCapitalize="none"
              />
              <Text style={styles.helper}>Use YYYY-MM-DD, e.g. 2026-10-10</Text>

              <Text style={styles.inputLabel}>Priority</Text>
              <View style={styles.priorityChoices}>
                {["Low", "Medium", "High"].map((p) => (
                  <Pressable
                    key={p}
                    onPress={() => setForm({ ...form, priority: p })}
                    style={[
                      styles.priorityChoice,
                      form.priority === p && styles.priorityChoiceActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.priorityChoiceText,
                        form.priority === p && styles.priorityChoiceTextActive,
                      ]}
                    >
                      {p}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.inputLabel}>Notes</Text>
              <TextInput
                value={form.notes}
                onChangeText={(v) => setForm({ ...form, notes: v })}
                placeholder="Instructions, reminders, group members..."
                placeholderTextColor="#A0AEC0"
                style={[styles.input, styles.notesInput]}
                multiline
                textAlignVertical="top"
              />

              <Pressable onPress={saveTask} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>
                  {editing ? "Save Changes" : "Add Assignment"}
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.bg },
  loading: { color: COLORS.muted, fontSize: 16 },
  header: {
    paddingHorizontal: 18,
    paddingTop: Platform.OS === "android" ? 12 : 6,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  appTitle: { fontSize: 20, fontWeight: "800", color: COLORS.text },
  subtitle: { marginTop: 3, fontSize: 12, color: COLORS.muted },
  offlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.greenSoft,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 20,
  },
  greenDot: { width: 7, height: 7, borderRadius: 5, backgroundColor: COLORS.green },
  offlineText: { fontSize: 10, fontWeight: "800", color: COLORS.green },
  scroll: { padding: 18, paddingBottom: 110 },
  greeting: { fontSize: 24, fontWeight: "800", color: COLORS.text },
  dashboardSub: { color: COLORS.muted, marginTop: 4, marginBottom: 16 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  statCard: {
    width: "48%",
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
  progressCard: {
    marginTop: 14,
    padding: 16,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: COLORS.text },
  percent: { fontWeight: "800", color: COLORS.primary },
  progressTrack: {
    height: 9,
    borderRadius: 10,
    backgroundColor: "#E8ECF4",
    overflow: "hidden",
    marginTop: 12,
  },
  progressFill: { height: "100%", backgroundColor: COLORS.primary, borderRadius: 10 },
  mutedText: { color: COLORS.muted, fontSize: 12, marginTop: 8 },
  sectionHeader: { marginTop: 24, marginBottom: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  link: { color: COLORS.primary, fontWeight: "700" },
  taskToolbar: {
    padding: 18,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addButton: { backgroundColor: COLORS.primary, paddingHorizontal: 15, paddingVertical: 11, borderRadius: 12 },
  addButtonText: { color: "white", fontWeight: "800" },
  filters: { paddingHorizontal: 18, paddingVertical: 8, gap: 8 },
  filter: { paddingHorizontal: 15, paddingVertical: 9, borderRadius: 20, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border },
  filterActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { color: COLORS.muted, fontWeight: "700", fontSize: 12 },
  filterTextActive: { color: "white" },
  list: { padding: 18, paddingTop: 6, paddingBottom: 110, gap: 10 },
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
  checkbox: { width: 24, height: 24, borderRadius: 8, borderWidth: 2, borderColor: "#CBD5E1", alignItems: "center", justifyContent: "center" },
  checkboxDone: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  checkMark: { color: "white", fontWeight: "900" },
  taskTitle: { fontSize: 16, fontWeight: "800", color: COLORS.text, marginBottom: 7 },
  strike: { textDecorationLine: "line-through" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  subject: { color: COLORS.primary, fontWeight: "700", fontSize: 12 },
  priorityPill: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4 },
  priorityText: { fontSize: 10, fontWeight: "800" },
  dueText: { marginTop: 7, color: COLORS.muted, fontSize: 12 },
  notes: { color: COLORS.muted, fontSize: 12, marginTop: 7, lineHeight: 17 },
  actions: { flexDirection: "row", gap: 8, marginTop: 10 },
  smallButton: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: COLORS.primarySoft },
  smallButtonText: { color: COLORS.primary, fontSize: 11, fontWeight: "800" },
  deleteButton: { backgroundColor: COLORS.redSoft },
  clearCompleted: { marginTop: 12, padding: 14, alignItems: "center" },
  clearText: { color: COLORS.red, fontWeight: "700" },
  empty: { alignItems: "center", paddingTop: 80 },
  emptyIcon: { fontSize: 45 },
  emptyTitle: { fontSize: 18, fontWeight: "800", color: COLORS.text, marginTop: 10 },
  bottomNav: {
    position: "absolute",
    left: 0, right: 0, bottom: 0,
    height: 76,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: Platform.OS === "ios" ? 12 : 4,
  },
  navItem: { alignItems: "center", minWidth: 70 },
  navIcon: { fontSize: 23, color: COLORS.muted },
  navLabel: { fontSize: 11, fontWeight: "700", color: COLORS.muted, marginTop: 2 },
  navActive: { color: COLORS.primary },
  fab: {
    position: "absolute",
    top: -25,
    left: "50%",
    marginLeft: -28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: COLORS.bg,
  },
  fabText: { color: "white", fontSize: 28, fontWeight: "400", marginTop: -2 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(15,23,42,0.45)", justifyContent: "flex-end" },
  modal: {
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "92%",
    padding: 20,
  },
  modalTitle: { fontSize: 21, fontWeight: "800", color: COLORS.text },
  close: { fontSize: 20, color: COLORS.muted, padding: 5 },
  inputLabel: { marginTop: 16, marginBottom: 7, fontSize: 12, fontWeight: "800", color: COLORS.text },
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
  priorityChoice: { flex: 1, paddingVertical: 11, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.card, alignItems: "center" },
  priorityChoiceActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  priorityChoiceText: { fontWeight: "700", color: COLORS.muted },
  priorityChoiceTextActive: { color: "white" },
  notesInput: { minHeight: 90 },
  saveButton: { backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: 12, alignItems: "center", marginTop: 22, marginBottom: 20 },
  saveButtonText: { color: "white", fontWeight: "800", fontSize: 15 },
});


export default function Root() {
  return (
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  );
}
