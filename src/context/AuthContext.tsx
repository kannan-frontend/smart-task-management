/**
 * AuthContext.tsx
 * Global authentication state and Firebase Auth operations.
 * Wrap app root with <AuthProvider>.
 * Consume via useAuth() hook — never use useContext(AuthContext) directly.
 */
import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import {
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, sendPasswordResetEmail, updateProfile,
} from "firebase/auth";
import { auth } from "../services/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { mapFirebaseError } from "../utils/firebaseError";
import type { SignupInput, UserData } from "../types/auth";

type AuthContextType = {
  user: User | null; loading: boolean; userData: UserData | null; isAdmin: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (data: SignupInput) => Promise<any>;
  forgotPassword: (email: string) => Promise<any>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null, loading: true, userData: null, isAdmin: false,
  login: async () => {}, signup: async () => {},
  forgotPassword: async () => {}, logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user,     setUser]     = useState<User | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const snap = await getDoc(doc(db, "users", firebaseUser.uid));
        if (snap.exists()) setUserData(snap.data() as UserData);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const isAdmin = userData?.role === "admin";

  const login = async (email: string, password: string) => {
    try { return await signInWithEmailAndPassword(auth, email, password); }
    catch (err: any) { throw new Error(mapFirebaseError(err)); }
  };

  const signup = async ({ name, email, password }: SignupInput) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName: name });
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid, name, email, role: "user", createdAt: new Date(),
      });
      return res.user;
    } catch (err: any) { throw new Error(mapFirebaseError(err)); }
  };

  const forgotPassword = async (email: string) => {
    try { return await sendPasswordResetEmail(auth, email); }
    catch (err: any) { throw new Error(mapFirebaseError(err)); }
  };

  // FIX: clear React state immediately so navigate("/login") works
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{ user, userData, isAdmin, loading, login, signup, forgotPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
