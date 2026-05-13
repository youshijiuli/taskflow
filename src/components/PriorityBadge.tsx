import type { Priority } from '../types';

const config: Record<Priority, { label: string; cls: string }> = {
  urgent: { label: '紧急', cls: 'bg-red-50 text-red-600' },
  high: { label: '高优先', cls: 'bg-orange-50 text-orange-600' },
  medium: { label: '中等', cls: 'bg-amber-50 text-amber-600' },
  low: { label: '低优先', cls: 'bg-gray-50 text-gray-500' },
};

export default function PriorityBadge({ priority }: { priority: Priority }) {
  const c = config[priority];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-wide ${c.cls}`}>
      {c.label}
    </span>
  );
}
