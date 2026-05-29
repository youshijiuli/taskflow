import { create } from 'zustand';
import { supabase } from '../supabase/client';
import type { Objective, KeyResult } from '../types';
import { objectiveFromSnake, objectiveToSnake, keyResultFromSnake, keyResultToSnake } from '../supabase/mappers';
import { calculateObjectiveProgress } from '../supabase/goals';

interface GoalsStore {
  objectives: Objective[];
  krs: KeyResult[];
  loading: boolean;
  error: string | null;

  load: (userId: string) => Promise<void>;
  addObjective: (obj: Partial<Objective>) => Promise<Objective | null>;
  updateObjective: (id: string, updates: Partial<Objective>) => Promise<void>;
  removeObjective: (id: string) => Promise<void>;
  addKeyResult: (kr: Partial<KeyResult>) => Promise<KeyResult | null>;
  updateKeyResult: (id: string, updates: Partial<KeyResult>) => Promise<void>;
  removeKeyResult: (id: string) => Promise<void>;
  getKRsForObjective: (objectiveId: string) => KeyResult[];
  getTasksForKR: (krId: string) => number;
}

export const useGoalsStore = create<GoalsStore>((set, get) => ({
  objectives: [],
  krs: [],
  loading: true,
  error: null,

  load: async (userId: string) => {
    try {
      const { data: objs, error: objErr } = await supabase
        .from('objectives').select('*').eq('user_id', userId)
        .order('display_order', { ascending: true });

      if (objErr) { set({ error: objErr.message, loading: false }); return; }

      const { data: krs, error: krErr } = await supabase
        .from('key_results').select('*').order('display_order', { ascending: true });

      if (krErr) { set({ error: krErr.message, loading: false }); return; }

      const objectives = (objs || []).map(objectiveFromSnake);
      const krsList = (krs || []).map(keyResultFromSnake);

      // Recalculate objective progress from KRs
      const updatedObjectives = objectives.map((o) => {
        const objKRs = krsList.filter((kr) => kr.objectiveId === o.id);
        return { ...o, progress: calculateObjectiveProgress(objKRs) };
      });

      set({ objectives: updatedObjectives, krs: krsList, loading: false, error: null });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : '加载目标失败', loading: false });
    }
  },

  addObjective: async (obj) => {
    const newObj: Objective = {
      id: crypto.randomUUID(),
      userId: obj.userId || '',
      title: obj.title || '',
      description: obj.description || '',
      domain: obj.domain || 'other',
      status: obj.status || 'active',
      progress: 0,
      color: obj.color || '#8b5cf6',
      order: get().objectives.length,
      displayOrder: get().objectives.length,
      createdAt: Date.now(),
      completedAt: null,
    };

    const { error } = await supabase.from('objectives').insert(objectiveToSnake(newObj));
    if (error) { set({ error: error.message }); return null; }

    set({ objectives: [...get().objectives, newObj] });
    return newObj;
  },

  updateObjective: async (id, updates) => {
    const { error } = await supabase.from('objectives').update(objectiveToSnake(updates)).eq('id', id);
    if (error) { set({ error: error.message }); return; }
    set({ objectives: get().objectives.map((o) => o.id === id ? { ...o, ...updates } : o) });
  },

  removeObjective: async (id) => {
    const { error } = await supabase.from('objectives').delete().eq('id', id);
    if (error) { set({ error: error.message }); return; }
    set({ objectives: get().objectives.filter((o) => o.id !== id), krs: get().krs.filter((kr) => kr.objectiveId !== id) });
  },

  addKeyResult: async (kr) => {
    const newKR: KeyResult = {
      id: crypto.randomUUID(),
      objectiveId: kr.objectiveId || '',
      title: kr.title || '',
      targetValue: kr.targetValue || 100,
      currentValue: kr.currentValue || 0,
      unit: kr.unit || '%',
      progress: kr.progress || 0,
      status: kr.status || 'active',
      order: get().krs.length,
      displayOrder: get().krs.length,
    };

    const { error } = await supabase.from('key_results').insert(keyResultToSnake(newKR));
    if (error) { set({ error: error.message }); return null; }

    set({ krs: [...get().krs, newKR] });
    return newKR;
  },

  updateKeyResult: async (id, updates) => {
    const { error } = await supabase.from('key_results').update(keyResultToSnake(updates)).eq('id', id);
    if (error) { set({ error: error.message }); return; }
    set({ krs: get().krs.map((kr) => kr.id === id ? { ...kr, ...updates } : kr) });
  },

  removeKeyResult: async (id) => {
    const { error } = await supabase.from('key_results').delete().eq('id', id);
    if (error) { set({ error: error.message }); return; }
    set({ krs: get().krs.filter((kr) => kr.id !== id) });
  },

  getKRsForObjective: (objectiveId) => get().krs.filter((kr) => kr.objectiveId === objectiveId),
  getTasksForKR: () => 0, // Will be populated from task store in Phase 4
}));
