export interface Task {
  id?: string;
  title: string;
  description: string;

  assignedTo: string;
  assignedBy: string;

  // user sets: todo | in-progress | completed
  // admin confirms completed → done
  status: "todo" | "in-progress" | "completed" | "done";
  priority: "low" | "medium" | "high";

  createdAt: number;

  startDate?: string;
  endDate?: string;
  remarks?: string;
}
