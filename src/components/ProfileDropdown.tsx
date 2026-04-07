import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  name?: string;
  email?: string;
  onLogout: () => void;
};

export default function ProfileDropdown({ name, email, onLogout }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const initial =
    (
      name?.trim().charAt(0) ||
      email?.trim().charAt(0) ||
      "U"
    ).toUpperCase();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  
  return (
    <div className="relative" ref={ref}>
      {/* Avatar */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold"
      >
        {initial}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2">
          <div className="px-4 py-2 border-b text-sm">
            <p className="font-medium">{name || "User"}</p>
            <p className="text-gray-500 text-xs">{email}</p>
          </div>

          <button
            onClick={() => {
              navigate("/profile");
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
          >
            Profile
          </button>

          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-500 text-sm"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}