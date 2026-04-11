/**
 * validation.ts
 * Central Yup validation schemas for all forms in the app.
 * All form types are inferred from schemas — never define them twice.
 *
 * Schemas:
 *   signupSchema          — SignUp form
 *   loginSchema           — Login form
 *   forgotPasswordSchema  — Forgot Password form
 *   taskSchema            — Admin Create/Edit Task form
 *   userTaskSchema        — User Task progress update form
 */
import * as yup from "yup";

// ── Reusable field rules ──────────────────────────────────────────────────────
const emailField = yup
  .string()
  .email("Please enter a valid email address")
  .required("Email is required");

const passwordField = yup
  .string()
  .min(6, "Password must be at least 6 characters")
  .required("Password is required");

// ── Auth schemas ──────────────────────────────────────────────────────────────
export const signupSchema = yup.object({
  name:     yup.string().trim().min(2, "Name must be at least 2 characters").required("Name is required"),
  email:    emailField,
  password: passwordField,
});

export const loginSchema = yup.object({
  email:    emailField,
  password: passwordField,
});

export const forgotPasswordSchema = yup.object({
  email: emailField,
});

// ── Admin Task schema (create / edit) ─────────────────────────────────────────
// Description is stored as HTML from the rich-text editor — validate plain-text length.
export const taskSchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .required("Title is required"),
  description: yup
    .string()
    .required("Description is required")
    .test(
      "min-plain-text",
      "Description must be at least 10 characters",
      (value) => {
        if (!value) return false;
        const plainText = value
          .replace(/<[^>]*>/g, " ")
          .replace(/&nbsp;/g, " ")
          .trim();
        return plainText.length >= 10;
      }
    ),
  assignedTo: yup
    .string()
    .email("Must be a valid user email")
    .required("Please assign this task to a user"),
  priority: yup
    .mixed<"low" | "medium" | "high">()
    .oneOf(["low", "medium", "high"], "Invalid priority")
    .required("Priority is required"),
});

// ── User Task update schema ───────────────────────────────────────────────────
// Users can update: status, startDate, endDate, remarks.
export const userTaskSchema = yup.object({
  status: yup
    .mixed<"todo" | "in-progress" | "completed">()
    .oneOf(["todo", "in-progress", "completed"], "Invalid status")
    .required("Status is required"),
  startDate: yup.string().optional(),
  endDate: yup
    .string()
    .optional()
    .test(
      "end-after-start",
      "End date must be on or after start date",
      function (value) {
        const { startDate } = this.parent as { startDate?: string };
        if (!startDate || !value) return true;
        return new Date(value) >= new Date(startDate);
      }
    ),
  remarks: yup.string().optional(),
});

// ── Inferred types ────────────────────────────────────────────────────────────
export type SignupFormValues        = yup.InferType<typeof signupSchema>;
export type LoginFormValues         = yup.InferType<typeof loginSchema>;
export type ForgotPasswordFormValues = yup.InferType<typeof forgotPasswordSchema>;
export type TaskFormValues          = yup.InferType<typeof taskSchema>;
export type UserTaskFormValues      = yup.InferType<typeof userTaskSchema>;
