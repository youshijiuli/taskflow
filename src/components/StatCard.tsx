export default function StatCard({
  label, value, subtitle, gradient,
}: {
  label: string;
  value: string | number;
  subtitle?: string;
  gradient: string;
}) {
  return (
    <div className={`rounded-3xl p-4 bg-gradient-to-br ${gradient} text-white shadow-lg card-press`}>
      <div className="text-xs font-medium opacity-70 mb-1.5">{label}</div>
      <div className="text-3xl font-extrabold tracking-tight">{value}</div>
      {subtitle && <div className="text-xs font-medium opacity-60 mt-1">{subtitle}</div>}
    </div>
  );
}
