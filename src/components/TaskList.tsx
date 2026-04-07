import { useState } from "react";
import TaskCard from "./TaskCard";
import type { Task } from "../types/tasks";
import type { Role, UserData } from "../types/auth";
import { ClipboardList, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 6;

interface TaskListProps {
  tasks: Task[]; role: Role; loading: boolean;
  adminUser?: UserData; users?: UserData[];
  onUpdate: (id: string, data: Partial<Task>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function TaskList({ tasks, role, loading, adminUser, users = [], onUpdate, onDelete }: TaskListProps) {
  const [page, setPage] = useState(1);

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1,2,3].map((n) => (
          <div key={n} className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5 space-y-3 animate-pulse">
            <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mt-4" />
            <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-full" />
            <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-5/6" />
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400 dark:text-gray-500">
        <ClipboardList size={44} className="mb-4 opacity-30" />
        <p className="font-medium text-sm">
          {role === "admin" ? "No tasks yet. Create one above." : "No tasks assigned to you yet."}
        </p>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(tasks.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = tasks.slice((safePage-1)*PAGE_SIZE, safePage*PAGE_SIZE);

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginated.map((task) => (
          <TaskCard key={task.id} task={task} role={role} adminUser={adminUser} users={users} onUpdate={onUpdate} onDelete={onDelete} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 text-sm">
          <span className="text-gray-400 text-xs">
            Showing {((safePage-1)*PAGE_SIZE)+1}–{Math.min(safePage*PAGE_SIZE, tasks.length)} of {tasks.length} tasks
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1,p-1))} disabled={safePage===1}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 transition">
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: totalPages }, (_,i) => i+1).map((n) => (
              <button key={n} onClick={() => setPage(n)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${n===safePage?"bg-indigo-600 text-white":"border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
                {n}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages,p+1))} disabled={safePage===totalPages}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 transition">
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
