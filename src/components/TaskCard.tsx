import { useNavigate } from 'react-router-dom';
import type { Task } from '../types';
import PriorityBadge from './PriorityBadge';
import { daysUntil, isOverdue, formatDate } from '../utils/date';

const statusConfig = {
  todo: { dot: 'bg-gray-300' },
  in_progress: { dot: 'bg-gradient-to-b from-blue-400 to-blue-500' },
  done: { dot: 'bg-gradient-to-b from-emerald-400 to-emerald-500' },
};

export default function TaskCard({ task }: { task: Task }) {
  const navigate = useNavigate();
  const overdue = task.dueDate && isOverdue(task.dueDate) && task.status !== 'done';
  const dueSoon = task.dueDate && !overdue && daysUntil(task.dueDate) <= 3 && task.status !== 'done';
  const st = statusConfig[task.status];

  return (
    <div
      onClick={() => navigate(`/task/${task.id}`)}
      className="card-press bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3.5 border border-white/80 shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] transition-shadow cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <span className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${st.dot}`} />

        <div className="flex-1 min-w-0">
          <p className={`text-[15px] leading-snug font-semibold truncate ${
            task.status === 'done' ? 'line-through text-gray-300' : 'text-gray-800'
          }`}>
            {task.title}
          </p>

          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <PriorityBadge priority={task.priority} />

            {task.dueDate && (
              <span className={`text-[11px] font-semibold ${
                overdue ? 'text-rose-500' : dueSoon ? 'text-amber-500' : 'text-gray-400'
              }`}>
                {overdue ? '已逾期' : formatDate(task.dueDate)}
              </span>
            )}

            {task.progress > 0 && task.progress < 100 && (
              <span className="text-[11px] text-gray-400 font-semibold">{task.progress}%</span>
            )}

            {task.spentHours != null && task.spentHours > 0 && (
              <span className="text-[11px] text-gray-400">{task.spentHours}h</span>
            )}
          </div>

          {task.progress > 0 && task.progress < 100 && (
            <div className="mt-2 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-500"
                style={{ width: `${task.progress}%` }} />
            </div>
          )}
        </div>

        <svg className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </div>
    </div>
  );
}
