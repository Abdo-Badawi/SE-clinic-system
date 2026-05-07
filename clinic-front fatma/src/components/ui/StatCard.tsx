import type { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  trend?: string;
  trendUp?: boolean;
  color: 'blue' | 'green' | 'amber' | 'red';
}

const colorMap = {
  blue:  { icon: 'bg-primary-50 text-primary-600',  ring: 'bg-primary-100' },
  green: { icon: 'bg-emerald-50 text-emerald-600',  ring: 'bg-emerald-100' },
  amber: { icon: 'bg-amber-50 text-amber-600',       ring: 'bg-amber-100' },
  red:   { icon: 'bg-red-50 text-red-600',           ring: 'bg-red-100' },
};

export default function StatCard({ icon, value, label, trend, trendUp, color }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className="card p-5 relative overflow-hidden hover:-translate-y-0.5 transition-transform duration-200">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${c.icon} mb-4`}>
        {icon}
      </div>
      <div className="text-3xl font-bold text-slate-800 font-display leading-none">{value}</div>
      <div className="text-sm text-slate-400 mt-1">{label}</div>
      {trend && (
        <div className={`text-xs font-medium mt-2 flex items-center gap-1 ${trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
          {trendUp ? '▲' : '▼'} {trend}
        </div>
      )}
      {/* decorative bg circle */}
      <div className={`absolute -top-4 -end-4 w-20 h-20 rounded-full ${c.ring} opacity-50`} />
    </div>
  );
}
