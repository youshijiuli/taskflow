import { useState, useMemo } from 'react';
import type { Task } from '../types';

export default function CalendarView({ tasks }: { tasks: Task[] }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(today.toISOString().slice(0, 10));

  const { weeks, tasksByDate } = useMemo(() => {
    const map: Record<string, Task[]> = {};
    tasks.forEach((t) => {
      if (t.dueDate) {
        const d = new Date(t.dueDate).toISOString().slice(0, 10);
        (map[d] ||= []).push(t);
      }
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weeks: (number | null)[][] = [];
    let currentWeek: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) currentWeek.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      currentWeek.push(d);
      if (currentWeek.length === 7) { weeks.push(currentWeek); currentWeek = []; }
    }
    while (currentWeek.length < 7) currentWeek.push(null);
    if (currentWeek.some((d) => d !== null)) weeks.push(currentWeek);

    return { weeks, tasksByDate: map };
  }, [tasks, year, month]);

  const todayStr = today.toISOString().slice(0, 10);
  const goMonth = (delta: number) => {
    const m = month + delta;
    if (m < 0) { setYear(year - 1); setMonth(11); } else if (m > 11) { setYear(year + 1); setMonth(0); } else setMonth(m);
  };

  const selectedTasks = selectedDate ? (tasksByDate[selectedDate] || []) : [];

  return (
    <div className="space-y-3">
      {/* Month selector */}
      <div className="flex items-center justify-between px-1">
        <button onClick={() => goMonth(-1)} className="p-1 text-gray-400"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg></button>
        <span className="text-sm font-bold text-gray-700">{year}年 {month + 1}月</span>
        <button onClick={() => goMonth(1)} className="p-1 text-gray-400"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 6l6 6-6 6"/></svg></button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 text-center">
        {['日', '一', '二', '三', '四', '五', '六'].map((d) => (
          <div key={d} className="text-[10px] font-bold text-gray-300 py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {weeks.flat().map((day, i) => {
          if (day === null) return <div key={`e${i}`} className="aspect-square" />;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayTasks = tasksByDate[dateStr] || [];
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;
          const hasDone = dayTasks.some((t) => t.status === 'done');
          const hasActive = dayTasks.some((t) => t.status !== 'done');

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-semibold transition-all ${
                isSelected ? 'bg-purple-500 text-white shadow-lg shadow-purple-200' :
                isToday ? 'bg-purple-50 text-purple-600' : 'hover:bg-gray-50 text-gray-600'
              }`}
            >
              {day}
              {dayTasks.length > 0 && (
                <div className="flex gap-0.5 mt-0.5">
                  {hasActive && <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-purple-400'}`} />}
                  {hasDone && <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-400'}`} />}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected date tasks */}
      {selectedDate && (
        <div className="bg-white rounded-2xl border border-gray-100 p-3">
          <h4 className="text-xs font-bold text-gray-400 mb-2">{selectedDate} 的任务</h4>
          {selectedTasks.length === 0 ? (
            <p className="text-xs text-gray-300 py-2 text-center">当日无任务</p>
          ) : (
            <div className="space-y-1.5">
              {selectedTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-2 text-sm">
                  <span className={`w-1.5 h-1.5 rounded-full ${task.status === 'done' ? 'bg-emerald-400' : task.status === 'in_progress' ? 'bg-blue-400' : 'bg-gray-300'}`} />
                  <span className={task.status === 'done' ? 'line-through text-gray-300' : 'text-gray-600'}>{task.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
