import type { Priority } from '../types';

const config: Record<Priority, { label: string; cls: string }> = {
  urgent: { label: '紧急', cls: 'bg-rose-100 text-rose-600' },
  high: { label: '高', cls: 'bg-orange-100 text-orange-600' },
  medium: { label: '中', cls: 'bg-amber-100 text-amber-600' },
  low: { label: '低', cls: 'bg-gray-100 text-gray-500' },
};

export default function PriorityBadge({ priority }: { priority: Priority }) {
  const c = config[priority];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold tracking-wide ${c.cls}`}>
      {c.label}
    </span>
  );
}
