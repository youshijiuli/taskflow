import { useNavigate } from 'react-router-dom';
import type { Task } from '../types';
import PriorityBadge from './PriorityBadge';
import { daysUntil, isOverdue, formatDate } from '../utils/date';

const statusConfig = {
  todo: { label: '待办', dot: 'bg-gray-300' },
  in_progress: { label: '进行中', dot: 'bg-blue-500' },
  done: { label: '已完成', dot: 'bg-green-500' },
};

export default function TaskCard({ task }: { task: Task }) {
  const navigate = useNavigate();
  const overdue = task.dueDate && isOverdue(task.dueDate) && task.status !== 'done';
  const dueSoon = task.dueDate && !overdue && daysUntil(task.dueDate) <= 3 && task.status !== 'done';
  const st = statusConfig[task.status];

  return (
    <div
      onClick={() => navigate(`/task/${task.id}`)}
      className="group bg-white rounded-xl px-4 py-3.5 border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.985]"
    >
      <div className="flex items-start gap-2.5">
        {/* Status dot */}
        <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${st.dot}`} />

        <div className="flex-1 min-w-0">
          {/* Title */}
          <p className={`text-[15px] leading-snug font-semibold truncate ${
            task.status === 'done' ? 'line-through text-gray-300' : 'text-gray-900'
          }`}>
            {task.title}
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <PriorityBadge priority={task.priority} />

            {task.dueDate && (
              <span className={`text-[11px] font-medium ${
                overdue ? 'text-red-500' : dueSoon ? 'text-orange-500' : 'text-gray-400'
              }`}>
                {overdue ? '已逾期' : formatDate(task.dueDate)}
              </span>
            )}

            {task.progress > 0 && task.progress < 100 && (
              <span className="text-[11px] text-gray-400 font-medium">{task.progress}%</span>
            )}

            {task.spentHours != null && task.spentHours > 0 && (
              <span className="text-[11px] text-gray-400">{task.spentHours}h</span>
            )}
          </div>

          {/* Progress bar */}
          {task.progress > 0 && task.progress < 100 && (
            <div className="mt-2 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-400 rounded-full transition-all duration-500"
                style={{ width: `${task.progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Arrow */}
        <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-400 flex-shrink-0 mt-1 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </div>
    </div>
  );
}
