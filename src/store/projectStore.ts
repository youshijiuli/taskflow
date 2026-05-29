import { create } from 'zustand';
import { supabase } from '../supabase/client';
import { projectToSnake, projectFromSnake } from '../supabase/mappers';
import type { Project } from '../types';

interface ProjectStore {
  projects: Project[];
  loading: boolean;
  error: string | null;
  load: (userId: string) => Promise<void>;
  add: (name: string, color: string, icon: string) => Promise<Project | null>;
  update: (id: string, partial: Partial<Project>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

function getUserId(): string | null {
  return (window as unknown as { __supabaseUserId?: string }).__supabaseUserId || null;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  loading: true,
  error: null,

  load: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) { set({ error: error.message, loading: false }); return; }
      set({ projects: (data || []).map(projectFromSnake), loading: false, error: null });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : '加载项目失败', loading: false });
    }
  },

  add: async (name, color, icon) => {
    const userId = getUserId() || '';
    const project: Project = { id: crypto.randomUUID(), userId, name, color, icon, domain: null };

    // Optimistic
    set({ projects: [...get().projects, project] });

    const { error } = await supabase.from('projects').insert(projectToSnake(project));
    if (error) {
      set({ projects: get().projects.filter((p) => p.id !== project.id), error: error.message });
      return null;
    }
    return project;
  },

  update: async (id, partial) => {
    const prev = get().projects;
    set({ projects: prev.map((p) => (p.id === id ? { ...p, ...partial } : p)) });

    const { error } = await supabase.from('projects').update(projectToSnake(partial)).eq('id', id);
    if (error) set({ projects: prev, error: error.message });
  },

  remove: async (id) => {
    const prev = get().projects;
    set({ projects: prev.filter((p) => p.id !== id) });

    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) set({ projects: prev, error: error.message });
  },
}));
