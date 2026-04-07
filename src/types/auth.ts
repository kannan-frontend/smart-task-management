//Signup Form Data
export interface SignupFormData {
  name:string;
  email: string;
  password: string;
};

//Login Form Data
export interface LoginFormData {
  email: string;
  password: string;
};

//Forgot Password Form Data
export interface ForgotPasswordFormData {
  email: string;
}

export type Role = "admin" | "user";

export interface SignupInput {
  name: string;
  email: string;
  password: string;
}

export interface UserData {
  uid: string;
  name: string;
  email: string;
  role: Role;
  createdAt: any;
}

