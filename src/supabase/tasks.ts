import { supabase } from './client';
import { taskToSnake, taskFromSnake } from './mappers';
import type { Task } from '../types';

export async function fetchTasks(userId: string): Promise<{ data: Task[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) return { data: [], error: error.message };
    return { data: (data || []).map(taskFromSnake), error: null };
  } catch (err) {
    return { data: [], error: err instanceof Error ? err.message : '获取任务失败' };
  }
}

export async function createTask(task: Task): Promise<{ data: Task | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert(taskToSnake(task))
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: taskFromSnake(data), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : '创建任务失败' };
  }
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<{ data: Task | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .update(taskToSnake(updates))
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: taskFromSnake(data), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : '更新任务失败' };
  }
}

export async function deleteTask(id: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) return { error: error.message };
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : '删除任务失败' };
  }
}

export async function completeTask(id: string): Promise<{ data: Task | null; error: string | null }> {
  return updateTask(id, { completedAt: Date.now(), status: 'done', progress: 100 });
}
