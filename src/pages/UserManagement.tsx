import { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";
import toast from "react-hot-toast";
import {
  Users, ShieldCheck, User, Trash2, ChevronDown,
  Search, ShieldOff, ChevronLeft, ChevronRight,
} from "lucide-react";
import type { UserData } from "../types/auth";
import { ConfirmModal } from "./ConfirmModal";

const PAGE_SIZE = 8;

interface RoleConfirm { uid: string; name: string; currentRole: "admin" | "user"; newRole: "admin" | "user" }

export default function UserManagement() {
  const { userData }                              = useAuth();
  const { users, loading, updateRole, deleteUser } = useUsers();
  const { tasks }                                 = useTasks(userData);

  const [search,        setSearch]        = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [roleConfirm,   setRoleConfirm]   = useState<RoleConfirm | null>(null);
  const [page,          setPage]          = useState(1);

  // Non-admin guard
  if (!userData || userData.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <ShieldOff size={28} className="text-gray-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">Access Restricted</h2>
        <p className="text-sm text-gray-400 max-w-xs">This section is only available to administrators.</p>
      </div>
    );
  }

  // Derived counts
  // Members = users whose role is "user" (stored as "user" in Firestore, displayed as "Member" in UI)
  const adminCount  = users.filter((u) => u.role === "admin").length;
  const memberCount = users.filter((u) => u.role === "user").length;

  const filtered    = users.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) ||
           u.email.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage    = Math.min(page, totalPages);
  const paginated   = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const getTaskCount = (email: string) => tasks.filter((t) => t.assignedTo === email).length;

  // Handlers
  const handleRoleChangeRequest = (u: UserData, newRole: "admin" | "user") => {
    if (u.role === newRole) return;
    setRoleConfirm({ uid: u.uid, name: u.name, currentRole: u.role, newRole });
  };

  const confirmRoleChange = async () => {
    if (!roleConfirm) return;
    try {
      await updateRole(roleConfirm.uid, roleConfirm.newRole);
      toast.success(
        `${roleConfirm.name} is now ${roleConfirm.newRole === "admin" ? "an Admin" : "a Member"}`
      );
    } catch {
      toast.error("Failed to update role");
    } finally {
      setRoleConfirm(null);
    }
  };

  const handleDelete = async (uid: string) => {
    try {
      await deleteUser(uid);
      toast.success("User removed");
      setConfirmDelete(null);
    } catch {
      toast.error("Failed to remove user");
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">User Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage team members and their roles.</p>
        </div>

        {/* Stats
            ─────────────────────────────────────────────────────────────
            Members count = users where role === "user" (Firestore value).
            The role is stored as "user" in Firestore and shown as "Member"
            in the UI for clarity. So if you have 3 users with role "user"
            the Members card shows 3.
            ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Users", value: users.length, icon: Users,      color: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400" },
            { label: "Admins",      value: adminCount,   icon: ShieldCheck, color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" },
            { label: "Members",     value: memberCount,  icon: User,        color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" },
          ].map((s) => (
            <div key={s.label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
                <s.icon size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">{s.label}</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="divide-y divide-gray-50 dark:divide-gray-700">
              {[1,2,3].map((n) => (
                <div key={n} className="p-4 flex items-center gap-4 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                    <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <Users size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No users found.</p>
            </div>
          ) : (
            <>
              {/* Table header */}
              <div className="grid grid-cols-12 px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-gray-50 dark:bg-gray-700/30">
                <div className="col-span-5">User</div>
                <div className="col-span-2 text-center">Tasks</div>
                <div className="col-span-3 text-center">Role</div>
                <div className="col-span-2 text-right">Action</div>
              </div>

              <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {paginated.map((u) => (
                  <div key={u.uid} className="grid grid-cols-12 px-5 py-3.5 items-center hover:bg-gray-50 dark:hover:bg-gray-700/20 transition">
                    {/* User info */}
                    <div className="col-span-5 flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                        u.role === "admin"
                          ? "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300"
                          : "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300"
                      }`}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white truncate flex items-center gap-1.5">
                          {u.name}
                          {u.uid === userData.uid && (
                            <span className="text-[10px] font-medium text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-1.5 py-0.5 rounded-full">You</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{u.email}</p>
                      </div>
                    </div>

                    {/* Task count badge */}
                    <div className="col-span-2 text-center">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                        getTaskCount(u.email) > 0
                          ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-400"
                      }`}>
                        {getTaskCount(u.email)}
                      </span>
                    </div>

                    {/* Role selector
                        FIX: The select value stays at u.role (current DB value).
                        When admin changes it, we capture the intent in roleConfirm
                        and only update DB after confirmation. The select reverts
                        visually because u.role hasn't changed yet — this is correct. */}
                    <div className="col-span-3 flex justify-center">
                      {u.uid === userData.uid ? (
                        <span className="text-xs px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-semibold capitalize">
                          {u.role === "user" ? "Member" : "Admin"}
                        </span>
                      ) : (
                        <div className="relative">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChangeRequest(u, e.target.value as "admin" | "user")}
                            className="text-xs pl-3 pr-7 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                          >
                            <option value="user">Member</option>
                            <option value="admin">Admin</option>
                          </select>
                          <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      )}
                    </div>

                    {/* Delete */}
                    <div className="col-span-2 flex justify-end">
                      {u.uid !== userData.uid && (
                        confirmDelete === u.uid ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleDelete(u.uid)}
                              className="text-[11px] px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition">Yes</button>
                            <button onClick={() => setConfirmDelete(null)}
                              className="text-[11px] px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg transition">No</button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmDelete(u.uid)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition">
                            <Trash2 size={14} />
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 text-xs">
              Showing {((safePage-1)*PAGE_SIZE)+1}–{Math.min(safePage*PAGE_SIZE, filtered.length)} of {filtered.length} users
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p-1))} disabled={safePage === 1}
                className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 transition">
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i+1).map((n) => (
                <button key={n} onClick={() => setPage(n)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${n===safePage?"bg-indigo-600 text-white":"border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
                  {n}
                </button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p+1))} disabled={safePage === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 transition">
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Role Change Confirmation — uses reusable ConfirmModal */}
      <ConfirmModal
        isOpen={!!roleConfirm}
        title="Change User Role?"
        message={roleConfirm
          ? `Change ${roleConfirm.name}'s role from ${roleConfirm.currentRole === "user" ? "Member" : "Admin"} to ${roleConfirm.newRole === "admin" ? "Admin" : "Member"}?${roleConfirm.newRole === "admin" ? "\n\n⚠ Admins can manage all tasks and users." : ""}`
          : ""}
        confirmLabel="Yes, Change Role"
        confirmClass="bg-indigo-600 hover:bg-indigo-700 text-white"
        onCancel={() => setRoleConfirm(null)}
        onConfirm={confirmRoleChange}
      />
    </>
  );
}
