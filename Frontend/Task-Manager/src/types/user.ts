export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  profileImageUrl: string;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
}
