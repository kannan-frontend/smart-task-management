import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import ProfileDropdown from "./ProfileDropdown";
import { useNavigate } from "react-router-dom";
import { ConfirmModal } from "../pages/ConfirmModal";

export default function Header() {
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
      <header className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div />
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
