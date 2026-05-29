import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Objective, KeyResult, Domain } from '../types';
import GoalCard from '../components/GoalCard';

const DOMAIN_LABELS: Record<Domain, string> = { work: '工作', life: '生活', study: '学习', other: '其他' };
const DOMAINS: Domain[] = ['work', 'life', 'study', 'other'];
const DOMAIN_EMOJIS: Record<Domain, string> = { work: '💼', life: '🏠', study: '📚', other: '📌' };

interface GoalsProps {
  objectives: Objective[];
  krsByObjective: Record<string, KeyResult[]>;
  taskCountByObjective: Record<string, number>;
}

export default function Goals({ objectives, krsByObjective, taskCountByObjective }: GoalsProps) {
  const navigate = useNavigate();

  const grouped = useMemo(() => {
    const map: Record<Domain, Objective[]> = { work: [], life: [], study: [], other: [] };
    objectives.forEach((o) => {
      map[o.domain]?.push(o);
    });
    return DOMAINS.filter((d) => map[d].length > 0).map((d) => ({ domain: d, objectives: map[d] }));
  }, [objectives]);

  return (
    <div className="px-4 py-4 space-y-5">
      {/* Empty state */}
      {objectives.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mb-4">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" fill="#a78bfa" />
            </svg>
          </div>
          <p className="text-sm font-bold text-gray-400">还没有目标</p>
          <p className="text-xs text-gray-300 mt-1">点击下方 + 创建第一个 OKR 目标</p>
        </div>
      )}

      {/* Grouped by domain */}
      {grouped.map(({ domain, objectives: objs }) => (
        <div key={domain}>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5 px-1 flex items-center gap-2">
            {DOMAIN_EMOJIS[domain]} {DOMAIN_LABELS[domain]}
            <span className="text-gray-300">· {objs.length}</span>
          </h3>
          <div className="space-y-2.5">
            {objs.map((o) => (
              <GoalCard
                key={o.id}
                objective={o}
                krs={krsByObjective[o.id] || []}
                taskCount={taskCountByObjective[o.id] || 0}
                onClick={() => navigate(`/goals/${o.id}`)}
              />
            ))}
          </div>
        </div>
      ))}

      {/* FAB */}
      <button
        onClick={() => navigate('/goals/new')}
        className="fixed bottom-24 right-5 w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-500 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-purple-300 card-press z-10"
        style={{ maxWidth: 'calc(100% - 40px)', right: 'max(20px, calc((100% - 480px) / 2 + 20px))' }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  );
}
