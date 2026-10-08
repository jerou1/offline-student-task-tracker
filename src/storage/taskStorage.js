import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEY, seedTasks } from "../data/seedTasks";

export async function loadTasks() {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : seedTasks;
  } catch {
    return seedTasks;
  }
}

export async function saveTasks(tasks) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.warn("Could not save tasks locally:", error);
  }
}
