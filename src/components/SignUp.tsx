import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "../utils/validation";
import { useAuth } from "../hooks/useAuth";
import type { SignupFormData } from "../types/auth";
import AuthLayout from "../pages/AuthLayout";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, UserRound, ArrowRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SignupFormData>({ resolver: yupResolver(signupSchema) });

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    try { await signup(data); toast.success("Account created! 🎉"); navigate("/dashboard"); reset(); }
    catch (err: any) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const inp = "w-full pl-11 pr-4 py-3 rounded-xl bg-gray-800/60 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition";

  return (
    <AuthLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Create account</h1>
        <p className="text-gray-400 text-sm">Join TaskFlow and start collaborating</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Full Name</label>
          <div className="relative">
            <UserRound size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="text" placeholder="John Doe" {...register("name")} className={inp} />
          </div>
          {errors.name && <p className="text-red-400 text-xs mt-1.5">⚠ {errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Email Address</label>
          <div className="relative">
            <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="email" placeholder="you@example.com" {...register("email")} className={inp} />
          </div>
          {errors.email && <p className="text-red-400 text-xs mt-1.5">⚠ {errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Password</label>
          <div className="relative">
            <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type={showPass?"text":"password"} placeholder="Min. 6 characters" autoComplete="new-password" {...register("password")}
              className="w-full pl-11 pr-11 py-3 rounded-xl bg-gray-800/60 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition" />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-xs mt-1.5">⚠ {errors.password.message}</p>}
          <p className="text-gray-600 text-xs mt-1.5">Use at least 6 characters with a mix of letters and numbers</p>
        </div>
        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 mt-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold rounded-xl transition text-sm shadow-lg shadow-indigo-500/20">
          {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <> Create Account <ArrowRight size={15} /></>}
        </button>
      </form>
      <p className="text-gray-500 text-sm mt-6 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
