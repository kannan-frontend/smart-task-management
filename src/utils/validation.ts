import * as yup from "yup";

// ── Auth ─────────────────────────────────────────────────────────────────────

export const signupSchema = yup.object({
  name:     yup.string().required("Name is required"),
  email:    yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "At least 6 characters").required("Password is required"),
});

export const loginSchema = yup.object({
  email:    yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "At least 6 characters").required("Password is required"),
});

export const forgotPasswordSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

// ── Admin Task (create / edit) ────────────────────────────────────────────────
// Description accepts HTML from rich text editor — validate plain text length
export const taskSchema = yup.object({
  title:      yup.string().trim().min(3, "Title must be at least 3 characters").required("Title is required"),
  description:yup.string().required("Description is required").test(
    "min-plain-text", "Description must be at least 10 characters",
    (v) => !!v && v.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim().length >= 10
  ),
  assignedTo: yup.string().email("Must be a valid email").required("Assign to is required"),
  priority:   yup.mixed<"low" | "medium" | "high">().oneOf(["low","medium","high"]).required("Priority is required"),
});

export type TaskFormValues = yup.InferType<typeof taskSchema>;

// ── User Task update (status / dates / remarks) ───────────────────────────────
export const userTaskSchema = yup.object({
  status: yup
    .mixed<"todo" | "in-progress" | "completed">()
    .oneOf(["todo","in-progress","completed"])
    .required("Status is required"),
  startDate: yup.string().optional(),
  endDate:   yup.string().optional().test(
    "end-after-start", "End date must be after start date",
    function (v) {
      const { startDate } = this.parent;
      if (!startDate || !v) return true;
      return new Date(v) >= new Date(startDate);
    }
  ),
  remarks: yup.string().optional(),
});

export type UserTaskFormValues = yup.InferType<typeof userTaskSchema>;
