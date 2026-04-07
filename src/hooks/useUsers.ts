import { useEffect, useState, useCallback } from "react";
import { userService } from "../services/userService";
import type { UserData } from "../types/auth";

export const useUsers = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const updateRole = async (uid: string, role: "admin" | "user") => {
    await userService.updateRole(uid, role);
    await loadUsers();
  };

  const deleteUser = async (uid: string) => {
    await userService.delete(uid);
    await loadUsers();
  };

  return { users, loading, error, updateRole, deleteUser, refresh: loadUsers };
};
