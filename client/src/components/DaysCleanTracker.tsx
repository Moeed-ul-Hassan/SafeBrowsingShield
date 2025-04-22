import { FC } from 'react';
import { useQuery } from '@tanstack/react-query';

const DaysCleanTracker: FC = () => {
  // In a real implementation, we'd fetch this from the API
  const { data, isLoading } = useQuery({
    queryKey: ['/api/users/1'],
    queryFn: async () => {
      // For demo purposes, return mock data
      return {
        daysClean: 12,
        startDate: new Date().toISOString()
      };
    }
  });

  const getProgressMessage = (days: number) => {
    if (days === 0) return "You're just getting started. Stay strong!";
    if (days < 7) return "The first week is crucial. Keep going!";
    if (days < 14) return "You're making great progress!";
    if (days < 30) return "Almost a month clean. Amazing work!";
    if (days < 90) return "You're building a new habit!";
    return "Incredible commitment!";
  };

  const getProgressPercentage = (days: number) => {
    // Calculate percentage towards 30-day milestone
    const percentage = Math.min(100, (days / 30) * 100);
    return `${percentage}%`;
  };

  if (isLoading) {
    return (
      <div className="bg-slate-50 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-slate-200 rounded mb-2"></div>
        <div className="w-full bg-slate-200 rounded-full h-2 mb-2"></div>
        <div className="h-4 bg-slate-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-700">Days Clean</span>
        <span className="text-sm font-bold text-primary-600">{data?.daysClean || 0}</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div 
          className="bg-primary-600 h-2 rounded-full" 
          style={{ width: getProgressPercentage(data?.daysClean || 0) }}
        ></div>
      </div>
      <div className="text-xs text-slate-500 mt-2 text-center">
        <span>{getProgressMessage(data?.daysClean || 0)}</span>
      </div>
    </div>
  );
};

export default DaysCleanTracker;
