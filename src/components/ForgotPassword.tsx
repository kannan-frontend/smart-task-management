import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPasswordSchema } from "../utils/validation";
import { useAuth } from "../hooks/useAuth";
import type { ForgotPasswordFormData } from "../types/auth";
import toast from "react-hot-toast";
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import AuthLayout from "../pages/AuthLayout";

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ForgotPasswordFormData>({ resolver: yupResolver(forgotPasswordSchema) });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    try { await forgotPassword(data.email); setSentEmail(data.email); setSent(true); toast.success("Reset link sent!"); reset(); }
    catch (err: any) { toast.error(err.message ?? "Failed to send reset link"); }
    finally { setLoading(false); }
  };

  return (
    <AuthLayout>
      {!sent ? (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Reset password</h1>
            <p className="text-gray-400 text-sm">Enter your email and we'll send you a reset link</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="email" placeholder="you@example.com" {...register("email")}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-800/60 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition" />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1.5">⚠ {errors.email.message}</p>}
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 mt-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold rounded-xl transition text-sm shadow-lg shadow-indigo-500/20">
              {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <> Send Reset Link <ArrowRight size={15} /></>}
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition">
              <ArrowLeft size={13} /> Back to Sign In
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
            <CheckCircle size={32} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              We sent a reset link to<br /><span className="text-white font-medium">{sentEmail}</span>
            </p>
          </div>
          <div className="p-4 bg-gray-800/60 border border-gray-700 rounded-xl text-left space-y-2">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Next steps</p>
            <p className="text-xs text-gray-300">1. Check your inbox (and spam folder)</p>
            <p className="text-xs text-gray-300">2. Click the reset link in the email</p>
            <p className="text-xs text-gray-300">3. Create your new password</p>
          </div>
          <Link to="/login" className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition text-sm">
            <ArrowLeft size={13} /> Back to Sign In
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}
