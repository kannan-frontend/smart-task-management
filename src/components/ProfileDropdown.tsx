import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";

type Props = {
  name?: string;
  email?: string;
  onLogout: () => void;
};

export default function ProfileDropdown({ name, email, onLogout }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const initial = (
    name?.trim().charAt(0) ||
    email?.trim().charAt(0) ||
    "U"
  ).toUpperCase();

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Avatar trigger */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open profile menu"
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center font-bold text-sm transition"
      >
        {initial}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50">
          {/* User info */}
          <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-700">
            <p className="font-semibold text-sm text-gray-800 dark:text-white truncate">
              {name || "User"}
            </p>
            <p className="text-xs text-gray-400 truncate">{email}</p>
          </div>

          {/* Profile */}
          <button
            onClick={() => { navigate("/profile"); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 transition"
          >
            <User size={14} className="text-gray-400" />
            Profile
          </button>

          {/* FIX #5: Logout → Sign Out */}
          <button
            onClick={() => { setOpen(false); onLogout(); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm text-red-500 transition"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
