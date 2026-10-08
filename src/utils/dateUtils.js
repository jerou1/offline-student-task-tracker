export function todayISO() {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export function formatDate(value) {
  if (!value) return "No due date";

  const d = new Date(value + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function dueLabel(task) {
  if (task.completed) return "Completed";
  if (!task.dueDate) return "No due date";
  if (task.dueDate < todayISO()) return "Overdue";
  if (task.dueDate === todayISO()) return "Due today";
  return formatDate(task.dueDate);
}

export function priorityStyle(priority, colors) {
  if (priority === "High") {
    return { bg: colors.redSoft, text: colors.red };
  }

  if (priority === "Medium") {
    return { bg: colors.orangeSoft, text: colors.orange };
  }

  return { bg: colors.greenSoft, text: colors.green };
}
