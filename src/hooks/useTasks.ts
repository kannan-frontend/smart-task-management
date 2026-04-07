import { useEffect, useState, useCallback } from "react";
import { taskService } from "../services/taskService";
import type { Task } from "../types/tasks";
import type { UserData } from "../types/auth";

export const useTasks = (userData: UserData | null) => {
  const [tasks,   setTasks]   = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    if (!userData) { setLoading(false); return; }
    setLoading(true); setError(null);
    try {
      const data = userData.role === "admin"
        ? await taskService.getAll()
        : await taskService.getByUser(userData.email);
      setTasks(data);
    } catch (err) {
      setError("Failed to load tasks.");
      console.error("loadTasks error:", err);
    } finally { setLoading(false); }
  }, [userData]);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  const createTask = async (task: Omit<Task, "id">) => {
    if (!userData) throw new Error("Not authenticated");
    if (userData.role !== "admin") throw new Error("Unauthorized");
    try {
      await taskService.create({ ...task, createdAt: Date.now() });
      await loadTasks();
    } catch (err) { console.error("createTask:", err); throw err; }
  };

  const updateTask = async (id: string, data: Partial<Task>) => {
    if (!userData) return;
    try {
      if (userData.role === "user") {
        // Users can update: status, startDate, endDate, remarks
        const allowed: Partial<Task> = {};
        if (data.status    !== undefined) allowed.status    = data.status;
        if (data.startDate !== undefined) allowed.startDate = data.startDate;
        if (data.endDate   !== undefined) allowed.endDate   = data.endDate;
        if (data.remarks   !== undefined) allowed.remarks   = data.remarks;
        if (Object.keys(allowed).length === 0) return;
        await taskService.update(id, allowed);
      } else {
        await taskService.update(id, data);
      }
      await loadTasks();
    } catch (err) { console.error("updateTask:", err); throw err; }
  };

  const deleteTask = async (id: string) => {
    if (!userData || userData.role !== "admin") return;
    try {
      await taskService.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) { console.error("deleteTask:", err); throw err; }
  };

  return { tasks, loading, error, createTask, updateTask, deleteTask, refresh: loadTasks };
};
