import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LayoutDashboard, CheckSquare, User, Users, ShieldCheck } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isAdmin } = useAuth();

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Tasks",     path: "/tasks",     icon: CheckSquare },
    { name: "Profile",   path: "/profile",   icon: User },
    ...(isAdmin ? [{ name: "Users", path: "/users", icon: Users }] : []),
  ];

  return (
    <aside className="w-60 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col">
      <div className="px-5 py-5 flex items-center gap-2.5 border-b border-gray-100 dark:border-gray-800">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <ShieldCheck size={16} className="text-white" />
        </div>
        <span className="font-bold text-gray-800 dark:text-white text-sm tracking-tight">TaskFlow</span>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {menu.map((item) => {
          const active = pathname === item.path;
          return (
            <button key={item.path} onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active ? "bg-indigo-600 text-white shadow-sm" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              }`}>
              <item.icon size={17} />
              {item.name}
            </button>
          );
        })}
      </nav>
      {isAdmin && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <ShieldCheck size={13} className="text-purple-500" />
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">Admin Access</span>
          </div>
        </div>
      )}
    </aside>
  );
}
