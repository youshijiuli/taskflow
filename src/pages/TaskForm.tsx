import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTaskStore } from '../store/taskStore';
import { useProjectStore } from '../store/projectStore';
import type { Priority, TaskStatus } from '../types';

const priorityOptions: { value: Priority; label: string; activeCls: string }[] = [
  { value: 'urgent', label: '紧急', activeCls: 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-200' },
  { value: 'high', label: '高', activeCls: 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-200' },
  { value: 'medium', label: '中', activeCls: 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-200' },
  { value: 'low', label: '低', activeCls: 'bg-gray-400 text-white border-gray-400' },
];

export default function TaskForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const tasks = useTaskStore((s) => s.tasks);
  const projects = useProjectStore((s) => s.projects);
  const addTask = useTaskStore((s) => s.add);
  const updateTask = useTaskStore((s) => s.update);
  const removeTask = useTaskStore((s) => s.remove);

  const editing = Boolean(id);
  const existing = id ? tasks.find((t) => t.id === id) : undefined;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [projectId, setProjectId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [spentHours, setSpentHours] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (existing) {
      setTitle(existing.title); setDescription(existing.description);
      setPriority(existing.priority); setStatus(existing.status);
      setProjectId(existing.projectId);
      setDueDate(existing.dueDate ? new Date(existing.dueDate).toISOString().slice(0, 16) : '');
      setEstimatedHours(existing.estimatedHours?.toString() ?? '');
      setSpentHours(existing.spentHours?.toString() ?? '');
      setProgress(existing.progress);
    }
  }, [existing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const data = {
      title: title.trim(), description: description.trim(), priority, status,
      userId: '', projectId: projectId || '', keyResultId: null, quadrant: null,
      tags: [] as string[],
      dueDate: dueDate ? new Date(dueDate).getTime() : null,
      estimatedHours: estimatedHours ? Number(estimatedHours) : null,
      spentHours: spentHours ? Number(spentHours) : null,
      progress, completedAt: status === 'done' ? Date.now() : null,
    };
    if (editing && existing) await updateTask(existing.id, data);
    else await addTask(data);
    navigate(-1);
  };

  const handleDelete = async () => {
    if (editing && existing && confirm('确定删除这个任务？')) { await removeTask(existing.id); navigate(-1); }
  };

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-gray-600">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <h2 className="text-base font-bold text-gray-800">{editing ? '编辑任务' : '新建任务'}</h2>
        <div className="w-8" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder="任务标题" required
          className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl text-[16px] font-semibold placeholder:text-gray-300 focus:bg-white focus:ring-2 focus:ring-purple-300 transition-all" autoFocus />

        <textarea value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder="添加描述..." rows={3}
          className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-[14px] placeholder:text-gray-300 focus:bg-white focus:ring-2 focus:ring-purple-300 resize-none transition-all" />

        {/* Priority */}
        <div>
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">优先级</label>
          <div className="grid grid-cols-4 gap-2">
            {priorityOptions.map((p) => (
              <button key={p.value} type="button" onClick={() => setPriority(p.value)}
                className={`py-2 text-xs font-bold rounded-xl border transition-all card-press ${
                  priority === p.value ? p.activeCls : 'bg-white text-gray-500 border-gray-200'
                }`}>{p.label}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">状态</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm font-semibold">
              <option value="todo">待办</option>
              <option value="in_progress">进行中</option>
              <option value="done">已完成</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">项目</label>
            <select value={projectId} onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm font-semibold">
              <option value="">无项目</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">截止日期</label>
            <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-purple-300 transition-all" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">预计(h)</label>
            <input type="number" value={estimatedHours} onChange={(e) => setEstimatedHours(e.target.value)}
              placeholder="0" min="0" step="0.5"
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-purple-300 transition-all" />
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">已用(h)</label>
            <input type="number" value={spentHours} onChange={(e) => setSpentHours(e.target.value)}
              placeholder="0" min="0" step="0.5"
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-purple-300 transition-all" />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">进度 <span className="text-purple-500">{progress}%</span></label>
          <input type="range" value={progress} onChange={(e) => setProgress(Number(e.target.value))}
            min="0" max="100" step="5" className="w-full" />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit"
            className="flex-1 py-3.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl font-bold text-[15px] shadow-lg shadow-purple-200 card-press">
            {editing ? '保存修改' : '创建任务'}
          </button>
          {editing && (
            <button type="button" onClick={handleDelete}
              className="px-6 py-3.5 text-rose-500 bg-rose-50 rounded-2xl font-bold text-[15px] card-press">删除</button>
          )}
        </div>
      </form>
    </div>
  );
}
