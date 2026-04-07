
import { useState, useEffect, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import FullScreenState from "./FullScreenState";

interface ProtectedRouteProps {
  children: ReactNode;
  role?: "admin" | "user";
}
export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, loading, userData } = useAuth();
  const [showLoader, setShowLoader] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setShowLoader(false);
        setTimeout(() => setFadeIn(true), 50);
      }, 1000); 

      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (loading || showLoader) {
    return (
      <FullScreenState
        title="Verifying your session..."
        subtitle="Please wait while we securely log you in."
      />
    );
  }

   if (!user) return <Navigate to="/login" />;

  if (role && userData?.role !== role) {
    return <Navigate to="/unauthorized" />;
  }
  return (
    <div
      className={`transition-opacity duration-700 ease-in ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
      {children}
    </div>
  );;
}