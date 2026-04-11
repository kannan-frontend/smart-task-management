/**
 * firebaseError.ts
 * Maps Firebase Auth error codes to user-friendly messages.
 * Add new cases here as needed — never expose raw Firebase codes to users.
 */

const ERROR_MAP: Record<string, string> = {
  "auth/user-not-found":        "No account found with this email.",
  "auth/wrong-password":        "Incorrect password. Please try again.",
  "auth/email-already-in-use":  "This email is already registered.",
  "auth/invalid-email":         "Please enter a valid email address.",
  "auth/weak-password":         "Password must be at least 6 characters.",
  "auth/too-many-requests":     "Too many attempts. Please try again later.",
  "auth/network-request-failed":"Network error. Please check your connection.",
  "auth/user-disabled":         "This account has been disabled.",
  "auth/invalid-credential":    "Invalid email or password.",
};

export const mapFirebaseError = (err: { code?: string; message?: string }): string => {
  if (err.code && ERROR_MAP[err.code]) return ERROR_MAP[err.code];
  return err.message ?? "Something went wrong. Please try again.";
};
