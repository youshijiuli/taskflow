export type Priority = 'urgent' | 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type Quadrant = 'q1' | 'q2' | 'q3' | 'q4';
export type Domain = 'work' | 'life' | 'study' | 'other';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  projectId: string;
  keyResultId: string | null;
  quadrant: Quadrant | null;
  dueDate: number | null;
  estimatedHours: number | null;
  spentHours: number | null;
  progress: number;
  tags: string[];
  kanbanOrder: number;
  createdAt: number;
  completedAt: number | null;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  color: string;
  icon: string;
  domain: Domain | null;
}

export interface Objective {
  id: string;
  userId: string;
  title: string;
  description: string;
  domain: Domain;
  status: 'active' | 'completed' | 'archived';
  progress: number;
  color: string;
  order: number;
  displayOrder: number;
  createdAt: number;
  completedAt: number | null;
}

export interface KeyResult {
  id: string;
  objectiveId: string;
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  progress: number;
  status: 'active' | 'completed';
  order: number;
  displayOrder: number;
}

export interface DailyCompletion {
  date: string;
  count: number;
}
