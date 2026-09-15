import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  color?: 'blue' | 'green' | 'orange' | 'red';
}

const colorMap = {
  blue: {
    bg: 'bg-red-500/10',
    icon: 'text-red-400',
    border: 'border-blue-100',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
    border: 'border-green-100',
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'text-orange-600',
    border: 'border-orange-100',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    border: 'border-red-100',
  },
};

export default function StatsCard({ title, value, icon: Icon, subtitle, color = 'blue' }: StatsCardProps) {
  const colors = colorMap[color];

  return (
    <div className={`bg-slate-900/60 backdrop-blur-sm rounded-xl border ${colors.border} p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`${colors.bg} p-3 rounded-xl`}>
          <Icon className={`h-6 w-6 ${colors.icon}`} />
        </div>
      </div>
    </div>
  );
}
