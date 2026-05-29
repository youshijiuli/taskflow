import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';
import type { Task } from '../types';
import PriorityBadge from './PriorityBadge';
import { daysUntil, isOverdue, formatDate } from '../utils/date';

const statusBadge: Record<string, { label: string; cls: string }> = {
  todo: { label: '待办', cls: 'bg-gray-100 text-gray-500' },
  in_progress: { label: '进行中', cls: 'bg-blue-50 text-blue-600' },
  done: { label: '已完成', cls: 'bg-emerald-50 text-emerald-600' },
};

export default function TaskCard({ task }: { task: Task }) {
  const navigate = useNavigate();
  const projects = useProjectStore((s) => s.projects);
  const overdue = task.dueDate && isOverdue(task.dueDate) && task.status !== 'done';
  const dueSoon = task.dueDate && !overdue && daysUntil(task.dueDate) <= 3 && task.status !== 'done';
  const project = task.projectId ? projects.find((p) => p.id === task.projectId) : null;

  return (
    <div
      onClick={() => navigate(`/task/${task.id}`)}
      className={`section-card hover-lift card-press cursor-pointer ${overdue ? 'border-l-3 border-l-rose-400' : ''} ${dueSoon ? 'border-l-3 border-l-amber-400' : ''}`}
    >
      {/* Top row: title + status */}
      <div className="flex items-start gap-2.5">
        <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
          task.status === 'done' ? 'bg-emerald-400' : task.status === 'in_progress' ? 'bg-blue-400' : 'bg-gray-300'
        }`} />
        <div className="flex-1 min-w-0">
          <p className={`text-[15px] font-semibold leading-snug truncate ${
            task.status === 'done' ? 'line-through text-gray-300' : 'text-gray-800'
          }`}>
            {task.title}
          </p>
          {task.description && (
            <p className="text-[12px] text-gray-400 mt-0.5 line-clamp-1">{task.description}</p>
          )}
        </div>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg flex-shrink-0 ${statusBadge[task.status].cls}`}>
          {statusBadge[task.status].label}
        </span>
      </div>

      {/* Bottom row: info tags */}
      <div className="flex items-center gap-2 mt-2.5 flex-wrap">
        <PriorityBadge priority={task.priority} />

        {project && (
          <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: project.color }} />
            {project.name}
          </span>
        )}

        {task.dueDate && (
          <span className={`text-[11px] font-semibold ${overdue ? 'text-rose-500' : dueSoon ? 'text-amber-500' : 'text-gray-400'}`}>
            {overdue ? '已逾期' : dueSoon ? '即将到期' : ''} {formatDate(task.dueDate)}
          </span>
        )}

        {task.quadrant && (
          <span className="text-[10px] text-gray-300 px-1.5 py-0.5 bg-gray-50 rounded">
            {task.quadrant === 'q1' ? '紧急重要' : task.quadrant === 'q2' ? '重要不紧急' : task.quadrant === 'q3' ? '紧急不重要' : '不重要不紧急'}
          </span>
        )}

        {task.spentHours != null && task.spentHours > 0 && (
          <span className="text-[11px] text-gray-400">{task.spentHours}h</span>
        )}
      </div>

      {/* Progress bar */}
      {task.progress > 0 && task.progress < 100 && (
        <div className="mt-2.5 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-500"
            style={{ width: `${task.progress}%` }} />
        </div>
      )}
    </div>
  );
}
