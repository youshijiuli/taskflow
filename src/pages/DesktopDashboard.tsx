import { useMemo, useEffect, useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { useGoalsStore } from '../store/goalsStore';
import { useProjectStore } from '../store/projectStore';
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';

function colorFor(count: number): string {
  if (count === 0) return '#1a1a28';
  if (count === 1) return '#3d2a1a';
  if (count <= 3) return '#6b3d1a';
  if (count <= 6) return '#a05820';
  return '#f0a050';
}

export default function DesktopDashboard() {
  const tasks = useTaskStore((s) => s.tasks);
  const objectives = useGoalsStore((s) => s.objectives);
  const projects = useProjectStore((s) => s.projects);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  const stats = useMemo(() => {
    const done = tasks.filter((t) => t.status === 'done').length;
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
    const todo = tasks.filter((t) => t.status === 'todo').length;
    const rate = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
    const overdue = tasks.filter((t) => t.status !== 'done' && t.dueDate && t.dueDate < Date.now()).length;

    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    const weekData = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i));
      const ds = d.toISOString().slice(0, 10);
      return { date: weekDays[d.getDay()], count: tasks.filter((t) => t.completedAt && new Date(t.completedAt).toISOString().slice(0, 10) === ds).length };
    });

    // 365-day heatmap
    const heatmap: Record<string, number> = {};
    tasks.forEach((t) => {
      if (t.completedAt) {
        const d = new Date(t.completedAt).toISOString().slice(0, 10);
        heatmap[d] = (heatmap[d] ?? 0) + 1;
      }
    });

    const heatmapWeeks: { date: string; count: number; dayOfWeek: number }[][] = [];
    let cur: { date: string; count: number; dayOfWeek: number }[] = [];
    for (let i = 364; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      cur.push({ date: ds, count: heatmap[ds] ?? 0, dayOfWeek: d.getDay() });
      if (d.getDay() === 6) { heatmapWeeks.push(cur); cur = []; }
    }
    if (cur.length) heatmapWeeks.push(cur);

    return { done, inProgress, todo, rate, overdue, weekData, heatmapWeeks };
  }, [tasks]);

  return (
    <div className="min-h-screen bg-[#0e0e16] text-[#ede8e0] font-body p-8 lg:p-12">
      {/* Ambient orbs */}
      <div className="ambient-orb ambient-orb-1" />
      <div className="ambient-orb ambient-orb-2" />

      <div className="max-w-[1440px] mx-auto space-y-12">
        {/* ── Hero Header ── */}
        <header className={`flex items-end justify-between ${mounted ? 'rise-in' : 'opacity-0'}`}>
          <div>
            <p className="text-sm tracking-[0.3em] uppercase text-[#5c5a6c] mb-3">TaskFlow · Desktop</p>
            <h1 className="display-text text-6xl lg:text-7xl">
              今日<span className="accent-glow">全景</span>
            </h1>
            <p className="text-[#9694a4] mt-3 text-lg">{new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</p>
          </div>
          <div className="text-right">
            <div className="stat-num text-8xl font-bold accent-glow" style={{ fontFamily: "'DM Sans', sans-serif", animationDelay: '0.3s' }}>
              {stats.rate}<span className="text-3xl">%</span>
            </div>
            <p className="text-[#5c5a6c] text-sm mt-2">任务完成率</p>
          </div>
        </header>

        {/* ── Stats Row ── */}
        <div className={`grid grid-cols-5 gap-5 ${mounted ? '' : 'opacity-0'}`}>
          {[
            { label: '全部任务', value: tasks.length, delay: 'reveal-1', color: '#ede8e0' },
            { label: '已完成', value: stats.done, delay: 'reveal-2', color: '#4ade80' },
            { label: '进行中', value: stats.inProgress, delay: 'reveal-3', color: '#60a5fa' },
            { label: '待办', value: stats.todo, delay: 'reveal-4', color: '#9694a4' },
            { label: '已逾期', value: stats.overdue, delay: 'reveal-5', color: '#e8547c' },
          ].map((s) => (
            <div key={s.label} className={`desk-card reveal ${s.delay} text-center`}>
              <div className="stat-num text-4xl font-bold mb-2" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[#5c5a6c] text-xs uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Goals + Weekly Trend ── */}
        <div className={`grid grid-cols-3 gap-5 ${mounted ? '' : 'opacity-0'}`}>
          {/* Goal progress */}
          <div className="desk-card reveal reveal-1 col-span-1">
            <h3 className="display-text text-2xl mb-6">目标<span className="accent-glow">进度</span></h3>
            {objectives.length === 0 ? (
              <p className="text-[#5c5a6c] text-sm">尚无目标</p>
            ) : (
              <div className="space-y-4">
                {objectives.map((o) => (
                  <div key={o.id} className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium truncate">{o.title}</p>
                      <div className="mt-1.5 w-full h-1.5 bg-[#242432] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${o.progress}%`, background: `linear-gradient(90deg, #f0a050, ${o.color || '#e8547c'})` }} />
                      </div>
                    </div>
                    <span className="text-sm font-bold accent-glow w-10 text-right">{o.progress}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Weekly chart */}
          <div className="desk-card reveal reveal-3 col-span-2">
            <h3 className="display-text text-2xl mb-6">本周<span className="accent-glow">趋势</span></h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={stats.weekData}>
                <defs>
                  <linearGradient id="weekGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f0a050" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#f0a050" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 13 }} />
                <YAxis axisLine={false} tickLine={false} allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: '#1c1c28', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#ede8e0' }}
                />
                <Area type="monotone" dataKey="count" stroke="#f0a050" strokeWidth={2} fill="url(#weekGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── 365-day Heatmap ── */}
        <div className={`desk-card reveal reveal-4 ${mounted ? '' : 'opacity-0'}`}>
          <h3 className="display-text text-2xl mb-6">年度<span className="accent-glow">热力图</span></h3>
          <div className="overflow-x-auto">
            <div className="flex gap-[2px] min-w-fit justify-center">
              {stats.heatmapWeeks.slice(-30).map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[2px]">
                  {[0, 1, 2, 3, 4, 5, 6].map((di) => {
                    const day = week.find((d) => d.dayOfWeek === di);
                    if (!day) return <div key={di} className="w-[13px] h-[13px]" />;
                    return (
                      <div key={day.date} className={`w-[13px] h-[13px] rounded-[3px]`}
                        style={{ backgroundColor: colorFor(day.count) }}
                        title={`${day.date}: ${day.count} 任务`} />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 mt-3 text-xs text-[#5c5a6c]">
            <span>少</span>
            {[0, 1, 3, 6].map((c) => (
              <div key={c} className="w-[13px] h-[13px] rounded-[3px]" style={{ backgroundColor: colorFor(c) }} />
            ))}
            <span>多</span>
          </div>
        </div>

        {/* ── Projects + Priority ── */}
        <div className={`grid grid-cols-2 gap-5 ${mounted ? '' : 'opacity-0'}`}>
          {/* Projects */}
          <div className="desk-card reveal reveal-5">
            <h3 className="display-text text-2xl mb-6">项目<span className="accent-glow">总览</span></h3>
            {projects.length === 0 ? (
              <p className="text-[#5c5a6c] text-sm">尚无项目</p>
            ) : (
              <div className="space-y-2">
                {projects.map((p) => {
                  const ptasks = tasks.filter((t) => t.projectId === p.id);
                  const pDone = ptasks.filter((t) => t.status === 'done').length;
                  return (
                    <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#14141c] hover:bg-[#1c1c28] transition-colors">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                      <span className="flex-1 text-sm">{p.name}</span>
                      <span className="text-xs text-[#5c5a6c]">{pDone}/{ptasks.length}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Priority distribution */}
          <div className="desk-card reveal reveal-6">
            <h3 className="display-text text-2xl mb-6">优先级<span className="accent-glow">分布</span></h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: '紧急', value: tasks.filter((t) => t.priority === 'urgent').length, color: '#ef4444' },
                    { name: '高', value: tasks.filter((t) => t.priority === 'high').length, color: '#f97316' },
                    { name: '中', value: tasks.filter((t) => t.priority === 'medium').length, color: '#f59e0b' },
                    { name: '低', value: tasks.filter((t) => t.priority === 'low').length, color: '#9694a4' },
                  ].filter((d) => d.value > 0)}
                  dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={3}
                >
                  {['#ef4444', '#f97316', '#f59e0b', '#9694a4'].map((c, i) => <Cell key={i} fill={c} stroke="none" />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1c1c28', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#ede8e0' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="text-center text-[#3a3a4a] text-xs py-8">
          TaskFlow Desktop · 数据实时同步自 Supabase
        </footer>
      </div>
    </div>
  );
}
