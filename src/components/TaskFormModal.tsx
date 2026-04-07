import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { taskSchema, type TaskFormValues } from "../utils/validation";
import type { Task } from "../types/tasks";
import type { UserData } from "../types/auth";
import { X, ChevronDown, UserCircle, Bold, Italic, List } from "lucide-react";

interface Props {
  isOpen: boolean; onClose: () => void;
  onSubmit: (task: Omit<Task,"id">) => Promise<void>;
  adminUser: UserData; editTask?: Task | null; users?: UserData[];
}

// ── Rich Text Editor (no external library) ───────────────────────────────────
function RichEditor({
  value, onChange, error,
}: { value: string; onChange: (v: string) => void; error?: string }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const initialised = useRef(false);

  // Set initial HTML once on mount
  useEffect(() => {
    if (!initialised.current && editorRef.current) {
      editorRef.current.innerHTML = value || "";
      initialised.current = true;
    }
  }, []);

  // Sync when value resets (e.g. modal reopened)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const exec = (cmd: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  return (
    <div className={`border rounded-xl overflow-hidden transition focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent ${error ? "border-red-400" : "border-gray-200 dark:border-gray-600"}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 bg-gray-50 dark:bg-gray-700/60 border-b border-gray-200 dark:border-gray-600">
        {[
          { icon: <Bold size={13} />,   cmd: "bold",               title: "Bold (Ctrl+B)" },
          { icon: <Italic size={13} />, cmd: "italic",             title: "Italic (Ctrl+I)" },
          { icon: <List size={13} />,   cmd: "insertUnorderedList",title: "Bullet List" },
        ].map((btn) => (
          <button key={btn.cmd} type="button" title={btn.title}
            onMouseDown={(e) => { e.preventDefault(); exec(btn.cmd); }}
            className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600 hover:text-gray-800 dark:hover:text-white transition">
            {btn.icon}
          </button>
        ))}
        <span className="ml-2 text-[10px] text-gray-400 select-none">Ctrl+B · Ctrl+I</span>
      </div>
      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        data-placeholder="Describe the task in detail (min 10 characters)..."
        onInput={() => { if (editorRef.current) onChange(editorRef.current.innerHTML); }}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === "b") { e.preventDefault(); exec("bold"); }
          if ((e.ctrlKey || e.metaKey) && e.key === "i") { e.preventDefault(); exec("italic"); }
        }}
        className="min-h-[90px] max-h-[160px] overflow-y-auto px-3 py-2.5 text-sm text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:outline-none"
        style={{ wordBreak: "break-word" }}
      />
      {error && <p className="text-red-500 text-xs px-3 py-1.5 bg-red-50 dark:bg-red-900/10 border-t border-red-100">{error}</p>}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export default function TaskFormModal({ isOpen, onClose, onSubmit, adminUser, editTask, users = [] }: Props) {
  const [suggestions, setSuggestions] = useState<UserData[]>([]);
  const [showDrop, setShowDrop] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const isEdit  = !!editTask;

  const { register, handleSubmit, setValue, watch, reset, control, formState: { errors, isSubmitting } } =
    useForm<TaskFormValues>({
      resolver: yupResolver(taskSchema),
      defaultValues: { title: "", description: "", assignedTo: "", priority: "medium" },
    });

  useEffect(() => {
    if (isOpen) {
      reset(isEdit
        ? { title: editTask!.title, description: editTask!.description, assignedTo: editTask!.assignedTo, priority: editTask!.priority }
        : { title: "", description: "", assignedTo: "", priority: "medium" });
    }
  }, [isOpen, isEdit, editTask, reset]);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (dropRef.current && !dropRef.current.contains(e.target as Node)) setShowDrop(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [isOpen, onClose]);

  const assignedToValue = watch("assignedTo");

  const onFormSubmit = async (data: TaskFormValues) => {
    await onSubmit({
      title:      data.title.trim(),
      description:data.description,
      assignedTo: data.assignedTo.trim().toLowerCase(),
      assignedBy: adminUser.email,
      status:     editTask?.status ?? "todo",
      priority:   data.priority,
      createdAt:  editTask?.createdAt ?? Date.now(),
      ...(editTask?.startDate ? { startDate: editTask.startDate } : {}),
      ...(editTask?.endDate   ? { endDate:   editTask.endDate }   : {}),
      ...(editTask?.remarks   ? { remarks:   editTask.remarks }   : {}),
    });
    onClose();
  };

  if (!isOpen) return null;

  const inp = "w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";
  const lbl = "block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider";
  const errCls = "text-red-500 text-xs mt-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg z-10 max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">{isEdit ? "Edit Task" : "Create New Task"}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{isEdit ? "Update task details" : "Assign a task to a team member"}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="px-6 py-5 space-y-4 overflow-y-auto">

          {/* Title */}
          <div>
            <label className={lbl}>Title *</label>
            <input {...register("title")} placeholder="e.g. Design landing page" className={inp} />
            {errors.title && <p className={errCls}>{errors.title.message}</p>}
          </div>

          {/* Description — Rich Text Editor */}
          <div>
            <label className={lbl}>Description *</label>
            <Controller name="description" control={control}
              render={({ field }) => (
                <RichEditor value={field.value} onChange={field.onChange} error={errors.description?.message} />
              )}
            />
          </div>

          {/* Assign To autocomplete */}
          <div ref={dropRef} className="relative">
            <label className={lbl}>Assign To *</label>
            <input
              value={assignedToValue}
              onChange={(e) => {
                setValue("assignedTo", e.target.value, { shouldValidate: true });
                const q = e.target.value.toLowerCase();
                const f = q ? users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) : [];
                setSuggestions(f); setShowDrop(f.length > 0);
              }}
              placeholder="Search by name or email..."
              className={inp} autoComplete="off"
            />
            {errors.assignedTo && <p className={errCls}>{errors.assignedTo.message}</p>}
            {showDrop && (
              <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg overflow-hidden max-h-44 overflow-y-auto">
                {suggestions.map((u) => (
                  <button key={u.uid} type="button"
                    onClick={() => { setValue("assignedTo", u.email, { shouldValidate: true }); setShowDrop(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50 dark:hover:bg-gray-600 text-left transition">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0">
                      <UserCircle size={15} className="text-indigo-600 dark:text-indigo-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{u.name}</p>
                      <p className="text-xs text-gray-400 truncate">{u.email}</p>
                    </div>
                    <span className={`ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${u.role==="admin"?"bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300":"bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"}`}>
                      {u.role === "admin" ? "Admin" : "Member"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className={lbl}>Priority</label>
            <div className="relative">
              <select {...register("priority")} className={`${inp} appearance-none pr-8`}>
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 rounded-xl transition">
              {isSubmitting ? (isEdit ? "Saving..." : "Creating...") : (isEdit ? "Save Changes" : "Create Task")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
