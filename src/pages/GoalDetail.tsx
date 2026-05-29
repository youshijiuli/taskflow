import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Objective, KeyResult, Task } from '../types';
import { formatFullDate } from '../utils/date';

interface GoalDetailProps {
  objective: Objective;
  krs: KeyResult[];
  linkedTasks: Task[];
  onToggleKR: (krId: string, current: string) => void;
  onDelete: () => void;
}

export default function GoalDetail({ objective, krs, linkedTasks, onToggleKR, onDelete }: GoalDetailProps) {
  const navigate = useNavigate();

  const tasksByKR = useMemo(() => {
    const map: Record<string, Task[]> = {};
    linkedTasks.forEach((t) => {
      if (t.keyResultId) {
        (map[t.keyResultId] ||= []).push(t);
      }
    });
    return map;
  }, [linkedTasks]);

  return (
    <div className="px-4 py-4 space-y-5">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button onClick={() => navigate(`/goals/${objective.id}/edit`)}
          className="text-sm font-bold text-purple-500 px-4 py-2 rounded-2xl hover:bg-purple-50">编辑</button>
      </div>

      <div>
        <h2 className="text-xl font-extrabold text-gray-800">{objective.title}</h2>
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
            objective.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
            objective.status === 'archived' ? 'bg-gray-100 text-gray-500' : 'bg-purple-50 text-purple-600'
          }`}>{objective.status === 'completed' ? '已完成' : objective.status === 'archived' ? '已归档' : '进行中'}</span>
          <span className="text-xs text-gray-400 font-medium">{objective.domain === 'work' ? '工作' : objective.domain === 'life' ? '生活' : objective.domain === 'study' ? '学习' : '其他'}</span>
        </div>
      </div>

      {objective.description && (
        <div className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-600 leading-relaxed">{objective.description}</div>
      )}

      {/* Overall progress */}
      <div className="bg-white rounded-3xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-gray-700">总进度</span>
          <span className="text-2xl font-extrabold text-gray-800">{objective.progress}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-pink-400 to-purple-500"
            style={{ width: `${objective.progress}%` }} />
        </div>
      </div>

      {/* Key Results */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-600">关键结果 ({krs.length})</h3>
        {krs.map((kr) => (
          <div key={kr.id} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-700">{kr.title}</span>
              <button
                onClick={() => onToggleKR(kr.id, kr.status)}
                className={`text-xs font-bold px-3 py-1 rounded-xl transition-colors ${
                  kr.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400 hover:text-emerald-600'
                }`}
              >
                {kr.status === 'completed' ? '✓ 完成' : '标记完成'}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${kr.progress}%`, backgroundColor: objective.color }} />
              </div>
              <span className="text-sm font-bold text-gray-600">{kr.progress}%</span>
            </div>
            <div className="flex justify-between mt-1.5 text-xs text-gray-400">
              <span>{kr.currentValue} / {kr.targetValue} {kr.unit}</span>
              <span>{tasksByKR[kr.id]?.length || 0} 个关联任务</span>
            </div>

            {/* Linked tasks */}
            {tasksByKR[kr.id]?.length > 0 && (
              <div className="mt-3 space-y-1.5 border-t border-gray-50 pt-3">
                {tasksByKR[kr.id].slice(0, 5).map((task) => (
                  <div key={task.id}
                    onClick={() => navigate(`/task/${task.id}`)}
                    className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700 cursor-pointer py-1"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${task.status === 'done' ? 'bg-emerald-400' : task.status === 'in_progress' ? 'bg-blue-400' : 'bg-gray-300'}`} />
                    <span className={task.status === 'done' ? 'line-through text-gray-300' : ''}>{task.title}</span>
                    {task.dueDate && <span className="text-gray-300 ml-auto">{formatFullDate(task.dueDate)}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={onDelete}
        className="w-full py-3 text-rose-500 bg-rose-50 rounded-2xl font-bold text-sm card-press">删除目标</button>
    </div>
  );
}
