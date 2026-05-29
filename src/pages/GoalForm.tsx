import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Objective, KeyResult, Domain } from '../types';
import KRItem from '../components/KRItem';

const DOMAIN_LABELS: Record<Domain, string> = { work: '工作', life: '生活', study: '学习', other: '其他' };
const DOMAINS: Domain[] = ['work', 'life', 'study', 'other'];
const COLORS = ['#f472b6', '#8b5cf6', '#10b981', '#f59e0b', '#6366f1', '#ec4899'];

interface GoalFormProps {
  objective?: Objective;
  existingKRs?: KeyResult[];
  onSave: (obj: Partial<Objective>, krs: Partial<KeyResult>[]) => void;
  onDelete?: () => void;
}

export default function GoalForm({ objective, existingKRs, onSave, onDelete }: GoalFormProps) {
  const navigate = useNavigate();
  const [title, setTitle] = useState(objective?.title || '');
  const [description, setDescription] = useState(objective?.description || '');
  const [domain, setDomain] = useState<Domain>(objective?.domain || 'work');
  const [color, setColor] = useState(objective?.color || COLORS[0]);
  const [krs, setKRs] = useState<Partial<KeyResult>[]>(
    existingKRs?.length
      ? existingKRs.map((kr) => ({ ...kr }))
      : [{ id: crypto.randomUUID(), title: '', targetValue: 100, currentValue: 0, unit: '%', progress: 0, status: 'active' as const, order: 0, displayOrder: 0, objectiveId: '' }]
  );

  const handleAddKR = () => {
    setKRs([...krs, { id: crypto.randomUUID(), title: '', targetValue: 100, currentValue: 0, unit: '%', progress: 0, status: 'active' as const, order: krs.length, displayOrder: krs.length, objectiveId: objective?.id || '' }]);
  };

  const handleKRChange = (krId: string, field: Partial<KeyResult>) => {
    setKRs(krs.map((kr) => kr.id === krId ? { ...kr, ...field } : kr));
  };

  const handleKRDelete = (krId: string) => {
    if (krs.length <= 1) return;
    setKRs(krs.filter((kr) => kr.id !== krId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), description: description.trim(), domain, color, status: objective?.status || 'active' }, krs);
    navigate(-1);
  };

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <h2 className="text-base font-bold text-gray-800">{objective ? '编辑目标' : '新建目标'}</h2>
        <div className="w-8" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder="目标标题" required autoFocus
          className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl text-[16px] font-semibold placeholder:text-gray-300 focus:bg-white focus:ring-2 focus:ring-purple-300 transition-all" />

        <textarea value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder="描述（可选）" rows={2}
          className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-[14px] placeholder:text-gray-300 focus:bg-white focus:ring-2 focus:ring-purple-300 resize-none transition-all" />

        <div className="flex gap-2">
          {DOMAINS.map((d) => (
            <button key={d} type="button" onClick={() => setDomain(d)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all card-press ${
                domain === d ? 'bg-purple-500 text-white shadow-lg shadow-purple-200' : 'bg-gray-100 text-gray-500'
              }`}>{DOMAIN_LABELS[d]}</button>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          {COLORS.map((c) => (
            <button key={c} type="button" onClick={() => setColor(c)}
              className="w-8 h-8 rounded-xl border-2 transition-all card-press"
              style={{ backgroundColor: c, borderColor: color === c ? '#1e1b2e' : 'transparent', transform: color === c ? 'scale(1.12)' : 'scale(1)', boxShadow: color === c ? `0 0 0 3px ${c}25` : 'none' }} />
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">关键结果 (KR)</label>
            <button type="button" onClick={handleAddKR}
              className="text-xs font-bold text-purple-500 px-2 py-1 rounded-lg hover:bg-purple-50">+ 添加</button>
          </div>
          {krs.map((kr) => (
            <KRItem key={kr.id} kr={kr as KeyResult} color={color} onChange={handleKRChange} onDelete={handleKRDelete} />
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit"
            className="flex-1 py-3.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl font-bold text-[15px] shadow-lg shadow-purple-200 card-press">
            {objective ? '保存' : '创建目标'}
          </button>
          {onDelete && (
            <button type="button" onClick={onDelete}
              className="px-6 py-3.5 text-rose-500 bg-rose-50 rounded-2xl font-bold text-[15px] card-press">删除</button>
          )}
        </div>
      </form>
    </div>
  );
}
