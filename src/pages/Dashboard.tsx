import { useMemo } from 'react';
import { useTaskStore } from '../store/taskStore';
import StatCard from '../components/StatCard';
import Heatmap from '../components/Heatmap';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const tasks = useTaskStore((s) => s.tasks);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === 'done').length;
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
    const todo = tasks.filter((t) => t.status === 'todo').length;
    const rate = total ? Math.round((done / total) * 100) : 0;

    const now = new Date();
    const weekData = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (6 - i));
      const ds = d.toISOString().slice(0, 10);
      const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
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
      <div className="flex flex-col items-center justify-center h-[70dvh] px-10">
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">欢迎使用 TaskFlow</h2>
        <p className="text-sm text-gray-400 text-center leading-relaxed">
          在「任务」Tab 中创建你的第一个任务，完成后的数据会在这里可视化展示
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 space-y-4">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="全部任务" value={stats.total} />
        <StatCard label="已完成" value={stats.done} subtitle={`完成率 ${stats.rate}%`} trend={stats.rate > 50 ? 'up' : 'down'} />
        <StatCard label="进行中" value={stats.inProgress} />
        <StatCard label="今日完成" value={stats.todayCount} />
      </div>

      {/* Heatmap */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">完成热力图</h3>
        <Heatmap tasks={tasks} />
      </div>

      {/* Weekly chart */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">本周完成趋势</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={stats.weekData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#a3a3a3' }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#a3a3a3' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: '1px solid #f0f0f0', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', fontSize: 13 }}
            />
            <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly + Priority */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">月度趋势</h3>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={stats.monthData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#a3a3a3' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: '1px solid #f0f0f0', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', fontSize: 12 }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">未完成优先级</h3>
          {stats.priorityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie
                  data={stats.priorityData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={48}
                  innerRadius={24}
                  paddingAngle={2}
                >
                  {stats.priorityData.map((d, i) => (
                    <Cell key={i} fill={d.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: '1px solid #f0f0f0', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-gray-300 text-center mt-10">暂无未完成任务</p>
          )}
        </div>
      </div>
    </div>
  );
}
