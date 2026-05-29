import { supabase } from './client';

export interface EfficiencyStats {
  completionRate: number;
  overdueRate: number;
  avgCompletionHours: number | null;
  createdCount: number;
  completedCount: number;
  backlogCount: number;
}

export async function getEfficiencyStats(
  userId: string,
  startDate: string,
  endDate: string
): Promise<{ data: EfficiencyStats | null; error: string | null }> {
  try {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (error) return { data: null, error: error.message };
    if (!tasks || tasks.length === 0) {
      return { data: { completionRate: 0, overdueRate: 0, avgCompletionHours: null, createdCount: 0, completedCount: 0, backlogCount: 0 }, error: null };
    }

    const all = tasks as unknown as Record<string, unknown>[];
    const completed = all.filter((t) => t.status === 'done');
    const overdue = all.filter((t) => t.status !== 'done' && t.due_date && new Date(t.due_date as string) < new Date());
    const backlog = all.filter((t) => t.status !== 'done');

    const completionRate = Math.round((completed.length / all.length) * 100);
    const overdueRate = all.length > 0 ? Math.round((overdue.length / all.length) * 100) : 0;

    let avgCompletionHours: number | null = null;
    if (completed.length > 0) {
      const durations = completed
        .filter((t) => t.created_at && t.completed_at)
        .map((t) => (new Date(t.completed_at as string).getTime() - new Date(t.created_at as string).getTime()) / (1000 * 60 * 60));
      if (durations.length > 0) {
        avgCompletionHours = Math.round(durations.reduce((a, b) => a + b, 0) / durations.length);
      }
    }

    return {
      data: {
        completionRate,
        overdueRate,
        avgCompletionHours,
        createdCount: all.length,
        completedCount: completed.length,
        backlogCount: backlog.length,
      },
      error: null,
    };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : '获取效率数据失败' };
  }
}

export async function getWeeklyTrend(
  userId: string,
  weeks: number = 6
): Promise<{ data: { week: string; created: number; completed: number }[]; error: string | null }> {
  try {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) return { data: [], error: error.message };

    const trend: { week: string; created: number; completed: number }[] = [];
    for (let i = weeks - 1; i >= 0; i--) {
      const start = new Date();
      start.setDate(start.getDate() - start.getDay() - i * 7);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      end.setHours(23, 59, 59, 999);

      const weekTasks = (tasks as unknown as Record<string, unknown>[]).filter((t) => {
        const ct = new Date(t.created_at as string).getTime();
        return ct >= start.getTime() && ct <= end.getTime();
      });

      trend.push({
        week: `${start.getMonth() + 1}/${start.getDate()}`,
        created: weekTasks.length,
        completed: weekTasks.filter((t) => t.status === 'done').length,
      });
    }
    return { data: trend, error: null };
  } catch (err) {
    return { data: [], error: err instanceof Error ? err.message : '获取趋势失败' };
  }
}

export async function getHeatmapData(
  userId: string,
  days: number = 365
): Promise<{ data: Record<string, number>; error: string | null }> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('completed_at')
      .eq('user_id', userId)
      .gte('completed_at', startDate.toISOString())
      .not('completed_at', 'is', null);

    if (error) return { data: {}, error: error.message };

    const map: Record<string, number> = {};
    (tasks || []).forEach((t: { completed_at: string }) => {
      const d = t.completed_at.slice(0, 10);
      map[d] = (map[d] ?? 0) + 1;
    });
    return { data: map, error: null };
  } catch (err) {
    return { data: {}, error: err instanceof Error ? err.message : '获取热力图数据失败' };
  }
}
