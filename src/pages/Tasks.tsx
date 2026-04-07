import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";
import { useUsers } from "../hooks/useUsers";
import TaskList from "../components/TaskList";
import TaskFormModal from "../components/TaskFormModal";
import toast from "react-hot-toast";
import type { Task } from "../types/tasks";
import { Plus, RefreshCw } from "lucide-react";

export default function TasksPage() {
  const { userData } = useAuth();
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks(userData);
  const { users } = useUsers();
  const [createOpen, setCreateOpen] = useState(false);

  if (!userData) return null;

  const handleCreate = async (task: Omit<Task,"id">) => {
    try {
      await createTask(task);
      toast.success("Task created ✅");
      setCreateOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to create task");
    }
  };

  const handleUpdate = async (id: string, data: Partial<Task>) => {
    try {
      await updateTask(id, data);
      toast.success("Task updated");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update task");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      toast.success("Task deleted");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete task");
    }
  };

  const todoCount      = tasks.filter((t) => t.status === "todo").length;
  const inProgCount    = tasks.filter((t) => t.status === "in-progress").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const doneCount      = tasks.filter((t) => t.status === "done").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Tasks</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {userData.role === "admin" ? "Manage and assign tasks to team members." : "View and update your assigned tasks."}
          </p>
        </div>
        {userData.role === "admin" && (
          <button onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition flex-shrink-0">
            <Plus size={16} /> New Task
          </button>
        )}
      </div>

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "To Do",      count: todoCount,      color: "bg-gray-100  dark:bg-gray-700   text-gray-700  dark:text-gray-200" },
            { label: "In Progress",count: inProgCount,    color: "bg-blue-50   dark:bg-blue-900/20 text-blue-700  dark:text-blue-300" },
            { label: "Pending Review",count:completedCount,color:"bg-amber-50  dark:bg-amber-900/20 text-amber-700 dark:text-amber-300" },
            { label: "Done",       count: doneCount,      color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300" },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl px-4 py-3 ${s.color} flex items-center justify-between`}>
              <span className="text-[11px] font-semibold uppercase tracking-wide opacity-70">{s.label}</span>
              <span className="text-2xl font-bold">{s.count}</span>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
          <span>{error}</span>
          <button className="ml-auto hover:opacity-70" onClick={() => window.location.reload()}>
            <RefreshCw size={14} />
          </button>
        </div>
      )}

      <TaskList tasks={tasks} role={userData.role} loading={loading}
        adminUser={userData} users={users} onUpdate={handleUpdate} onDelete={handleDelete} />

      {userData.role === "admin" && (
        <TaskFormModal isOpen={createOpen} onClose={() => setCreateOpen(false)}
          onSubmit={handleCreate} adminUser={userData} users={users} />
      )}
    </div>
  );
}
