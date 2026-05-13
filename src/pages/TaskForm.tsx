import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTaskStore } from '../store/taskStore';
import { useProjectStore } from '../store/projectStore';
import type { Priority, TaskStatus } from '../types';

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
  const [reminderDate, setReminderDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [spentHours, setSpentHours] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setDescription(existing.description);
      setPriority(existing.priority);
      setStatus(existing.status);
      setProjectId(existing.projectId);
      setDueDate(existing.dueDate ? new Date(existing.dueDate).toISOString().slice(0, 16) : '');
      setReminderDate(existing.reminderTime ? new Date(existing.reminderTime).toISOString().slice(0, 16) : '');
      setEstimatedHours(existing.estimatedHours?.toString() ?? '');
      setSpentHours(existing.spentHours?.toString() ?? '');
      setProgress(existing.progress);
    }
  }, [existing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const data = {
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      projectId: projectId || 'default',
      dueDate: dueDate ? new Date(dueDate).getTime() : null,
      reminderTime: reminderDate ? new Date(reminderDate).getTime() : null,
      estimatedHours: estimatedHours ? Number(estimatedHours) : null,
      spentHours: spentHours ? Number(spentHours) : null,
      progress,
      tags: [] as string[],
      completedAt: status === 'done' ? Date.now() : null,
    };
    if (editing && existing) await updateTask(existing.id, data);
    else await addTask(data);
    navigate(-1);
  };

  const handleDelete = async () => {
    if (editing && existing && confirm('确定删除这个任务？')) {
      await removeTask(existing.id);
      navigate(-1);
    }
  };

  return (
    <div className="px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-gray-400 hover:text-gray-600">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <h2 className="text-base font-bold">{editing ? '编辑任务' : '新建任务'}</h2>
        <div className="w-8" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="任务标题"
          className="w-full px-4 py-3.5 bg-gray-50 border-0 rounded-2xl text-[17px] font-semibold placeholder:text-gray-300 focus:bg-white focus:ring-2 focus:ring-indigo-400 transition-all"
          autoFocus
          required
        />

        {/* Description */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="添加描述..."
          rows={3}
          className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl text-[15px] placeholder:text-gray-300 focus:bg-white focus:ring-2 focus:ring-indigo-400 resize-none transition-all"
        />

        {/* Grid: Priority + Status */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">优先级</label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['urgent', 'high', 'medium', 'low'] as Priority[]).map((p) => {
                const labels: Record<Priority, string> = { urgent: '紧急', high: '高', medium: '中', low: '低' };
                const colors: Record<Priority, string> = {
                  urgent: priority === p ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-500 border-gray-200',
                  high: priority === p ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-500 border-gray-200',
                  medium: priority === p ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-gray-500 border-gray-200',
                  low: priority === p ? 'bg-gray-400 text-white border-gray-400' : 'bg-white text-gray-500 border-gray-200',
                };
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`px-2 py-1.5 text-xs font-semibold rounded-lg border transition-all active:scale-95 ${colors[p]}`}
                  >
                    {labels[p]}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">状态</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-medium bg-white"
            >
              <option value="todo">待办</option>
              <option value="in_progress">进行中</option>
              <option value="done">已完成</option>
            </select>
          </div>
        </div>

        {/* Project */}
        <div>
          <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">所属项目</label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-medium bg-white"
          >
            <option value="">无项目</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Due + Reminder */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">截止日期</label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-400 transition-all"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">提醒</label>
            <input
              type="datetime-local"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-400 transition-all"
            />
          </div>
        </div>

        {/* Hours */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">预计(h)</label>
            <input
              type="number"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              placeholder="0"
              min="0" step="0.5"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-400 transition-all"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">已用(h)</label>
            <input
              type="number"
              value={spentHours}
              onChange={(e) => setSpentHours(e.target.value)}
              placeholder="0"
              min="0" step="0.5"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-400 transition-all"
            />
          </div>
        </div>

        {/* Progress */}
        <div>
          <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">
            进度 <span className="text-indigo-500">{progress}%</span>
          </label>
          <input
            type="range"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            min="0" max="100" step="5"
            className="w-full"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 py-3.5 bg-indigo-500 text-white rounded-2xl font-semibold text-[15px] shadow-lg shadow-indigo-200 active:scale-[0.98] transition-all hover:bg-indigo-600"
          >
            {editing ? '保存修改' : '创建任务'}
          </button>
          {editing && (
            <button
              type="button"
              onClick={handleDelete}
              className="px-6 py-3.5 text-red-500 bg-red-50 rounded-2xl font-semibold text-[15px] active:scale-[0.98] transition-all"
            >
              删除
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
