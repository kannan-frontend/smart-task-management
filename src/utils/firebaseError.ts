export const mapFirebaseError = (err: any) => {
  switch (err.code) {
    case "auth/user-not-found":
      return "No account found";
    case "auth/wrong-password":
      return "Incorrect password";
    case "auth/email-already-in-use":
      return "Email already registered";
    default:
      return "Something went wrong";
  }
};