import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";
import { useUsers } from "../hooks/useUsers";
import { CheckCircle, Clock, AlertCircle, Users, ClipboardList, TrendingUp, BarChart3 } from "lucide-react";

// ─── Shared Stat Card ────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  sub?: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-white leading-tight">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Progress Bar ────────────────────────────────────────────────────────────
function ProgressBar({ value, total, color }: { value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 w-10 text-right">{pct}%</span>
    </div>
  );
}

// ─── Admin Dashboard ─────────────────────────────────────────────────────────
function AdminDashboard() {
  const { userData } = useAuth();
  const { tasks, loading: tasksLoading } = useTasks(userData);
  const { users, loading: usersLoading } = useUsers();

  const total = tasks.length;
  const todo = tasks.filter((t) => t.status === "todo").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const highPriority = tasks.filter((t) => t.priority === "high").length;

  // Top assignees
  const assigneeCounts: Record<string, number> = {};
  tasks.forEach((t) => {
    assigneeCounts[t.assignedTo] = (assigneeCounts[t.assignedTo] ?? 0) + 1;
  });
  const topAssignees = Object.entries(assigneeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // User map
  const userMap: Record<string, string> = {};
  users.forEach((u) => { userMap[u.email] = u.name; });

  // Recent tasks
  const recentTasks = [...tasks]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  if (tasksLoading || usersLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(n => (
          <div key={n} className="bg-white dark:bg-gray-800 rounded-2xl h-24 animate-pulse border border-gray-100 dark:border-gray-700" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Welcome back, {userData?.name} 👋
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Here's your team's task overview.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Tasks" value={total} icon={ClipboardList} color="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400" />
        <StatCard label="In Progress" value={inProgress} icon={TrendingUp} color="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" />
        <StatCard label="Completed" value={completed} icon={CheckCircle} color="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" />
        <StatCard label="Team Members" value={users.length} icon={Users} color="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Task Status Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <BarChart3 size={16} className="text-indigo-500" />
              Task Status
            </h2>
            <span className="text-xs text-gray-400">{total} total</span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">To Do</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">{todo}</span>
              </div>
              <ProgressBar value={todo} total={total} color="bg-gray-400" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">In Progress</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">{inProgress}</span>
              </div>
              <ProgressBar value={inProgress} total={total} color="bg-blue-500" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Completed</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">{completed}</span>
              </div>
              <ProgressBar value={completed} total={total} color="bg-emerald-500" />
            </div>
            {highPriority > 0 && (
              <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center gap-2">
                <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                  {highPriority} high priority task{highPriority > 1 ? "s" : ""} need attention
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Top Assignees */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 space-y-4">
          <h2 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <Users size={16} className="text-purple-500" />
            Top Assignees
          </h2>
          {topAssignees.length === 0 ? (
            <p className="text-sm text-gray-400">No tasks assigned yet.</p>
          ) : (
            <div className="space-y-3">
              {topAssignees.map(([email, count]) => (
                <div key={email} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {(userMap[email] ?? email).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                      {userMap[email] ?? email}
                    </p>
                    <ProgressBar value={count} total={total} color="bg-indigo-500" />
                  </div>
                  <span className="text-xs font-semibold text-gray-500 flex-shrink-0">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <Clock size={16} className="text-amber-500" />
          Recently Created Tasks
        </h2>
        {recentTasks.length === 0 ? (
          <p className="text-sm text-gray-400">No tasks yet.</p>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-700">
            {recentTasks.map((task) => (
              <div key={task.id} className="py-3 flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    task.priority === "high"
                      ? "bg-red-500"
                      : task.priority === "medium"
                      ? "bg-amber-400"
                      : "bg-emerald-400"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {userMap[task.assignedTo] ?? task.assignedTo}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide flex-shrink-0 ${
                    task.status === "completed"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                      : task.status === "in-progress"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── User Dashboard ───────────────────────────────────────────────────────────
function UserDashboard() {
  const { userData } = useAuth();
  const { tasks, loading } = useTasks(userData);

  const total = tasks.length;
  const todo = tasks.filter((t) => t.status === "todo").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const overdue = tasks.filter(
    (t) => t.endDate && new Date(t.endDate) < new Date() && t.status !== "completed"
  ).length;

  const upcomingTasks = tasks
    .filter((t) => t.status !== "completed")
    .sort((a, b) => {
      if (!a.endDate) return 1;
      if (!b.endDate) return -1;
      return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
    })
    .slice(0, 5);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1,2,3,4].map(n => (
          <div key={n} className="bg-white dark:bg-gray-800 rounded-2xl h-24 animate-pulse border border-gray-100 dark:border-gray-700" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Welcome back, {userData?.name} 👋
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Here's a summary of your tasks.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="My Tasks" value={total} icon={ClipboardList} color="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400" />
        <StatCard label="To Do" value={todo} icon={Clock} color="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400" />
        <StatCard label="In Progress" value={inProgress} icon={TrendingUp} color="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" />
        <StatCard label="Completed" value={completed} icon={CheckCircle} color="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* My Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 space-y-4">
          <h2 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <BarChart3 size={16} className="text-indigo-500" />
            My Progress
          </h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Completion Rate</span>
                <span className="font-medium">{total > 0 ? Math.round((completed / total) * 100) : 0}%</span>
              </div>
              <ProgressBar value={completed} total={total} color="bg-emerald-500" />
            </div>
          </div>
          {overdue > 0 && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center gap-2">
              <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
              <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                {overdue} task{overdue > 1 ? "s are" : " is"} overdue
              </span>
            </div>
          )}
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Clock size={16} className="text-amber-500" />
            Upcoming Deadlines
          </h2>
          {upcomingTasks.length === 0 ? (
            <p className="text-sm text-gray-400">No upcoming tasks.</p>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-gray-700">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="py-3 flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      task.priority === "high" ? "bg-red-500" : task.priority === "medium" ? "bg-amber-400" : "bg-emerald-400"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{task.title}</p>
                    {task.endDate && (
                      <p className="text-xs text-gray-400">Due: {task.endDate}</p>
                    )}
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase flex-shrink-0 ${
                    task.status === "in-progress"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { isAdmin, userData } = useAuth();
  if (!userData) return <div className="p-8 text-gray-400">Loading...</div>;
  return isAdmin ? <AdminDashboard /> : <UserDashboard />;
}
