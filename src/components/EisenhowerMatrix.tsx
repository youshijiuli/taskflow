import { useTaskStore } from '../store/taskStore';
import { useNavigate } from 'react-router-dom';
import type { Task, Quadrant } from '../types';
import PriorityBadge from './PriorityBadge';

const QUADRANTS: { id: Quadrant; label: string; desc: string; bg: string }[] = [
  { id: 'q1', label: '紧急重要', desc: '立即去做', bg: 'bg-rose-50/70' },
  { id: 'q2', label: '重要不紧急', desc: '计划安排', bg: 'bg-blue-50/70' },
  { id: 'q3', label: '紧急不重要', desc: '委托他人', bg: 'bg-amber-50/70' },
  { id: 'q4', label: '不紧急不重要', desc: '尽量删除', bg: 'bg-gray-50/70' },
];

export default function EisenhowerMatrix({ tasks }: { tasks: Task[] }) {
  const updateTask = useTaskStore((s) => s.update);
  const navigate = useNavigate();

  const getQuadrant = (q: Quadrant) => tasks.filter((t) => t.quadrant === q);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = async (e: React.DragEvent, quadrant: Quadrant) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        await updateTask(taskId, { quadrant });
      }
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2 h-[calc(100dvh-240px)]">
      {QUADRANTS.map(({ id, label, desc, bg }) => {
        const items = getQuadrant(id);
        return (
          <div
            key={id}
            className={`${bg} rounded-2xl p-2 flex flex-col overflow-hidden`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, id)}
          >
            <div className="text-center mb-1.5 px-1">
              <p className="text-[11px] font-bold text-gray-600">{label}</p>
              <p className="text-[9px] text-gray-300">{desc}</p>
              <p className="text-[10px] text-gray-300 mt-0.5">{items.length}</p>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1">
              {items.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  onClick={() => navigate(`/task/${task.id}`)}
                  className="bg-white rounded-xl p-2 shadow-sm border border-gray-50 cursor-pointer card-press active:cursor-grabbing"
                >
                  <p className="text-[11px] font-semibold text-gray-700 line-clamp-2 leading-snug">{task.title}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <PriorityBadge priority={task.priority} />
                  </div>
                </div>
              ))}
              {items.length === 0 && <div className="text-[10px] text-gray-300 text-center py-3">拖拽任务</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
