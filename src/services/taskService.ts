/**
 * taskService.ts
 * Firebase Firestore CRUD operations for tasks.
 * All methods are async and return typed results.
 * Used exclusively via useTasks hook — never call directly from components.
 */
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Task } from "../types/tasks";

const TASKS_COLLECTION = "tasks";
const taskRef = collection(db, TASKS_COLLECTION);

/**
 * Remove undefined values before writing to Firestore.
 * Firestore throws an error if any field value is undefined.
 */
function sanitize(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).filter(([k, v]) => k !== "id" && v !== undefined && v !== "")
  );
}

export const taskService = {
  /** Create a new task (Admin only) */
  async create(task: Omit<Task, "id">): Promise<string> {
    const payload = sanitize(task as unknown as Record<string, unknown>);
    const docRef = await addDoc(taskRef, payload);
    return docRef.id;
  },

  /** Fetch all tasks */
  async getAll(): Promise<Task[]> {
    const snap = await getDocs(taskRef);
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Task, "id">),
    }));
  },

  /** Fetch tasks assigned to a specific user email */
  async getByUser(email: string): Promise<Task[]> {
    const q = query(taskRef, where("assignedTo", "==", email));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Task, "id">),
    }));
  },

  /** Update task fields */
  async update(id: string, data: Partial<Task>): Promise<void> {
    const payload = sanitize(data as unknown as Record<string, unknown>);
    if (Object.keys(payload).length === 0) return;
    await updateDoc(doc(db, TASKS_COLLECTION, id), payload);
  },

  /** Delete a task */
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, TASKS_COLLECTION, id));
  },
};
