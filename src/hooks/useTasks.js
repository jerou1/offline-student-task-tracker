import { useEffect, useMemo, useState } from "react";
import { loadTasks, saveTasks } from "../storage/taskStorage";
import { todayISO } from "../utils/dateUtils";

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function createTaskId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    async function initialize() {
      const initialTasks = await loadTasks();

      if (active) {
        setTasks(Array.isArray(initialTasks) ? initialTasks : []);
        setLoaded(true);
      }
    }

    initialize();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (loaded) {
      saveTasks(tasks);
    }
  }, [tasks, loaded]);

  const stats = useMemo(() => {
    const today = todayISO();

    const completed = tasks.filter((task) => task.completed).length;
    const active = tasks.length - completed;

    const overdue = tasks.filter(
      (task) =>
        !task.completed &&
        task.dueDate &&
        task.dueDate < today
    ).length;

    const dueToday = tasks.filter(
      (task) =>
        !task.completed &&
        task.dueDate === today
    ).length;

    return {
      total: tasks.length,
      completed,
      active,
      overdue,
      dueToday,
    };
  }, [tasks]);

  function addTask(task) {
    const newTask = {
      id: createTaskId(),
      ...task,
      title: normalizeText(task.title),
      subject: normalizeText(task.subject),
      notes: normalizeText(task.notes),
      completed: false,
    };

    setTasks((current) => [...current, newTask]);
  }

  function updateTask(id, updatedTask) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? {
              ...task,
              ...updatedTask,
              title: normalizeText(updatedTask.title),
              subject: normalizeText(updatedTask.subject),
              notes: normalizeText(updatedTask.notes),
            }
          : task
      )
    );
  }

  function toggleTask(id) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );
  }

  function deleteTask(id) {
    setTasks((current) =>
      current.filter((task) => task.id !== id)
    );
  }

  function clearCompleted() {
    setTasks((current) =>
      current.filter((task) => !task.completed)
    );
  }

  return {
    tasks,
    loaded,
    stats,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    clearCompleted,
  };
}