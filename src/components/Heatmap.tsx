import { useMemo } from 'react';
import type { Task } from '../types';

function getDateStr(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function colorFor(count: number): string {
  if (count === 0) return 'bg-gray-100';
  if (count === 1) return 'bg-emerald-200';
  if (count <= 3) return 'bg-emerald-400';
  if (count <= 6) return 'bg-emerald-500';
  return 'bg-emerald-700';
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

  const months = useMemo(() => {
    const labels: { label: string; weekIdx: number }[] = [];
    weeks.forEach((week, i) => {
      const d = week.find((dd) => dd.dayOfWeek === 1) || week[0];
      const m = new Date(d.date).getMonth();
      const prev = labels.length > 0 ? new Date(weeks[i - 1]?.[0]?.date).getMonth() : -1;
      if (i === 0 || m !== prev) {
        labels.push({ label: `${new Date(d.date).getMonth() + 1}月`, weekIdx: i });
      }
    });
    return labels;
  }, [weeks]);

  return (
    <div className="overflow-x-auto -mx-1">
      <div className="flex gap-[3px] min-w-fit">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {Array.from({ length: 7 }).map((_, di) => {
              const day = week.find((d) => d.dayOfWeek === di);
              if (!day) return <div key={di} className="w-[11px] h-[11px]" />;
              return (
                <div
                  key={day.date}
                  className={`w-[11px] h-[11px] rounded-[2px] ${colorFor(day.count)} heatmap-cell`}
                  title={`${day.date}: ${day.count} 个任务`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-2.5">
        <div className="flex gap-4 text-[10px] text-gray-300 font-medium">
          {months.map((m, i) => (
            <span key={i} style={{ marginLeft: i === 0 ? m.weekIdx * 14 : (m.weekIdx - months[i-1].weekIdx - 1) * 14 }}>{m.label}</span>
          ))}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-gray-300">
          <span>少</span>
          <div className="w-[10px] h-[10px] rounded-[2px] bg-gray-100" />
          <div className="w-[10px] h-[10px] rounded-[2px] bg-emerald-200" />
          <div className="w-[10px] h-[10px] rounded-[2px] bg-emerald-400" />
          <div className="w-[10px] h-[10px] rounded-[2px] bg-emerald-500" />
          <div className="w-[10px] h-[10px] rounded-[2px] bg-emerald-700" />
          <span>多</span>
        </div>
      </div>
    </div>
  );
}
