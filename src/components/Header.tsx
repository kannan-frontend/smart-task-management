import { useAuth } from "../hooks/useAuth";
import ProfileDropdown from "./ProfileDropdown";
import { useNavigate } from "react-router-dom";
export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log("user Clicked...")
    await logout();
    navigate("/login");
  };
  if (!user) return null;

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
      <div></div>
      <ProfileDropdown
        name={user.displayName || ""}
        email={user.email || ""}
        onLogout={handleLogout}
      />
    </header>
  );
}