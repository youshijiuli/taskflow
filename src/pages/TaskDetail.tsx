import { useParams, useNavigate } from 'react-router-dom';
import { useTaskStore } from '../store/taskStore';
import { useProjectStore } from '../store/projectStore';
import PriorityBadge from '../components/PriorityBadge';
import { formatFullDate, formatDateTime } from '../utils/date';

const statusLabels = { todo: '待办', in_progress: '进行中', done: '已完成' };
const statusColors = { todo: 'bg-gray-100 text-gray-600', in_progress: 'bg-blue-50 text-blue-600', done: 'bg-emerald-50 text-emerald-600' };

export default function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const task = useTaskStore((s) => s.tasks.find((t) => t.id === id));
  const completeTask = useTaskStore((s) => s.completeTask);
  const uncompleteTask = useTaskStore((s) => s.uncompleteTask);
  const removeTask = useTaskStore((s) => s.remove);
  const projects = useProjectStore((s) => s.projects);

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-400 font-medium">任务不存在</p>
        <button onClick={() => navigate('/tasks')} className="mt-3 text-indigo-500 text-sm font-semibold">返回任务列表</button>
      </div>
    );
  }

  const project = projects.find((p) => p.id === task.projectId);

  const handleDelete = async () => {
    if (confirm('确定删除这个任务？')) { await removeTask(task.id); navigate(-1); }
  };

  return (
    <div className="px-4 py-4 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-gray-400 hover:text-gray-600">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button onClick={() => navigate(`/task/${task.id}/edit`)} className="text-sm font-semibold text-indigo-500 px-3 py-1.5 rounded-xl hover:bg-indigo-50 transition-colors">
          编辑
        </button>
      </div>

      {/* Title */}
      <h2 className={`text-xl font-bold leading-snug ${task.status === 'done' ? 'line-through text-gray-300' : 'text-gray-900'}`}>
        {task.title}
      </h2>

      {/* Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <PriorityBadge priority={task.priority} />
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${statusColors[task.status]}`}>
          {statusLabels[task.status]}
        </span>
        {project && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600">
            {project.name}
          </span>
        )}
      </div>

      {/* Description */}
      {task.description && (
        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{task.description}</p>
        </div>
      )}

      {/* Detail fields */}
      <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
        {task.dueDate && (
          <div className="flex justify-between items-center px-4 py-3.5">
            <span className="text-sm text-gray-400 font-medium">截止日期</span>
            <span className="text-sm font-semibold text-gray-700">{formatFullDate(task.dueDate)}</span>
          </div>
        )}
        {task.reminderTime && (
          <div className="flex justify-between items-center px-4 py-3.5">
            <span className="text-sm text-gray-400 font-medium">提醒时间</span>
            <span className="text-sm font-semibold text-gray-700">{formatDateTime(task.reminderTime)}</span>
          </div>
        )}
        {task.estimatedHours != null && (
          <div className="flex justify-between items-center px-4 py-3.5">
            <span className="text-sm text-gray-400 font-medium">预计时长</span>
            <span className="text-sm font-semibold text-gray-700">{task.estimatedHours}h</span>
          </div>
        )}
        {task.spentHours != null && task.spentHours > 0 && (
          <div className="flex justify-between items-center px-4 py-3.5">
            <span className="text-sm text-gray-400 font-medium">已花费</span>
            <span className="text-sm font-semibold text-gray-700">{task.spentHours}h</span>
          </div>
        )}
        {task.progress > 0 && (
          <div className="flex justify-between items-center px-4 py-3.5">
            <span className="text-sm text-gray-400 font-medium">进度</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${task.progress}%` }} />
              </div>
              <span className="text-sm font-semibold text-gray-700">{task.progress}%</span>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center px-4 py-3.5">
          <span className="text-sm text-gray-400 font-medium">创建时间</span>
          <span className="text-sm font-semibold text-gray-700">{formatFullDate(task.createdAt)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {task.status !== 'done' ? (
          <button onClick={() => completeTask(task.id)}
            className="flex-1 py-3.5 bg-emerald-500 text-white rounded-2xl font-semibold shadow-lg shadow-emerald-200 active:scale-[0.98] transition-all text-[15px]">
            标记完成
          </button>
        ) : (
          <button onClick={() => uncompleteTask(task.id)}
            className="flex-1 py-3.5 bg-gray-200 text-gray-700 rounded-2xl font-semibold active:scale-[0.98] transition-all text-[15px]">
            取消完成
          </button>
        )}
        <button onClick={handleDelete}
          className="px-6 py-3.5 text-red-500 bg-red-50 rounded-2xl font-semibold text-[15px] active:scale-[0.98] transition-all">
          删除
        </button>
      </div>
    </div>
  );
}
