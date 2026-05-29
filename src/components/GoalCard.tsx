import type { Objective, KeyResult } from '../types';

interface GoalCardProps {
  objective: Objective;
  krs: KeyResult[];
  taskCount: number;
  onClick: () => void;
}

export default function GoalCard({ objective, krs, taskCount, onClick }: GoalCardProps) {
  const completedKRs = krs.filter((kr) => kr.status === 'completed').length;

  return (
    <div
      onClick={onClick}
      className="card-press bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/80 shadow-sm hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-center gap-3">
        {/* Progress ring */}
        <div className="relative w-13 h-13 flex-shrink-0">
          <svg className="w-13 h-13 -rotate-90" viewBox="0 0 52 52">
            <circle cx="26" cy="26" r="22" fill="none" stroke="#f3f4f6" strokeWidth="5" />
            <circle
              cx="26" cy="26" r="22" fill="none"
              stroke={objective.color || '#8b5cf6'}
              strokeWidth="5" strokeLinecap="round"
              strokeDasharray={`${(objective.progress / 100) * 138} 138`}
              className="transition-all duration-700"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-extrabold text-gray-700">
            {objective.progress}%
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-gray-800 truncate">{objective.title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {krs.length} 个KR · {completedKRs} 完成 · {taskCount} 个任务
          </p>
          {objective.description && (
            <p className="text-xs text-gray-300 mt-1 line-clamp-1">{objective.description}</p>
          )}
        </div>

        <svg className="w-4 h-4 text-gray-300 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </div>

      {/* KR mini progress bars */}
      {krs.length > 0 && (
        <div className="mt-3 space-y-1">
          {krs.slice(0, 3).map((kr) => (
            <div key={kr.id} className="flex items-center gap-2 text-xs">
              <span className="w-24 text-gray-500 truncate">{kr.title}</span>
              <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${kr.progress}%`, backgroundColor: objective.color || '#8b5cf6' }} />
              </div>
              <span className="w-8 text-right text-gray-400 font-medium">{kr.progress}%</span>
            </div>
          ))}
          {krs.length > 3 && (
            <p className="text-xs text-gray-300">+{krs.length - 3} 个KR</p>
          )}
        </div>
      )}
    </div>
  );
}
