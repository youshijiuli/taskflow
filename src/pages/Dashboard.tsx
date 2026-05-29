import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskStore } from '../store/taskStore';
import { useGoalsStore } from '../store/goalsStore';
import StatCard from '../components/StatCard';
import Heatmap from '../components/Heatmap';
import EfficiencyPanel from '../components/EfficiencyPanel';
import TimeRangeSelector from '../components/TimeRangeSelector';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import GoalCard from '../components/GoalCard';

const GRADIENTS = [
  'from-pink-500 to-rose-500',
  'from-violet-500 to-purple-500',
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
];

export default function Dashboard() {
  const tasks = useTaskStore((s) => s.tasks);
  const objectives = useGoalsStore((s) => s.objectives);
  const krs = useGoalsStore((s) => s.krs);
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const rangeDays = { '7d': 7, '30d': 30, '90d': 90, all: Infinity }[timeRange];

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === 'done').length;
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
    const todo = tasks.filter((t) => t.status === 'todo').length;
    const rate = total ? Math.round((done / total) * 100) : 0;

    const now = new Date();
    const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
    const weekData = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (6 - i));
      const ds = d.toISOString().slice(0, 10);
      return {
        date: dayNames[d.getDay()],
        count: tasks.filter((t) => t.completedAt && new Date(t.completedAt).toISOString().slice(0, 10) === ds).length,
      };
    });

    const monthData = Array.from({ length: 6 }).map((_, i) => {
      const start = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const end = new Date(now.getFullYear(), now.getMonth() - (5 - i) + 1, 0, 23, 59, 59);
      return {
        name: `${start.getMonth() + 1}月`,
        count: tasks.filter((t) => t.completedAt && t.completedAt >= start.getTime() && t.completedAt <= end.getTime()).length,
      };
    });

    const priorityData = [
      { name: '紧急', value: tasks.filter((t) => t.priority === 'urgent' && t.status !== 'done').length, color: '#ef4444' },
      { name: '高', value: tasks.filter((t) => t.priority === 'high' && t.status !== 'done').length, color: '#f97316' },
      { name: '中', value: tasks.filter((t) => t.priority === 'medium' && t.status !== 'done').length, color: '#f59e0b' },
      { name: '低', value: tasks.filter((t) => t.priority === 'low' && t.status !== 'done').length, color: '#9ca3af' },
    ].filter((d) => d.value > 0);

    const today = new Date().toISOString().slice(0, 10);
    const todayCount = tasks.filter((t) => t.completedAt && new Date(t.completedAt).toISOString().slice(0, 10) === today).length;

    return { total, done, inProgress, todo, rate, weekData, monthData, priorityData, todayCount };
  }, [tasks]);

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-8">
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex items-center justify-center mb-6 slide-up">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="url(#grad)" strokeWidth="1.2">
            <defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f472b6"/><stop offset="100%" stopColor="#8b5cf6"/></linearGradient></defs>
            <rect x="3" y="3" width="7" height="7" rx="2" />
            <rect x="14" y="3" width="7" height="7" rx="2" />
            <rect x="3" y="14" width="7" height="7" rx="2" />
            <rect x="14" y="14" width="7" height="7" rx="2" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-800 mb-2">欢迎使用 TaskFlow</h2>
        <p className="text-sm text-gray-400 text-center leading-relaxed">
          在「任务」中创建你的第一个任务<br/>完成后数据会在这里可视化
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="全部任务" value={stats.total} gradient={GRADIENTS[0]} />
        <StatCard label="已完成" value={stats.done} gradient={GRADIENTS[1]} subtitle={`完成率 ${stats.rate}%`} />
        <StatCard label="进行中" value={stats.inProgress} gradient={GRADIENTS[2]} />
        <StatCard label="今日完成" value={stats.todayCount} gradient={GRADIENTS[3]} />
      </div>

      {/* Goal progress */}
      {objectives.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-gray-600">目标进度</h3>
            <button onClick={() => navigate('/goals')} className="text-xs font-bold text-purple-500">查看全部 →</button>
          </div>
          <div className="space-y-2">
            {objectives.slice(0, 3).map((o) => (
              <GoalCard
                key={o.id}
                objective={o}
                krs={krs.filter((kr) => kr.objectiveId === o.id)}
                taskCount={tasks.filter((t) => t.keyResultId && krs.filter((kr) => kr.objectiveId === o.id).some((kr) => kr.id === t.keyResultId)).length}
                onClick={() => navigate(`/goals/${o.id}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Efficiency panel */}
      <div className="section-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-700">效率分析</h3>
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
        </div>
        <EfficiencyPanel tasks={tasks} days={rangeDays} />
      </div>

      {/* Heatmap */}
      <div className="section-card">
        <h3 className="text-sm font-bold text-gray-700 mb-3">完成热力图</h3>
        <Heatmap tasks={tasks} />
      </div>

      {/* Weekly */}
      <div className="section-card">
        <h3 className="text-sm font-bold text-gray-700 mb-3">本周完成</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={stats.weekData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid #f3f4f6', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', fontSize: 13 }} />
            <Bar dataKey="count" fill="url(#barGrad)" radius={[8, 8, 0, 0]} maxBarSize={36}>
              {stats.weekData.map((_, i) => (
                <Cell key={i} fill={['#f472b6','#e879f9','#c084fc','#a78bfa','#818cf8','#6366f1','#4f46e5'][i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly + Priority */}
      <div className="grid grid-cols-2 gap-3">
        <div className="section-card">
          <h3 className="text-sm font-bold text-gray-700 mb-3">月度趋势</h3>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={stats.monthData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #f3f4f6', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', fontSize: 12 }} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="section-card">
          <h3 className="text-sm font-bold text-gray-700 mb-1">优先级</h3>
          {stats.priorityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={stats.priorityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={48} innerRadius={24} paddingAngle={3}>
                  {stats.priorityData.map((d, i) => (
                    <Cell key={i} fill={d.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #f3f4f6', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-gray-300 text-center mt-10">🎉 全部完成</p>
          )}
        </div>
      </div>
    </div>
  );
}
