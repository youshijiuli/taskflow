export default function StatCard({
  label,
  value,
  subtitle,
  trend,
}: {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down';
}) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-gray-200 transition-colors shadow-sm">
      <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-gray-900 tracking-tight">{value}</span>
        {trend && (
          <span className={`text-xs font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend === 'up' ? '↑' : '↓'}
          </span>
        )}
      </div>
      {subtitle && <div className="text-xs text-gray-400 mt-1.5 font-medium">{subtitle}</div>}
    </div>
  );
}
