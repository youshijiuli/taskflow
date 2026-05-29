import type { Task, Project, Objective, KeyResult } from '../types';

// ── Task ──

export function taskToSnake(t: Partial<Task>): Record<string, unknown> {
  return {
    id: t.id,
    user_id: t.userId,
    title: t.title,
    description: t.description,
    priority: t.priority,
    status: t.status,
    project_id: t.projectId,
    key_result_id: t.keyResultId,
    quadrant: t.quadrant,
    due_date: t.dueDate ? new Date(t.dueDate).toISOString() : null,
    estimated_hours: t.estimatedHours ?? null,
    spent_hours: t.spentHours ?? null,
    progress: t.progress,
    tags: t.tags,
    kanban_order: t.kanbanOrder,
    created_at: t.createdAt ? new Date(t.createdAt).toISOString() : undefined,
    completed_at: t.completedAt ? new Date(t.completedAt).toISOString() : null,
  };
}

export function taskFromSnake(row: Record<string, unknown>): Task {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    title: row.title as string,
    description: (row.description as string) || '',
    priority: (row.priority as Task['priority']) || 'medium',
    status: (row.status as Task['status']) || 'todo',
    projectId: (row.project_id as string) || '',
    keyResultId: (row.key_result_id as string) || null,
    quadrant: (row.quadrant as Task['quadrant']) || null,
    dueDate: row.due_date ? new Date(row.due_date as string).getTime() : null,
    estimatedHours: row.estimated_hours as number | null,
    spentHours: row.spent_hours as number | null,
    progress: (row.progress as number) || 0,
    tags: (row.tags as string[]) || [],
    kanbanOrder: (row.kanban_order as number) || 0,
    createdAt: row.created_at ? new Date(row.created_at as string).getTime() : Date.now(),
    completedAt: row.completed_at ? new Date(row.completed_at as string).getTime() : null,
  };
}

// ── Project ──

export function projectToSnake(p: Partial<Project>): Record<string, unknown> {
  return {
    id: p.id,
    user_id: p.userId,
    name: p.name,
    color: p.color,
    icon: p.icon,
    domain: p.domain,
  };
}

export function projectFromSnake(row: Record<string, unknown>): Project & { userId: string; domain: string | null } {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    name: row.name as string,
    color: (row.color as string) || '#6366f1',
    icon: (row.icon as string) || '📁',
    domain: (row.domain as Project['domain']) || null,
  };
}

// ── Objective ──

export function objectiveToSnake(o: Partial<Objective>): Record<string, unknown> {
  return {
    id: o.id,
    user_id: o.userId,
    title: o.title,
    description: o.description,
    domain: o.domain,
    status: o.status,
    progress: o.progress,
    color: o.color,
    display_order: o.displayOrder ?? o.order,
    created_at: o.createdAt ? new Date(o.createdAt).toISOString() : undefined,
    completed_at: o.completedAt ? new Date(o.completedAt).toISOString() : null,
  };
}

export function objectiveFromSnake(row: Record<string, unknown>): Objective {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    title: row.title as string,
    description: (row.description as string) || '',
    domain: (row.domain as Objective['domain']) || 'other',
    status: (row.status as Objective['status']) || 'active',
    progress: (row.progress as number) || 0,
    color: (row.color as string) || '#6366f1',
    order: (row.display_order as number) || 0,
    createdAt: row.created_at ? new Date(row.created_at as string).getTime() : Date.now(),
    completedAt: row.completed_at ? new Date(row.completed_at as string).getTime() : null,
    displayOrder: (row.display_order as number) || 0,
  };
}

// ── KeyResult ──

export function keyResultToSnake(kr: Partial<KeyResult>): Record<string, unknown> {
  return {
    id: kr.id,
    objective_id: kr.objectiveId,
    title: kr.title,
    target_value: kr.targetValue,
    current_value: kr.currentValue,
    unit: kr.unit,
    progress: kr.progress,
    status: kr.status,
    display_order: kr.displayOrder ?? kr.order,
  };
}

export function keyResultFromSnake(row: Record<string, unknown>): KeyResult {
  return {
    id: row.id as string,
    objectiveId: row.objective_id as string,
    title: row.title as string,
    targetValue: (row.target_value as number) || 100,
    currentValue: (row.current_value as number) || 0,
    unit: (row.unit as string) || '%',
    progress: (row.progress as number) || 0,
    status: (row.status as KeyResult['status']) || 'active',
    order: (row.display_order as number) || 0,
    displayOrder: (row.display_order as number) || 0,
  };
}
