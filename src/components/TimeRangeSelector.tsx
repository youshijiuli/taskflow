type Range = '7d' | '30d' | '90d' | 'all';

export default function TimeRangeSelector({
  value,
  onChange,
}: {
  value: Range;
  onChange: (r: Range) => void;
}) {
  const options: { value: Range; label: string }[] = [
    { value: '7d', label: '7天' },
    { value: '30d', label: '30天' },
    { value: '90d', label: '90天' },
    { value: 'all', label: '全部' },
  ];

  return (
    <div className="flex bg-gray-100/80 rounded-xl p-0.5">
      {options.map(({ value: v, label }) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`px-3 py-1.5 text-[11px] font-bold rounded-[10px] transition-all ${
            value === v ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400'
          }`}>
          {label}
        </button>
      ))}
    </div>
  );
}
