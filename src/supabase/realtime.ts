import { supabase } from './client';
import { taskFromSnake, projectFromSnake } from './mappers';
import type { Task, Project } from '../types';

type TaskCallback = (tasks: Task[]) => void;
type ProjectCallback = (projects: Project[]) => void;

export function subscribeToTasks(userId: string, currentTasks: Task[], onUpdate: TaskCallback) {
  const channel = supabase
    .channel('tasks-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'tasks', filter: `user_id=eq.${userId}` },
      (payload) => {
        const updated = [...currentTasks];
        const idx = updated.findIndex((t) => t.id === (payload.new as Record<string, unknown>)?.id);

        if (payload.eventType === 'INSERT') {
          if (idx === -1) {
            updated.unshift(taskFromSnake(payload.new as Record<string, unknown>));
          }
        } else if (payload.eventType === 'UPDATE') {
          if (idx !== -1) {
            updated[idx] = taskFromSnake(payload.new as Record<string, unknown>);
          }
        } else if (payload.eventType === 'DELETE') {
          if (idx !== -1) {
            updated.splice(idx, 1);
          }
        }
        onUpdate(updated);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToProjects(userId: string, currentProjects: Project[], onUpdate: ProjectCallback) {
  const channel = supabase
    .channel('projects-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'projects', filter: `user_id=eq.${userId}` },
      (payload) => {
        const updated = [...currentProjects];
        const idx = updated.findIndex((p) => p.id === (payload.new as Record<string, unknown>)?.id);

        if (payload.eventType === 'INSERT') {
          if (idx === -1) updated.push(projectFromSnake(payload.new as Record<string, unknown>));
        } else if (payload.eventType === 'UPDATE') {
          if (idx !== -1) updated[idx] = projectFromSnake(payload.new as Record<string, unknown>);
        } else if (payload.eventType === 'DELETE') {
          if (idx !== -1) updated.splice(idx, 1);
        }
        onUpdate(updated);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
