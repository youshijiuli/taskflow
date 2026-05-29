import { useMemo } from 'react';
import type { Task } from '../types';

function getDateStr(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function colorFor(count: number): string {
  if (count === 0) return 'bg-gray-100';
  if (count === 1) return 'bg-emerald-300';
  if (count <= 3) return 'bg-emerald-400';
  if (count <= 6) return 'bg-emerald-500';
  return 'bg-emerald-600';
}

export default function Heatmap({ tasks }: { tasks: Task[] }) {
  const dayCounts = useMemo(() => {
    const map: Record<string, number> = {};
    tasks.forEach((t) => {
      if (t.completedAt) {
        const d = new Date(t.completedAt).toISOString().slice(0, 10);
        map[d] = (map[d] ?? 0) + 1;
      }
    });
    return map;
  }, [tasks]);

  const weeks = useMemo(() => {
    const all: { date: string; count: number; dayOfWeek: number }[] = [];
    for (let i = 90; i >= 0; i--) {
      const date = getDateStr(i);
      all.push({ date, count: dayCounts[date] ?? 0, dayOfWeek: new Date(date).getDay() });
    }
    const result: typeof all[] = [];
    let cur: typeof all = [];
    all.forEach((d) => {
      cur.push(d);
      if (d.dayOfWeek === 6) { result.push(cur); cur = []; }
    });
    if (cur.length) result.push(cur);
    return result.slice(-17);
  }, [dayCounts]);

  return (
    <div className="overflow-x-auto -mx-1">
      <div className="flex gap-[3px] min-w-fit">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {Array.from({ length: 7 }).map((_, di) => {
              const day = week.find((d) => d.dayOfWeek === di);
              if (!day) return <div key={di} className="w-[12px] h-[12px]" />;
              return (
                <div
                  key={day.date}
                  className={`w-[12px] h-[12px] rounded-[3px] ${colorFor(day.count)} heatmap-cell`}
                  title={`${day.date}: ${day.count} 个任务`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-1 mt-2.5 text-[10px] text-gray-300 font-medium">
        <span>少</span>
        <div className="w-2.5 h-2.5 rounded-[3px] bg-gray-100" />
        <div className="w-2.5 h-2.5 rounded-[3px] bg-emerald-300" />
        <div className="w-2.5 h-2.5 rounded-[3px] bg-emerald-400" />
        <div className="w-2.5 h-2.5 rounded-[3px] bg-emerald-500" />
        <div className="w-2.5 h-2.5 rounded-[3px] bg-emerald-600" />
        <span>多</span>
      </div>
    </div>
  );
}
