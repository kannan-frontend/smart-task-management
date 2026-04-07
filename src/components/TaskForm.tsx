import { useState } from "react";
import type { Task } from "../types/tasks";
import type { UserData } from "../types/auth";

interface TaskFormProps {
  onSubmit: (task: Omit<Task, "id">) => Promise<void>;
  adminUser: UserData;
}

const INITIAL_FORM = {
  title: "",
  description: "",
  assignedTo: "",
  priority: "medium" as Task["priority"],
  startDate: "",
  endDate: "",
  remarks: "",
};

export default function TaskForm({ onSubmit, adminUser }: TaskFormProps) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof INITIAL_FORM>>({});

  const validate = (): boolean => {
    const errs: Partial<typeof INITIAL_FORM> = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.description.trim()) errs.description = "Description is required";
    if (!form.assignedTo.trim()) errs.assignedTo = "Assign to a user email";
    else if (!/\S+@\S+\.\S+/.test(form.assignedTo))
      errs.assignedTo = "Enter a valid email";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        assignedTo: form.assignedTo.trim().toLowerCase(),
        assignedBy: adminUser.email,
        status: "todo",
        priority: form.priority,
        createdAt: Date.now(),
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        remarks: form.remarks || undefined,
      });
      setForm(INITIAL_FORM);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white";
  const errorClass = "text-red-500 text-xs mt-1";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 space-y-4"
    >
      <h2 className="text-lg font-bold text-gray-800 dark:text-white">
        Create New Task
      </h2>

      {/* Title */}
      <div>
        <label className={labelClass}>Title *</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Task title"
          className={inputClass}
        />
        {errors.title && <p className={errorClass}>{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description *</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Task description"
          rows={3}
          className={inputClass}
        />
        {errors.description && (
          <p className={errorClass}>{errors.description}</p>
        )}
      </div>

      {/* Assign To */}
      <div>
        <label className={labelClass}>Assign To (email) *</label>
        <input
          name="assignedTo"
          type="email"
          value={form.assignedTo}
          onChange={handleChange}
          placeholder="user@example.com"
          className={inputClass}
        />
        {errors.assignedTo && (
          <p className={errorClass}>{errors.assignedTo}</p>
        )}
      </div>

      {/* Priority */}
      <div>
        <label className={labelClass}>Priority</label>
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Date Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Start Date</label>
          <input
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>End Date</label>
          <input
            name="endDate"
            type="date"
            value={form.endDate}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-lg transition"
      >
        {loading ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
}
