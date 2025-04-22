import { FC, ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: string | number;
    direction: 'up' | 'down';
  };
  icon: ReactNode;
  iconBgColor: string;
  textColor: string;
  showDot?: boolean;
}

const StatCard: FC<StatCardProps> = ({ 
  title, 
  value, 
  trend, 
  icon, 
  iconBgColor, 
  textColor,
  showDot = false
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-slate-500">{title}</span>
          <div className="mt-1 flex items-center">
            <span className={`text-lg font-bold ${textColor}`}>{value}</span>
            {trend && (
              <span className={`ml-2 text-xs ${trend.direction === 'up' ? 'text-red-500' : 'text-green-500'}`}>
                <i className={`fas fa-arrow-${trend.direction}`}></i> {trend.value}
              </span>
            )}
            {showDot && <span className="ml-2 w-2 h-2 rounded-full bg-green-600"></span>}
          </div>
        </div>
        <div className={`rounded-full ${iconBgColor} p-3`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
