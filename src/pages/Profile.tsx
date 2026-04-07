import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import type { UserProfile } from "../types/profile";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { LogOut, Mail, Calendar, ShieldCheck, UserRound } from "lucide-react";

export default function Profile() {
  const { user, logout, userData } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();
  const isAdmin = userData?.role === "admin";

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "users", user.uid))
      .then((s) => { if (s.exists()) setProfile(s.data() as UserProfile); })
      .finally(() => setLoading(false));
  }, [user]);

  // FIX: dismiss toast first, then logout, then navigate with replace
  const handleLogout = () => {
    console.log("User Clicked Logout");
    toast.dismiss();
    setTimeout(() => {
      toast((t) => (
        <div className="flex flex-col gap-3 p-1">
          <p className="font-medium text-gray-800 text-sm">Sign out of TaskFlow?</p>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                setLoggingOut(true);
                await logout();
                navigate("/login", { replace: true });
              }}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition"
            >
              Yes, Sign Out
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold px-4 py-1.5 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ), { duration: 1000 });
    }, 0);
  };

  const joinedDate = profile?.createdAt?.toDate?.()?.toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  }) ?? "N/A";

  const initials = (profile?.name ?? user?.displayName ?? "U")
    .split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-xl mx-auto space-y-5">

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        <div className="px-6 pb-6">
          {/* Avatar + Role badge */}
          <div className="flex items-end justify-between -mt-12 mb-5">
            <div className="w-24 h-24 rounded-2xl border-4 border-white dark:border-gray-800 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
              {initials}
            </div>
            <span className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl mb-1 ${isAdmin
                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
              }`}>
              {isAdmin ? <ShieldCheck size={12} /> : <UserRound size={12} />}
              {isAdmin ? "Administrator" : "Member"}
            </span>
          </div>

          {/* Name */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {profile?.name ?? user?.displayName ?? "User"}
          </h1>

          {/* Info rows */}
          <div className="mt-4 space-y-2.5">
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center flex-shrink-0">
                <Mail size={14} className="text-indigo-500" />
              </div>
              {profile?.email ?? user?.email}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center flex-shrink-0">
                <Calendar size={14} className="text-indigo-500" />
              </div>
              Member since {joinedDate}
            </div>
          </div>
        </div>
      </div>

      {/* Account details card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Account Details</h2>
        <div className="space-y-0">
          {[
            { label: "Full Name", value: profile?.name ?? user?.displayName ?? "—" },
            { label: "Email", value: profile?.email ?? user?.email ?? "—" },
            { label: "Role", value: isAdmin ? "Administrator" : "Member" },
            { label: "Account ID", value: (user?.uid?.slice(0, 16) ?? "—") + "..." },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-gray-700 last:border-0">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{row.label}</span>
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sign Out */}
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="w-full flex items-center justify-center gap-2.5 py-3 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 hover:text-red-600 font-semibold text-sm rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition disabled:opacity-60"
      >
        <LogOut size={15} />
        {loggingOut ? "Signing out..." : "Sign Out"}
      </button>
    </div>
  );
}
