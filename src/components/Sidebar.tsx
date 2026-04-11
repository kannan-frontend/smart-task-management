import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LayoutDashboard, CheckSquare, User, Users, ShieldCheck, X } from "lucide-react";

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isAdmin } = useAuth();

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Tasks",     path: "/tasks",     icon: CheckSquare },
    { name: "Profile",   path: "/profile",   icon: User },
    ...(isAdmin ? [{ name: "Users", path: "/users", icon: Users }] : []),
  ];

  const handleNav = (path: string) => {
    navigate(path);
    onClose?.();
  };

  return (
    <aside className="w-60 h-full bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col">
      {/* Logo + Close (close only visible on mobile) */}
      <div className="px-5 py-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={16} className="text-white" />
          </div>
          <span className="font-bold text-gray-800 dark:text-white text-sm tracking-tight">
            Task<span className="text-indigo-400">Flow</span>
          </span>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          aria-label="Close sidebar"
        >
          <X size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {menu.map((item) => {
          const active = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <item.icon size={17} />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* Admin badge */}
      {isAdmin && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <ShieldCheck size={13} className="text-purple-500" />
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
              Admin Access
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
