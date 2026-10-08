import { useEffect, useMemo, useState } from "react";
import { loadTasks, saveTasks } from "../storage/taskStorage";
import { todayISO } from "../utils/dateUtils";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    async function initialize() {
      const initialTasks = await loadTasks();
      if (active) {
        setTasks(initialTasks);
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
    const completed = tasks.filter((task) => task.completed).length;
    const active = tasks.length - completed;
    const overdue = tasks.filter(
      (task) =>
        !task.completed && task.dueDate && task.dueDate < todayISO()
    ).length;
    const dueToday = tasks.filter(
      (task) => !task.completed && task.dueDate === todayISO()
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
    setTasks((current) => [
      ...current,
      {
        id: Date.now().toString(),
        ...task,
        title: task.title.trim(),
        subject: task.subject.trim(),
        completed: false,
      },
    ]);
  }

  function updateTask(id, updatedTask) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? {
              ...task,
              ...updatedTask,
              title: updatedTask.title.trim(),
              subject: updatedTask.subject.trim(),
            }
          : task
      )
    );
  }

  function toggleTask(id) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function deleteTask(id) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  function clearCompleted() {
    setTasks((current) => current.filter((task) => !task.completed));
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
