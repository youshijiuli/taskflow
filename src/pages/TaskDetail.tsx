import { useParams, useNavigate } from 'react-router-dom';
import { useTaskStore } from '../store/taskStore';
import { useProjectStore } from '../store/projectStore';
import PriorityBadge from '../components/PriorityBadge';
import { formatFullDate } from '../utils/date';

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
        <p className="font-semibold text-gray-400">任务不存在</p>
        <button onClick={() => navigate('/tasks')} className="mt-3 text-purple-500 text-sm font-bold">返回任务列表</button>
      </div>
    );
  }

  const project = projects.find((p) => p.id === task.projectId);

  return (
    <div className="px-4 py-4 space-y-5">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button onClick={() => navigate(`/task/${task.id}/edit`)}
          className="text-sm font-bold text-purple-500 px-4 py-2 rounded-2xl hover:bg-purple-50 transition-colors">编辑</button>
      </div>

      <h2 className={`text-xl font-extrabold leading-snug ${task.status === 'done' ? 'line-through text-gray-300' : 'text-gray-800'}`}>{task.title}</h2>

      <div className="flex items-center gap-2 flex-wrap">
        <PriorityBadge priority={task.priority} />
        <span className={`text-xs font-bold px-3 py-1 rounded-xl ${statusColors[task.status]}`}>{statusLabels[task.status]}</span>
        {project && <span className="text-xs font-bold px-3 py-1 rounded-xl bg-gray-100 text-gray-600">{project.name}</span>}
      </div>

      {task.description && (
        <div className="bg-gray-50 rounded-3xl p-4">
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{task.description}</p>
        </div>
      )}

      <div className="section-card divide-y divide-gray-50 overflow-hidden">
        {task.dueDate && <Row label="截止日期" value={formatFullDate(task.dueDate)} />}
        {task.estimatedHours != null && <Row label="预计时长" value={`${task.estimatedHours}h`} />}
        {task.spentHours != null && task.spentHours > 0 && <Row label="已花费" value={`${task.spentHours}h`} />}
        {task.progress > 0 && (
          <div className="flex justify-between items-center px-4 py-3.5">
            <span className="text-sm text-gray-400 font-medium">进度</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" style={{ width: `${task.progress}%` }} />
              </div>
              <span className="text-sm font-bold text-gray-700">{task.progress}%</span>
            </div>
          </div>
        )}
        <Row label="创建时间" value={formatFullDate(task.createdAt)} />
      </div>

      <div className="flex gap-3">
        {task.status !== 'done' ? (
          <button onClick={() => completeTask(task.id)}
            className="flex-1 py-3.5 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 card-press text-[15px]">标记完成</button>
        ) : (
          <button onClick={() => uncompleteTask(task.id)}
            className="flex-1 py-3.5 bg-gray-200 text-gray-700 rounded-2xl font-bold card-press text-[15px]">取消完成</button>
        )}
        <button onClick={async () => { if (confirm('确定删除？')) { await removeTask(task.id); navigate(-1); } }}
          className="px-6 py-3.5 text-rose-500 bg-rose-50 rounded-2xl font-bold card-press text-[15px]">删除</button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center px-4 py-3.5">
      <span className="text-sm text-gray-400 font-medium">{label}</span>
      <span className="text-sm font-bold text-gray-700">{value}</span>
    </div>
  );
}
