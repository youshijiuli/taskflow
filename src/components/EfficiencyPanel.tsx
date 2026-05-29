import { useMemo } from 'react';
import type { Task } from '../types';

interface EfficiencyPanelProps {
  tasks: Task[];
  days: number;
}

export default function EfficiencyPanel({ tasks, days }: EfficiencyPanelProps) {
  const stats = useMemo(() => {
    const cutoff = Date.now() - days * 86400000;
    const periodTasks = days === Infinity ? tasks : tasks.filter((t) => t.createdAt >= cutoff);
    const total = periodTasks.length;
    const done = periodTasks.filter((t) => t.status === 'done').length;
    const overdue = periodTasks.filter(
      (t) => t.status !== 'done' && t.dueDate && t.dueDate < Date.now()
    ).length;

    const completionRate = total ? Math.round((done / total) * 100) : 0;
    const overdueRate = total ? Math.round((overdue / total) * 100) : 0;

    let avgHours: number | null = null;
    const doneWithTime = periodTasks.filter(
      (t) => t.status === 'done' && t.createdAt && t.completedAt && t.completedAt > t.createdAt
    );
    if (doneWithTime.length > 0) {
      avgHours = Math.round(
        doneWithTime.reduce((s, t) => s + (t.completedAt! - t.createdAt) / 3600000, 0) / doneWithTime.length
      );
    }

    const inProgress = periodTasks.filter((t) => t.status === 'in_progress').length;
    const todo = periodTasks.filter((t) => t.status === 'todo').length;

    return { completionRate, overdueRate, avgHours, total, done, inProgress, todo, overdue };
  }, [tasks, days]);

  const items = [
    { label: '完成率', value: `${stats.completionRate}%`, color: 'text-emerald-500' },
    { label: '逾期率', value: `${stats.overdueRate}%`, color: 'text-rose-500' },
    { label: '平均耗时', value: stats.avgHours ? `${stats.avgHours}h` : '-', color: 'text-blue-500' },
    { label: '已完成', value: stats.done, color: 'text-emerald-500' },
    { label: '进行中', value: stats.inProgress, color: 'text-blue-500' },
    { label: '待办+逾期', value: `${stats.todo}/${stats.overdue}`, color: 'text-amber-500' },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map(({ label, value, color }) => (
        <div key={label} className="bg-white rounded-2xl p-3 border border-gray-50 text-center">
          <div className={`text-xl font-extrabold ${color}`}>{value}</div>
          <div className="text-[10px] text-gray-400 font-semibold mt-0.5">{label}</div>
        </div>
      ))}
    </div>
  );
}
