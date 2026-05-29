import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskStore } from '../store/taskStore';
import { useProjectStore } from '../store/projectStore';
import TaskCard from '../components/TaskCard';
import KanbanBoard from '../components/KanbanBoard';
import type { TaskStatus } from '../types';

type ViewMode = 'list' | 'kanban';
const statusLabels: Record<TaskStatus, string> = { todo: '待办', in_progress: '进行中', done: '已完成' };

export default function Tasks() {
  const navigate = useNavigate();
  const tasks = useTaskStore((s) => s.tasks);
  const projects = useProjectStore((s) => s.projects);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [filterProject, setFilterProject] = useState<string>('all');

  const filtered = useMemo(() => {
    let r = tasks;
    if (filterStatus !== 'all') r = r.filter((t) => t.status === filterStatus);
    if (filterProject !== 'all') r = r.filter((t) => t.projectId === filterProject);
    return r;
  }, [tasks, filterStatus, filterProject]);

  const grouped = useMemo(() => {
    const g: Record<TaskStatus, typeof filtered> = { todo: [], in_progress: [], done: [] };
    filtered.forEach((t) => g[t.status].push(t));
    return g;
  }, [filtered]);

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex bg-gray-100/80 rounded-2xl p-0.5">
          <button onClick={() => setViewMode('list')}
            className={`px-5 py-2 text-[13px] font-bold rounded-[14px] transition-all duration-200 ${
              viewMode === 'list' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400'
            }`}>
            列表
          </button>
          <button onClick={() => setViewMode('kanban')}
            className={`px-5 py-2 text-[13px] font-bold rounded-[14px] transition-all duration-200 ${
              viewMode === 'kanban' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400'
            }`}>
            看板
          </button>
        </div>
        <button
          onClick={() => navigate('/task/new')}
          className="w-11 h-11 bg-gradient-to-br from-pink-500 to-purple-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200 card-press"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'all')}
          className="text-xs font-bold border-0 bg-gray-100/80 rounded-2xl px-4 py-2.5 text-gray-600">
          <option value="all">全部状态</option>
          <option value="todo">待办</option>
          <option value="in_progress">进行中</option>
          <option value="done">已完成</option>
        </select>
        <select value={filterProject} onChange={(e) => setFilterProject(e.target.value)}
          className="text-xs font-bold border-0 bg-gray-100/80 rounded-2xl px-4 py-2.5 text-gray-600">
          <option value="all">全部项目</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <span className="text-xs text-gray-400 flex items-center ml-1 font-semibold">{filtered.length} 项</span>
      </div>

      {/* Content */}
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
              <path d="M9 5h10M9 12h10M9 19h7" />
              <circle cx="4.5" cy="5" r="2" fill="#d1d5db" />
              <circle cx="4.5" cy="12" r="2" fill="#d1d5db" />
              <circle cx="4.5" cy="19" r="2" fill="#d1d5db" />
            </svg>
          </div>
          <p className="text-sm font-bold text-gray-400">暂无任务</p>
          <p className="text-xs text-gray-300 mt-1">点击右上角 + 创建</p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="space-y-5">
          {(Object.keys(grouped) as TaskStatus[]).map((status) => {
            const items = grouped[status];
            if (items.length === 0) return null;
            return (
              <div key={status}>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5 px-1 flex items-center gap-2">
                  {statusLabels[status]}
                  <span className="text-gray-300">· {items.length}</span>
                </h3>
                <div className="space-y-2">
                  {items.map((task) => <TaskCard key={task.id} task={task} />)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <KanbanBoard tasks={filtered} />
      )}
    </div>
  );
}
