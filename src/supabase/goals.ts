import { supabase } from './client';
import { objectiveToSnake, objectiveFromSnake, keyResultToSnake, keyResultFromSnake } from './mappers';
import type { Objective, KeyResult } from '../types';

// ── Objectives ──

export async function fetchObjectives(userId: string): Promise<{ data: Objective[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('objectives')
      .select('*')
      .eq('user_id', userId)
      .order('display_order', { ascending: true });

    if (error) return { data: [], error: error.message };
    return { data: (data || []).map(objectiveFromSnake), error: null };
  } catch (err) {
    return { data: [], error: err instanceof Error ? err.message : '获取目标失败' };
  }
}

export async function createObjective(obj: Objective): Promise<{ data: Objective | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('objectives')
      .insert(objectiveToSnake(obj))
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: objectiveFromSnake(data), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : '创建目标失败' };
  }
}

export async function updateObjective(id: string, updates: Partial<Objective>): Promise<{ data: Objective | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('objectives')
      .update(objectiveToSnake(updates))
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: objectiveFromSnake(data), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : '更新目标失败' };
  }
}

export async function deleteObjective(id: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.from('objectives').delete().eq('id', id);
    if (error) return { error: error.message };
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : '删除目标失败' };
  }
}

// ── Key Results ──

export async function fetchKeyResults(objectiveId: string): Promise<{ data: KeyResult[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('key_results')
      .select('*')
      .eq('objective_id', objectiveId)
      .order('display_order', { ascending: true });

    if (error) return { data: [], error: error.message };
    return { data: (data || []).map(keyResultFromSnake), error: null };
  } catch (err) {
    return { data: [], error: err instanceof Error ? err.message : '获取关键结果失败' };
  }
}

export async function createKeyResult(kr: KeyResult): Promise<{ data: KeyResult | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('key_results')
      .insert(keyResultToSnake(kr))
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: keyResultFromSnake(data), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : '创建关键结果失败' };
  }
}

export async function updateKeyResult(id: string, updates: Partial<KeyResult>): Promise<{ data: KeyResult | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('key_results')
      .update(keyResultToSnake(updates))
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: keyResultFromSnake(data), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : '更新关键结果失败' };
  }
}

export async function deleteKeyResult(id: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.from('key_results').delete().eq('id', id);
    if (error) return { error: error.message };
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : '删除关键结果失败' };
  }
}

// ── Progress Calculation ──

export function calculateObjectiveProgress(krs: KeyResult[]): number {
  if (krs.length === 0) return 0;
  const total = krs.reduce((sum, kr) => sum + kr.progress, 0);
  return Math.round(total / krs.length);
}

export function calculateKRProgress(currentValue: number, targetValue: number): number {
  if (targetValue === 0) return 0;
  return Math.min(100, Math.round((currentValue / targetValue) * 100));
}
