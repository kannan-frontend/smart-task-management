import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { UserData } from "../types/auth";

const USERS_COLLECTION = "users";
const usersRef = collection(db, USERS_COLLECTION);

export const userService = {
  /** Fetch all users */
  async getAll(): Promise<UserData[]> {
    const snap = await getDocs(usersRef);
    return snap.docs.map((d) => ({
      ...(d.data() as UserData),
      uid: d.id,
    }));
  },

  /** Update user role */
  async updateRole(uid: string, role: "admin" | "user"): Promise<void> {
    await updateDoc(doc(db, USERS_COLLECTION, uid), { role });
  },

  /** Delete user document from Firestore */
  async delete(uid: string): Promise<void> {
    await deleteDoc(doc(db, USERS_COLLECTION, uid));
  },
};
