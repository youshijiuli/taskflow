import { create } from 'zustand';
import { supabase } from '../supabase/client';
import { taskToSnake, taskFromSnake } from '../supabase/mappers';
import type { Task } from '../types';

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  load: (userId: string) => Promise<void>;
  add: (data: Omit<Task, 'id' | 'createdAt' | 'kanbanOrder'>) => Promise<Task | null>;
  update: (id: string, partial: Partial<Task>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  uncompleteTask: (id: string) => Promise<void>;
  getByStatus: (status: Task['status']) => Task[];
  getByProject: (projectId: string) => Task[];
}

async function getUserId(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id || '';
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: true,
  error: null,

  load: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) { set({ error: error.message, loading: false }); return; }
      set({ tasks: (data || []).map(taskFromSnake), loading: false, error: null });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : '加载任务失败', loading: false });
    }
  },

  add: async (data) => {
    const userId = await getUserId();
    const maxOrder = get().tasks.reduce((m, t) => Math.max(m, t.kanbanOrder), 0);
    const task: Task = {
      ...data,
      id: crypto.randomUUID(),
      userId,
      kanbanOrder: maxOrder + 1,
      createdAt: Date.now(),
    };

    // Optimistic: update UI immediately
    set({ tasks: [task, ...get().tasks] });

    // Persist to Supabase
    const { error } = await supabase.from('tasks').insert(taskToSnake(task));
    if (error) {
      // Rollback on failure
      set({ tasks: get().tasks.filter((t) => t.id !== task.id), error: error.message });
      return null;
    }
    return task;
  },

  update: async (id, partial) => {
    // Optimistic
    const prev = get().tasks;
    set({ tasks: prev.map((t) => (t.id === id ? { ...t, ...partial } : t)) });

    const { error } = await supabase.from('tasks').update(taskToSnake(partial)).eq('id', id);
    if (error) {
      set({ tasks: prev, error: error.message }); // rollback
    }
  },

  remove: async (id) => {
    const prev = get().tasks;
    set({ tasks: prev.filter((t) => t.id !== id) });

    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) {
      set({ tasks: prev, error: error.message });
    }
  },

  completeTask: async (id) => {
    const now = Date.now();
    await get().update(id, { status: 'done', completedAt: now, progress: 100 });
  },

  uncompleteTask: async (id) => {
    await get().update(id, { status: 'todo', completedAt: null, progress: 0 });
  },

  getByStatus: (status) => get().tasks.filter((t) => t.status === status),
  getByProject: (projectId) => get().tasks.filter((t) => t.projectId === projectId),
}));
