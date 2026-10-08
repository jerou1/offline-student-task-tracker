import React, { useState } from "react";
import { Platform, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "./src/theme/colors";
import { useTasks } from "./src/hooks/useTasks";
import HomeScreen from "./src/screens/HomeScreen";
import TasksScreen from "./src/screens/TasksScreen";
import TaskFormModal from "./src/components/TaskFormModal";

function AppContent() {
  const {
    tasks,
    loaded,
    stats,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    clearCompleted,
  } = useTasks();

  const [tab, setTab] = useState("Tasks");
  const [filter, setFilter] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  function openAdd() {
    setEditingTask(null);
    setModalVisible(true);
  }

  function openEdit(task) {
    setEditingTask(task);
    setModalVisible(true);
  }

  function handleSave(taskData) {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }

    setModalVisible(false);
    setEditingTask(null);
  }

  function closeModal() {
    setModalVisible(false);
    setEditingTask(null);
  }

  if (!loaded) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.loading}>Loading your tasks...</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View>
          <Text style={styles.appTitle}>Student Task Tracker</Text>
          <Text style={styles.subtitle}>
            Offline • Your data stays on this phone
          </Text>
        </View>
        <View style={styles.offlineBadge}>
          <View style={styles.greenDot} />
          <Text style={styles.offlineText}>OFFLINE</Text>
        </View>
      </View>

      {tab === "Home" ? (
        <HomeScreen
          tasks={tasks}
          stats={stats}
          onToggle={(task) => toggleTask(task.id)}
          onEdit={openEdit}
          onDelete={deleteTask}
          onViewAll={() => setTab("Tasks")}
          onClearCompleted={clearCompleted}
        />
      ) : (
        <TasksScreen
          tasks={tasks}
          filter={filter}
          onFilterChange={setFilter}
          onAdd={openAdd}
          onToggle={(task) => toggleTask(task.id)}
          onEdit={openEdit}
          onDelete={deleteTask}
        />
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

      <TaskFormModal
        visible={modalVisible}
        editingTask={editingTask}
        onClose={closeModal}
        onSave={handleSave}
      />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <AppContent />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.bg,
  },
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
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
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
});
