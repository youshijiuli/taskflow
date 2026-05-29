import { supabase } from './client';
import { projectToSnake, projectFromSnake } from './mappers';
import type { Project } from '../types';

export async function fetchProjects(userId: string): Promise<{ data: Project[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) return { data: [], error: error.message };
    return { data: (data || []).map(projectFromSnake), error: null };
  } catch (err) {
    return { data: [], error: err instanceof Error ? err.message : '获取项目失败' };
  }
}

export async function createProject(project: Project): Promise<{ data: Project | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert(projectToSnake(project))
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: projectFromSnake(data), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : '创建项目失败' };
  }
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<{ data: Project | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update(projectToSnake(updates))
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: projectFromSnake(data), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : '更新项目失败' };
  }
}

export async function deleteProject(id: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) return { error: error.message };
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : '删除项目失败' };
  }
}
