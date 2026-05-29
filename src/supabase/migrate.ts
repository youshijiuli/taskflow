import { db } from '../db/database';
import { createTask, fetchTasks } from './tasks';
import { createProject } from './projects';
import type { Task, Project } from '../types';

export interface MigrationResult {
  success: boolean;
  tasksMigrated: number;
  projectsMigrated: number;
  errors: string[];
}

const BATCH_SIZE = 25;

export async function migrateData(userId: string, onProgress?: (current: number, total: number) => void): Promise<MigrationResult> {
  const errors: string[] = [];
  let projectsMigrated = 0;
  let tasksMigrated = 0;

  try {
    // Step 1: Check if already migrated
    const { data: existingTasks } = await fetchTasks(userId);
    if (existingTasks && existingTasks.length > 0) {
      return { success: true, tasksMigrated: 0, projectsMigrated: 0, errors: ['已有数据，跳过迁移'] };
    }

    // Step 2: Read from Dexie
    const dexieProjects = await db.projects.toArray();
    const dexieTasks = await db.tasks.toArray();

    const totalItems = dexieProjects.length + dexieTasks.length;
    let processed = 0;

    // Step 3: Migrate projects first (referential integrity)
    for (const p of dexieProjects) {
      const project: Project = {
        id: p.id,
        userId,
        name: p.name,
        color: p.color,
        icon: p.icon,
        domain: null,
      };
      const { error } = await createProject(project);
      if (error) {
        errors.push(`项目 "${p.name}" 迁移失败: ${error}`);
      } else {
        projectsMigrated++;
      }
      processed++;
      onProgress?.(processed, totalItems);
    }

    // Step 4: Migrate tasks in batches
    for (let i = 0; i < dexieTasks.length; i += BATCH_SIZE) {
      const batch = dexieTasks.slice(i, i + BATCH_SIZE);
      for (const t of batch) {
        // Map old task to new format
        const oldTask = t as Task & { reminderTime?: number | null };
        const task: Task = {
          id: oldTask.id,
          userId,
          title: oldTask.title,
          description: oldTask.description || '',
          priority: oldTask.priority || 'medium',
          status: oldTask.status || 'todo',
          projectId: oldTask.projectId || '',
          keyResultId: null,
          quadrant: null,
          dueDate: oldTask.dueDate,
          estimatedHours: oldTask.estimatedHours ?? null,
          spentHours: oldTask.spentHours ?? null,
          progress: oldTask.progress || 0,
          tags: oldTask.tags || [],
          kanbanOrder: oldTask.kanbanOrder || 0,
          createdAt: oldTask.createdAt || Date.now(),
          completedAt: oldTask.completedAt || null,
        };

        // Check idempotency: skip if already exists in Supabase
        const { data: existing } = await fetchTasks(userId);
        if (existing?.some((et) => et.id === task.id)) {
          processed++;
          onProgress?.(processed, totalItems);
          continue;
        }

        const { error } = await createTask(task);
        if (error) {
          errors.push(`任务 "${task.title}" 迁移失败: ${error}`);
        } else {
          tasksMigrated++;
        }
        processed++;
        onProgress?.(processed, totalItems);
      }
    }

    return {
      success: errors.length === 0,
      tasksMigrated,
      projectsMigrated,
      errors,
    };
  } catch (err) {
    errors.push(err instanceof Error ? err.message : '迁移过程发生未知错误');
    return { success: false, tasksMigrated, projectsMigrated, errors };
  }
}

export function getDexieStats(): Promise<{ tasks: number; projects: number }> {
  return db.tasks.count().then(async (tasks) => {
    const projects = await db.projects.count();
    return { tasks, projects };
  });
}
