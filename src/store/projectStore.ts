import { create } from 'zustand';
import { db } from '../db/database';
import type { Project } from '../types';

interface ProjectStore {
  projects: Project[];
  loading: boolean;
  load: () => Promise<void>;
  add: (name: string, color: string, icon: string) => Promise<Project>;
  update: (id: string, partial: Partial<Project>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  loading: true,

  load: async () => {
    const projects = await db.projects.toArray();
    set({ projects, loading: false });
  },

  add: async (name, color, icon) => {
    const project: Project = { id: crypto.randomUUID(), name, color, icon };
    await db.projects.put(project);
    set({ projects: [...get().projects, project] });
    return project;
  },

  update: async (id, partial) => {
    await db.projects.update(id, partial);
    set({
      projects: get().projects.map((p) => (p.id === id ? { ...p, ...partial } : p)),
    });
  },

  remove: async (id) => {
    await db.projects.delete(id);
    set({ projects: get().projects.filter((p) => p.id !== id) });
  },
}));
