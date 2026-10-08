import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEY, seedTasks } from "../data/seedTasks";

export async function loadTasks() {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return seedTasks;
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      console.warn("Saved task data is invalid. Using default tasks.");
      return seedTasks;
    }

    return parsed;
  } catch (error) {
    console.warn("Could not load tasks locally:", error);
    return seedTasks;
  }
}

export async function saveTasks(tasks) {
  try {
    if (!Array.isArray(tasks)) {
      console.warn("Invalid task data. Nothing was saved.");
      return;
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.warn("Could not save tasks locally:", error);
  }
}