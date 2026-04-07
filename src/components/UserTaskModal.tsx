import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userTaskSchema, type UserTaskFormValues } from "../utils/validation";
import type { Task } from "../types/tasks";
import type { UserData } from "../types/auth";
import {
  X, ChevronDown, Calendar, StickyNote, ListTodo,
  User, Flag, AlertCircle, Clock,
} from "lucide-react";

interface Props {
  isOpen:   boolean;
  onClose:  () => void;
  task:     Task;
  users?:   UserData[];
  onUpdate: (id: string, data: Partial<Task>) => Promise<void>;
}

const STATUS_OPTIONS = [
  { value: "todo",        label: "⬜  To Do" },
  { value: "in-progress", label: "🔵  In Progress" },
  { value: "completed",   label: "✅  Completed — submit for admin review" },
];

const PRIORITY_COLOR: Record<Task["priority"], string> = {
  low:    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
  medium: "bg-amber-100   text-amber-700   dark:bg-amber-900/20   dark:text-amber-400",
  high:   "bg-red-100     text-red-700     dark:bg-red-900/20     dark:text-red-400",
};

// strip HTML for display
const plain = (html: string) =>
  html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

export default function UserTaskModal({ isOpen, onClose, task, users = [], onUpdate }: Props) {
  const isDone = task.status === "done";

  const assignedByUser = users.find((u) => u.email === task.assignedBy);
  const descPlain      = task.description?.includes("<") ? plain(task.description) : task.description;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<UserTaskFormValues>({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolver: yupResolver(userTaskSchema) as any,
      defaultValues: {
        status:    isDone ? "completed" : (task.status as UserTaskFormValues["status"]),
        startDate: task.startDate ?? "",
        endDate:   task.endDate   ?? "",
        remarks:   task.remarks   ?? "",
      },
    });

  useEffect(() => {
    if (isOpen) {
      reset({
        status:    isDone ? "completed" : (task.status as UserTaskFormValues["status"]),
        startDate: task.startDate ?? "",
        endDate:   task.endDate   ?? "",
        remarks:   task.remarks   ?? "",
      });
    }
  }, [isOpen, task, reset, isDone]);

  useEffect(() => {
    if (!isOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [isOpen, onClose]);

  const onSubmit = async (data: UserTaskFormValues) => {
    const payload: Partial<Task> = { status: data.status };
    if (data.startDate) payload.startDate = data.startDate;
    if (data.endDate)   payload.endDate   = data.endDate;
    if (data.remarks !== undefined) payload.remarks = data.remarks;
    await onUpdate(task.id!, payload);
    onClose();
  };

  if (!isOpen) return null;

  const inp    = "w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";
  const inpRO  = "w-full px-3 py-2.5 text-sm border border-gray-100 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 cursor-default select-none";
  const lbl    = "flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider";
  const errCls = "text-red-500 text-xs mt-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg z-10 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700 flex items-start justify-between gap-3 flex-shrink-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-gray-900 dark:text-white truncate">{task.title}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Update your task progress</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition">
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {/* Done banner */}
          {isDone && (
            <div className="mx-6 mt-4 px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                ✅ Admin has verified and marked this task as Done
              </p>
            </div>
          )}

          {/* ── READ-ONLY TASK INFO ─────────────────────────────── */}
          <div className="px-6 pt-5 pb-4 space-y-4 border-b border-gray-100 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Task Details (Read-only)</p>

            {/* Description */}
            <div>
              <label className={lbl}><StickyNote size={12} /> Description</label>
              <div className={`${inpRO} min-h-[60px] leading-relaxed`}>{descPlain}</div>
            </div>

            {/* Priority + Assigned By */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}><AlertCircle size={12} /> Priority</label>
                <span className={`inline-flex items-center px-3 py-2 rounded-xl text-xs font-semibold capitalize ${PRIORITY_COLOR[task.priority]}`}>
                  {task.priority}
                </span>
              </div>
              <div>
                <label className={lbl}><Flag size={12} /> Assigned By</label>
                <div className={inpRO}>{assignedByUser?.name ?? task.assignedBy}</div>
              </div>
            </div>

            {/* Created At */}
            <div>
              <label className={lbl}><Clock size={12} /> Created</label>
              <div className={inpRO}>
                {task.createdAt ? new Date(task.createdAt).toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" }) : "—"}
              </div>
            </div>
          </div>

          {/* ── EDITABLE FIELDS ────────────────────────────────── */}
          <form id="user-task-form" onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Your Updates</p>

            {/* Status */}
            <div>
              <label className={lbl}><ListTodo size={13} /> Status *</label>
              <div className="relative">
                <select
                  {...register("status")}
                  disabled={isDone}
                  className={`${inp} appearance-none pr-8 ${isDone ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {errors.status && <p className={errCls}>{errors.status.message}</p>}
              {!isDone && (
                <p className="text-[11px] text-amber-500 dark:text-amber-400 mt-1.5">
                  💡 Select "Completed" to submit for admin review
                </p>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}><Calendar size={12} /> Start Date</label>
                <input type="date" {...register("startDate")} disabled={isDone}
                  className={`${inp} ${isDone ? "opacity-50 cursor-not-allowed" : ""}`} />
                {errors.startDate && <p className={errCls}>{errors.startDate.message}</p>}
              </div>
              <div>
                <label className={lbl}><Calendar size={12} /> End Date</label>
                <input type="date" {...register("endDate")} disabled={isDone}
                  className={`${inp} ${isDone ? "opacity-50 cursor-not-allowed" : ""}`} />
                {errors.endDate && <p className={errCls}>{errors.endDate.message}</p>}
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className={lbl}><StickyNote size={13} /> Remarks / Notes</label>
              <textarea
                {...register("remarks")}
                rows={3}
                disabled={isDone}
                placeholder="Add your progress notes, blockers, or comments..."
                className={`${inp} resize-none ${isDone ? "opacity-50 cursor-not-allowed" : ""}`}
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 pt-2 flex-shrink-0 border-t border-gray-100 dark:border-gray-700">
          {!isDone ? (
            <div className="flex gap-3">
              <button type="button" onClick={onClose}
                className="flex-1 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition">
                Cancel
              </button>
              <button form="user-task-form" type="submit" disabled={isSubmitting}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 rounded-xl transition">
                {isSubmitting ? "Saving..." : "Save Progress"}
              </button>
            </div>
          ) : (
            <button type="button" onClick={onClose}
              className="w-full py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 rounded-xl transition">
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
