import { useTaskStore } from '../store/taskStore';
import { useNavigate } from 'react-router-dom';
import type { Task, TaskStatus } from '../types';
import PriorityBadge from './PriorityBadge';

const columns: { status: TaskStatus; label: string; bg: string; border: string; dot: string }[] = [
  { status: 'todo', label: '待办', bg: 'bg-gray-50', border: 'border-gray-200/60', dot: 'bg-gray-300' },
  { status: 'in_progress', label: '进行中', bg: 'bg-blue-50', border: 'border-blue-200/60', dot: 'bg-blue-400' },
  { status: 'done', label: '已完成', bg: 'bg-emerald-50', border: 'border-emerald-200/60', dot: 'bg-emerald-400' },
];

export default function KanbanBoard({ tasks }: { tasks: Task[] }) {
  const completeTask = useTaskStore((s) => s.completeTask);
  const uncompleteTask = useTaskStore((s) => s.uncompleteTask);
  const updateTask = useTaskStore((s) => s.update);
  const navigate = useNavigate();

  const getByStatus = (status: TaskStatus) =>
    tasks.filter((t) => t.status === status);

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus, oldStatus: TaskStatus) => {
    if (newStatus === oldStatus) return;
    if (newStatus === 'done') {
      await completeTask(taskId);
    } else if (oldStatus === 'done') {
      await uncompleteTask(taskId);
    } else {
      await updateTask(taskId, { status: newStatus });
    }
  };

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
      {columns.map(({ status, label, bg, border, dot }) => {
        const items = getByStatus(status);
        return (
          <div key={status}
            className={`flex-shrink-0 w-[45%] snap-start rounded-3xl p-3 ${bg} border ${border} min-h-[300px]`}
          >
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
              <h3 className="text-sm font-bold text-gray-600">{label}</h3>
              <span className="text-xs text-gray-300 font-semibold ml-auto">{items.length}</span>
            </div>
            <div className="space-y-2">
              {items.map((task) => (
                <div key={task.id}
                  onClick={() => navigate(`/task/${task.id}`)}
                  className="bg-white rounded-2xl p-3 shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-gray-50 cursor-pointer card-press"
                >
                  <p className="text-[13px] font-semibold text-gray-800 line-clamp-2 leading-snug">{task.title}</p>
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
                      handleStatusChange(task.id, e.target.value as TaskStatus, task.status);
                    }}
                    className="mt-2.5 text-[11px] border border-gray-200 rounded-xl px-2 py-1.5 bg-gray-50/50 w-full font-semibold text-gray-500 focus:outline-none"
                  >
                    <option value="todo">移动到待办</option>
                    <option value="in_progress">移动到进行中</option>
                    <option value="done">移动到已完成</option>
                  </select>
                </div>
              ))}
              {items.length === 0 && (
                <div className="text-center py-8 text-xs text-gray-300">拖拽任务到此列</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
