import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../utils/validation";
import { useAuth } from "../hooks/useAuth";
import type { LoginFormData } from "../types/auth";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../pages/AuthLayout";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: yupResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Welcome back! 🎉", { duration: 3000 });
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full pl-11 pr-4 py-3 rounded-xl bg-gray-800/60 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition";

  return (
    <AuthLayout>
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
        <p className="text-gray-400 text-sm">Sign in to your TaskFlow account</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className={inputClass}
            />
          </div>
          {errors.email && (
            <p className="text-red-400 text-xs mt-1.5">⚠ {errors.email.message}</p>
          )}
        </div>

        {/* Password — label only, no forgot link here */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              {...register("password")}
              className="w-full pl-11 pr-11 py-3 rounded-xl bg-gray-800/60 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-xs mt-1.5">⚠ {errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 mt-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold rounded-xl transition text-sm shadow-lg shadow-indigo-500/20"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Sign In <ArrowRight size={15} />
            </>
          )}
        </button>

        {/* FIX #2: Forgot password BELOW the button */}
        <div className="text-center pt-1">
          <Link
            to="/forgot-password"
            className="text-xs text-indigo-400 hover:text-indigo-300 transition"
          >
            Forgot password?
          </Link>
        </div>
      </form>

      <p className="text-gray-500 text-sm mt-6 text-center">
        Don't have an account?{" "}
        <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium transition">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}
