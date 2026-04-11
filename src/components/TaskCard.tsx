/**
 * TaskCard
 * Displays a single task in a card layout.
 * Supports Admin actions (edit, delete, verify) and User actions (update progress).
 * Both roles can open a read-only TaskDetailModal via "View Details" button.
 */
import { useState } from "react";
import type { Task } from "../types/tasks";
import type { Role, UserData } from "../types/auth";
import {
  Pencil, Trash2, Calendar, User, Flag,
  CheckCheck, ClipboardEdit, Eye,
} from "lucide-react";
import TaskFormModal from "./TaskFormModal";
import UserTaskModal from "./UserTaskModal";
import TaskDetailModal from "./TaskDetailModal";

interface TaskCardProps {
  task:       Task;
  role:       Role;
  adminUser?: UserData;
  users?:     UserData[];
  onUpdate:   (id: string, data: Partial<Task>) => Promise<void>;
  onDelete:   (id: string) => Promise<void>;
}

// ── Style maps ────────────────────────────────────────────────────────────────
const PRIORITY_BAR: Record<Task["priority"], string> = {
  low: "bg-emerald-400", medium: "bg-amber-400", high: "bg-red-500",
};

const PRIORITY_BADGE: Record<Task["priority"], string> = {
  low:    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  medium: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  high:   "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
};

const STATUS_BADGE: Record<Task["status"], string> = {
  todo:          "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  "in-progress": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  completed:     "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  done:          "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
};

const STATUS_LABEL: Record<Task["status"], string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  completed: "⏳ Pending Review",
  done: "✅ Done",
};

const plainText = (html: string) =>
  html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

// ── Component ─────────────────────────────────────────────────────────────────
export default function TaskCard({
  task, role, adminUser, users = [], onUpdate, onDelete,
}: TaskCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editOpen,      setEditOpen]      = useState(false);
  const [userEditOpen,  setUserEditOpen]  = useState(false);
  const [detailOpen,    setDetailOpen]    = useState(false); // FIX #3

  const assignedUser   = users.find((u) => u.email === task.assignedTo);
  const assignedByUser = users.find((u) => u.email === task.assignedBy);
  const descPreview    = task.description?.includes("<")
    ? plainText(task.description)
    : task.description;

  const isAdmin = role?.toLowerCase() === "admin";
  const isUser  = role?.toLowerCase() === "user";

  return (
    <>
      <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden">
        {/* Priority stripe */}
        <div className={`h-1 w-full ${PRIORITY_BAR[task.priority]}`} />

        <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
          {/* Title + Priority badge */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-800 dark:text-white text-sm leading-snug flex-1">
              {task.title}
            </h3>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide border flex-shrink-0 ${PRIORITY_BADGE[task.priority]}`}>
              {task.priority}
            </span>
          </div>

          {/* Description preview */}
          {descPreview && (
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
              {descPreview}
            </p>
          )}

          {/* Status badge */}
          <span className={`self-start text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide ${STATUS_BADGE[task.status]}`}>
            {STATUS_LABEL[task.status]}
          </span>

          {/* Meta info */}
          <div className="text-[11px] text-gray-400 dark:text-gray-500 space-y-1.5 border-t border-gray-50 dark:border-gray-700/50 pt-2">
            <div className="flex items-center gap-1.5">
              <User size={10} />
              <span>To: <span className="font-medium text-gray-600 dark:text-gray-300">{assignedUser?.name ?? task.assignedTo}</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Flag size={10} />
              <span>By: <span className="font-medium text-gray-600 dark:text-gray-300">{assignedByUser?.name ?? task.assignedBy}</span></span>
            </div>
            {(task.startDate || task.endDate) && (
              <div className="flex items-center gap-1.5">
                <Calendar size={10} />
                <span>
                  {task.startDate}
                  {task.startDate && task.endDate && " → "}
                  {task.endDate}
                </span>
              </div>
            )}
            {task.remarks && (
              <div className="mt-1 px-2.5 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg italic text-gray-500 dark:text-gray-400 truncate">
                "{task.remarks}"
              </div>
            )}
          </div>

          {/* ── FIX #3: View Details button (both roles) ── */}
          <button
            onClick={() => setDetailOpen(true)}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold bg-gray-50 dark:bg-gray-700/40 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl transition border border-gray-100 dark:border-gray-700"
          >
            <Eye size={12} /> View Details
          </button>

          {/* ── USER actions ── */}
          {isUser && (
            <div className="border-t border-gray-100 dark:border-gray-700 pt-2">
              <button
                onClick={() => setUserEditOpen(true)}
                disabled={task.status === "done"}
                className={`w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-xl transition ${
                  task.status === "done"
                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 cursor-default"
                    : "bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 cursor-pointer"
                }`}
              >
                <ClipboardEdit size={13} />
                {task.status === "done" ? "Task Verified & Done" : "Update Progress"}
              </button>
            </div>
          )}

          {/* ── ADMIN actions ── */}
          {isAdmin && (
            <div className="border-t border-gray-100 dark:border-gray-700 pt-2 space-y-2">
              {task.status === "completed" && (
                <button
                  onClick={() => onUpdate(task.id!, { status: "done" })}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-xl transition"
                >
                  <CheckCheck size={13} /> Verify &amp; Mark Done
                </button>
              )}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditOpen(true)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 rounded-xl transition"
                >
                  <Pencil size={11} /> Edit
                </button>
                {!confirmDelete ? (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold bg-red-50 dark:bg-red-900/20 hover:bg-red-100 text-red-600 dark:text-red-400 rounded-xl transition"
                  >
                    <Trash2 size={11} /> Delete
                  </button>
                ) : (
                  <div className="flex-1 flex items-center gap-1.5">
                    <span className="text-xs text-gray-400">Sure?</span>
                    <button
                      onClick={async () => { await onDelete(task.id!); setConfirmDelete(false); }}
                      className="text-xs px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg transition"
                    >
                      No
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Task Detail Modal — both roles (FIX #3) */}
      <TaskDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        task={task}
        users={users}
        role={role}
      />

      {/* Admin Edit Modal */}
      {isAdmin && adminUser && (
        <TaskFormModal
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          onSubmit={async (t) => { await onUpdate(task.id!, t); setEditOpen(false); }}
          adminUser={adminUser}
          editTask={task}
          users={users}
        />
      )}

      {/* User Update Modal */}
      {isUser && (
        <UserTaskModal
          isOpen={userEditOpen}
          onClose={() => setUserEditOpen(false)}
          task={task}
          users={users}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
}
