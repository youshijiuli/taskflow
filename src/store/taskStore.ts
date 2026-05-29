import { create } from 'zustand';
import { db } from '../db/database';
import type { Task } from '../types';
import { today } from '../utils/date';

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  load: () => Promise<void>;
  add: (t: Omit<Task, 'id' | 'createdAt' | 'kanbanOrder'>) => Promise<Task>;
  update: (id: string, partial: Partial<Task>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  uncompleteTask: (id: string) => Promise<void>;
  getByStatus: (status: Task['status']) => Task[];
  getByProject: (projectId: string) => Task[];
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: true,

  load: async () => {
    const tasks = await db.tasks.orderBy('createdAt').reverse().toArray();
    set({ tasks, loading: false });
  },

  add: async (data) => {
    const maxOrder = get().tasks.reduce((m, t) => Math.max(m, t.kanbanOrder), 0);
    const task: Task = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      kanbanOrder: maxOrder + 1,
    };
    await db.tasks.put(task);
    set({ tasks: [task, ...get().tasks] });
    return task;
  },

  update: async (id, partial) => {
    await db.tasks.update(id, partial);
    set({
      tasks: get().tasks.map((t) => (t.id === id ? { ...t, ...partial } : t)),
    });
  },

  remove: async (id) => {
    await db.tasks.delete(id);
    set({ tasks: get().tasks.filter((t) => t.id !== id) });
  },

  completeTask: async (id) => {
    const now = Date.now();
    await db.tasks.update(id, { status: 'done', completedAt: now, progress: 100 });

    const date = today();
    const existing = await db.dailyCompletions.get(date);
    await db.dailyCompletions.put({
      date,
      count: (existing?.count ?? 0) + 1,
    });

    set({
      tasks: get().tasks.map((t) =>
        t.id === id ? { ...t, status: 'done' as const, completedAt: now, progress: 100 } : t
      ),
    });
  },

  uncompleteTask: async (id) => {
    await db.tasks.update(id, { status: 'todo', completedAt: null, progress: 0 });
    set({
      tasks: get().tasks.map((t) =>
        t.id === id
          ? { ...t, status: 'todo' as const, completedAt: null, progress: 0 }
          : t
      ),
    });

    const date = today();
    const existing = await db.dailyCompletions.get(date);
    if (existing && existing.count > 0) {
      await db.dailyCompletions.put({ date, count: existing.count - 1 });
    }
  },

  getByStatus: (status) => get().tasks.filter((t) => t.status === status),
  getByProject: (projectId) => get().tasks.filter((t) => t.projectId === projectId),
}));

