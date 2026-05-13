import Dexie, { type Table } from 'dexie';
import type { Task, Project, DailyCompletion } from '../types';

export class AppDatabase extends Dexie {
  tasks!: Table<Task, string>;
  projects!: Table<Project, string>;
  dailyCompletions!: Table<DailyCompletion, string>;

  constructor() {
    super('TaskFlowDB');
    this.version(1).stores({
      tasks: 'id, status, projectId, priority, dueDate, createdAt, completedAt',
      projects: 'id',
      dailyCompletions: 'date',
    });
  }
}

export const db = new AppDatabase();

export async function resetDatabase() {
  await db.tasks.clear();
  await db.projects.clear();
  await db.dailyCompletions.clear();
}
