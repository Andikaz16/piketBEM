import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
}

export default function StatsCard({ title, value, icon: Icon, subtitle }: StatsCardProps) {
  return (
    <div className="glass-card rounded-2xl p-6 card-lift group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-3xl font-heading font-bold text-white mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="bg-red-600/10 p-3 rounded-xl border border-red-600/20 group-hover:bg-red-600/20 group-hover:border-red-600/30 transition-all">
          <Icon className="h-6 w-6 text-red-400" />
        </div>
      </div>
    </div>
  );
}
