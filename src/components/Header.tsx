import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import ProfileDropdown from "./ProfileDropdown";
import { useNavigate } from "react-router-dom";
import { ConfirmModal } from "../pages/ConfirmModal";
import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  if (!user) return null;

  const handleLogoutConfirmed = async () => {
    setShowConfirm(false);
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <header className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        {/* Hamburger — visible on mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Desktop spacer */}
        <div className="hidden lg:block" />

        {/* Profile dropdown */}
        <ProfileDropdown
          name={user.displayName || ""}
          email={user.email || ""}
          onLogout={() => setShowConfirm(true)}
        />
      </header>

      <ConfirmModal
        isOpen={showConfirm}
        title="Sign Out"
        message="Are you sure you want to sign out of TaskFlow?"
        confirmLabel="Yes, Sign Out"
        confirmClass="bg-red-600 hover:bg-red-700 text-white"
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleLogoutConfirmed}
      />
    </>
  );
}
