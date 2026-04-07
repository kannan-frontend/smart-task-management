import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { ShieldCheck } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Toaster position="top-right" />
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=1470&auto=format&fit=crop"
          alt="workspace" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-purple-900/80 to-black/70" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
              <ShieldCheck size={18} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Task<span className="text-indigo-300">Flow</span></span>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              Manage tasks.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">Ship faster.</span>
            </h2>
            <p className="text-white/60 text-base leading-relaxed max-w-sm">Assign, track, and complete tasks with your team — all in one place.</p>
            <div className="flex flex-wrap gap-2 mt-6">
              {["Role-based access","Real-time updates","Team collaboration"].map((f) => (
                <span key={f} className="px-3 py-1.5 text-xs font-medium bg-white/10 backdrop-blur border border-white/15 text-white/80 rounded-full">✦ {f}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <ShieldCheck size={16} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg">Task<span className="text-indigo-400">Flow</span></span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
