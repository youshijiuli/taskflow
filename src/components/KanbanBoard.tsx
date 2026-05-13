import { useTaskStore } from '../store/taskStore';
import { useNavigate } from 'react-router-dom';
import type { Task, TaskStatus } from '../types';
import PriorityBadge from './PriorityBadge';

const columns: { status: TaskStatus; label: string; bg: string; border: string; dot: string }[] = [
  { status: 'todo', label: '待办', bg: 'bg-gray-50/80', border: 'border-gray-100', dot: 'bg-gray-300' },
  { status: 'in_progress', label: '进行中', bg: 'bg-blue-50/40', border: 'border-blue-100', dot: 'bg-blue-400' },
  { status: 'done', label: '已完成', bg: 'bg-emerald-50/40', border: 'border-emerald-100', dot: 'bg-emerald-400' },
];

export default function KanbanBoard({ tasks }: { tasks: Task[] }) {
  const updateTask = useTaskStore((s) => s.update);
  const navigate = useNavigate();

  const getByStatus = (status: TaskStatus) =>
    tasks.filter((t) => t.status === status);

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    await updateTask(taskId, {
      status: newStatus,
      completedAt: newStatus === 'done' ? Date.now() : null,
      progress: newStatus === 'done' ? 100 : 0,
    });
  };

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
      {columns.map(({ status, label, bg, border, dot }) => {
        const items = getByStatus(status);
        return (
          <div
            key={status}
            className={`flex-shrink-0 w-[45%] snap-start rounded-2xl p-3 ${bg} border ${border} min-h-[300px]`}
          >
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className={`w-2 h-2 rounded-full ${dot}`} />
              <h3 className="text-sm font-semibold text-gray-700">{label}</h3>
              <span className="text-xs text-gray-400 font-medium ml-auto">{items.length}</span>
            </div>

            <div className="space-y-2">
              {items.map((task) => (
                <div
                  key={task.id}
                  onClick={() => navigate(`/task/${task.id}`)}
                  className="bg-white rounded-xl p-3 shadow-sm border border-gray-100/80 cursor-pointer active:scale-[0.98] transition-transform hover:shadow-md"
                >
                  <p className="text-[14px] font-semibold text-gray-900 line-clamp-2 leading-snug">
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <PriorityBadge priority={task.priority} />
                    {task.dueDate && (
                      <span className="text-[10px] text-gray-400 font-medium">
                        {new Date(task.dueDate).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <select
                    value={task.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleStatusChange(task.id, e.target.value as TaskStatus);
                    }}
                    className="mt-2.5 text-[11px] border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50/50 w-full font-medium text-gray-600 focus:outline-none"
                  >
                    <option value="todo">移动到待办</option>
                    <option value="in_progress">移动到进行中</option>
                    <option value="done">移动到已完成</option>
                  </select>
                </div>
              ))}

              {items.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-xs text-gray-300">暂无任务</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
