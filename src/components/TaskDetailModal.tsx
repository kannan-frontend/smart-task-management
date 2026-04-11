/**
 * TaskDetailModal — Read-only full task detail view
 * Used by both Admin and User to view complete task information.
 * Props:
 *   isOpen    — controls visibility
 *   onClose   — callback to close
 *   task      — the Task object to display
 *   users     — list of all UserData for resolving names
 *   role      — "admin" | "user" — controls which sections are shown
 */
import type { Task } from "../types/tasks";
import type { UserData, Role } from "../types/auth";
import {
  X, Calendar, User, Flag, AlertCircle,
  Clock, StickyNote, CheckCircle, Circle,
  Loader, ShieldCheck, Tag,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  users?: UserData[];
  role: Role;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const plainText = (html: string) =>
  html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

const STATUS_CONFIG: Record<Task["status"], { label: string; color: string; icon: React.ElementType }> = {
  todo:          { label: "To Do",            color: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",             icon: Circle },
  "in-progress": { label: "In Progress",      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",          icon: Loader },
  completed:     { label: "Pending Review",   color: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",      icon: Clock },
  done:          { label: "Done",             color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400", icon: CheckCircle },
};

const PRIORITY_CONFIG: Record<Task["priority"], { label: string; color: string; bar: string }> = {
  low:    { label: "Low",    color: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400", bar: "bg-emerald-400" },
  medium: { label: "Medium", color: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400",          bar: "bg-amber-400"   },
  high:   { label: "High",   color: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400",                    bar: "bg-red-500"     },
};

// ── Sub-components ────────────────────────────────────────────────────────────
function DetailRow({ icon: Icon, label, children }: {
  icon: React.ElementType; label: string; children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 dark:border-gray-700 last:border-0">
      <div className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={13} className="text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
        <div className="text-sm text-gray-700 dark:text-gray-200">{children}</div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function TaskDetailModal({ isOpen, onClose, task, users = [], role }: Props) {
  if (!isOpen) return null;

  const assignedUser   = users.find((u) => u.email === task.assignedTo);
  const assignedByUser = users.find((u) => u.email === task.assignedBy);
  const descPlain      = task.description?.includes("<") ? plainText(task.description) : task.description;
  const status         = STATUS_CONFIG[task.status];
  const priority       = PRIORITY_CONFIG[task.priority];
  const StatusIcon     = status.icon;

  const createdAt = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      })
    : "—";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg z-10 max-h-[90vh] flex flex-col overflow-hidden">

        {/* Priority stripe */}
        <div className={`h-1.5 w-full ${priority.bar}`} />

        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-700 flex items-start justify-between gap-3 flex-shrink-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full ${status.color}`}>
                <StatusIcon size={10} />
                {status.label}
              </span>
              <span className={`inline-flex items-center text-[10px] font-semibold px-2.5 py-1 rounded-full border ${priority.color}`}>
                {priority.label} Priority
              </span>
              {role === "admin" && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                  <ShieldCheck size={10} /> Admin View
                </span>
              )}
            </div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white leading-snug">
              {task.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-1">

          {/* Description */}
          {descPlain && (
            <div className="mb-4">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</p>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                {descPlain}
              </div>
            </div>
          )}

          {/* Details grid */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 divide-y divide-gray-50 dark:divide-gray-700">
            <DetailRow icon={User} label="Assigned To">
              <span className="font-medium">{assignedUser?.name ?? task.assignedTo}</span>
              {assignedUser?.email && (
                <span className="text-xs text-gray-400 ml-1.5">({assignedUser.email})</span>
              )}
            </DetailRow>

            <DetailRow icon={Flag} label="Assigned By">
              <span className="font-medium">{assignedByUser?.name ?? task.assignedBy}</span>
            </DetailRow>

            <DetailRow icon={Tag} label="Priority">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${priority.color}`}>
                {priority.label}
              </span>
            </DetailRow>

            <DetailRow icon={AlertCircle} label="Status">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                <StatusIcon size={10} />
                {status.label}
              </span>
            </DetailRow>

            <DetailRow icon={Clock} label="Created">
              {createdAt}
            </DetailRow>

            {(task.startDate || task.endDate) && (
              <DetailRow icon={Calendar} label="Timeline">
                <span>
                  {task.startDate && <span className="font-medium">{task.startDate}</span>}
                  {task.startDate && task.endDate && (
                    <span className="text-gray-400 mx-1.5">→</span>
                  )}
                  {task.endDate && <span className="font-medium">{task.endDate}</span>}
                </span>
              </DetailRow>
            )}

            {task.remarks && (
              <DetailRow icon={StickyNote} label="Remarks / Notes">
                <p className="italic text-gray-600 dark:text-gray-300">"{task.remarks}"</p>
              </DetailRow>
            )}
          </div>

          {/* Done banner */}
          {task.status === "done" && (
            <div className="mt-4 px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2">
              <CheckCircle size={15} className="text-emerald-600 flex-shrink-0" />
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                Admin has verified and marked this task as Done
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 pt-3 border-t border-gray-100 dark:border-gray-700 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
