export type Priority = 'urgent' | 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  projectId: string;
  dueDate: number | null;
  reminderTime: number | null;
  estimatedHours: number | null;
  spentHours: number | null;
  progress: number;
  tags: string[];
  createdAt: number;
  completedAt: number | null;
  kanbanOrder: number;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface DailyCompletion {
  date: string;
  count: number;
}
