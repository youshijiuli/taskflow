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
    let result = tasks;
    if (filterStatus !== 'all') result = result.filter((t) => t.status === filterStatus);
    if (filterProject !== 'all') result = result.filter((t) => t.projectId === filterProject);
    return result;
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
        <div className="flex bg-gray-100/80 rounded-xl p-0.5">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-1.5 text-[13px] font-semibold rounded-[10px] transition-all duration-200 ${
              viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            列表
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`px-4 py-1.5 text-[13px] font-semibold rounded-[10px] transition-all duration-200 ${
              viewMode === 'kanban' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            看板
          </button>
        </div>

        <button
          onClick={() => navigate('/task/new')}
          className="w-10 h-10 bg-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 active:scale-95 transition-all hover:bg-indigo-600"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'all')}
          className="text-xs font-medium border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-600"
        >
          <option value="all">全部状态</option>
          <option value="todo">待办</option>
          <option value="in_progress">进行中</option>
          <option value="done">已完成</option>
        </select>
        <select
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
          className="text-xs font-medium border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-600"
        >
          <option value="all">全部项目</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <span className="text-xs text-gray-400 flex items-center ml-1 font-medium">
          {filtered.length} 项
        </span>
      </div>

      {/* Content */}
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d4d4d4" strokeWidth="1.5">
              <path d="M9 6h10M9 12h10M9 18h7" />
              <circle cx="4.5" cy="6" r="1.5" fill="#d4d4d4" stroke="none" />
              <circle cx="4.5" cy="12" r="1.5" fill="#d4d4d4" stroke="none" />
              <circle cx="4.5" cy="18" r="1.5" fill="#d4d4d4" stroke="none" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-400">暂无任务</p>
          <p className="text-xs text-gray-300 mt-1">点击右上角 + 创建</p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="space-y-5">
          {(Object.keys(grouped) as TaskStatus[]).map((status) => {
            const items = grouped[status];
            if (items.length === 0) return null;
            return (
              <div key={status}>
                <div className="flex items-center gap-2 mb-2.5 px-1">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {statusLabels[status]}
                  </h3>
                  <span className="text-[11px] text-gray-300 font-medium">· {items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
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
