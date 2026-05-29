import type { KeyResult } from '../types';

interface KRItemProps {
  kr: KeyResult;
  color?: string;
  onChange: (id: string, field: Partial<KeyResult>) => void;
  onDelete: (id: string) => void;
}

export default function KRItem({ kr, color, onChange, onDelete }: KRItemProps) {
  return (
    <div className="bg-gray-50 rounded-2xl p-3 space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={kr.title}
          onChange={(e) => onChange(kr.id, { title: e.target.value })}
          placeholder="关键结果..."
          className="flex-1 bg-transparent text-sm font-semibold text-gray-700 placeholder:text-gray-300 focus:outline-none"
        />
        <button onClick={() => onDelete(kr.id)} className="text-gray-300 hover:text-rose-400 p-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <input
          type="number"
          value={kr.currentValue}
          onChange={(e) => {
            const v = Number(e.target.value);
            onChange(kr.id, { currentValue: v, progress: Math.min(100, Math.round((v / kr.targetValue) * 100)) });
          }}
          className="w-16 px-2 py-1 bg-white rounded-lg text-center font-semibold text-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-300"
        />
        <span className="text-gray-300">/</span>
        <input
          type="number"
          value={kr.targetValue}
          onChange={(e) => {
            const v = Number(e.target.value) || 100;
            onChange(kr.id, { targetValue: v, progress: Math.min(100, Math.round((kr.currentValue / v) * 100)) });
          }}
          className="w-16 px-2 py-1 bg-white rounded-lg text-center font-semibold text-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-300"
        />
        <span className="text-gray-400 ml-1">{kr.unit || '%'}</span>

        <div className="flex-1" />
        <div className="flex items-center gap-1">
          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${kr.progress}%`, backgroundColor: color || '#8b5cf6' }} />
          </div>
          <span className="text-gray-500 font-semibold w-8 text-right">{kr.progress}%</span>
        </div>
      </div>
    </div>
  );
}
