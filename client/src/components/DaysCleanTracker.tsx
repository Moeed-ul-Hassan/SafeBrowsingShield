import { FC, useEffect, useState } from 'react';
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
  
  const [animateDigit, setAnimateDigit] = useState(false);
  
  useEffect(() => {
    if (!isLoading) {
      setAnimateDigit(true);
      const timer = setTimeout(() => setAnimateDigit(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

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
  
  const getMilestoneLabel = (days: number) => {
    if (days < 30) return "30 Days";
    if (days < 90) return "90 Days";
    if (days < 180) return "180 Days";
    return "365 Days";
  };
  
  const getMilestonePercentage = (days: number) => {
    if (days < 30) return Math.min(100, (days / 30) * 100);
    if (days < 90) return Math.min(100, (days / 90) * 100);
    if (days < 180) return Math.min(100, (days / 180) * 100);
    return Math.min(100, (days / 365) * 100);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
        <div className="h-4 bg-slate-200 rounded mb-2"></div>
        <div className="w-full bg-slate-200 rounded-full h-2 mb-2"></div>
        <div className="h-4 bg-slate-200 rounded"></div>
      </div>
    );
  }
  
  const days = data?.daysClean || 0;
  const milestone = getMilestoneLabel(days);
  const percentage = getMilestonePercentage(days);

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <div className="flex flex-col items-center mb-3">
        <span className="text-sm font-medium text-slate-600 mb-2">Days Clean</span>
        <div className={`text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent ${animateDigit ? 'animate-bounce' : ''}`}>
          {days}
        </div>
      </div>
      
      <div className="mb-2 text-xs flex justify-between items-center">
        <span className="text-slate-500">Progress to {milestone}</span>
        <span className="text-primary font-semibold">{Math.round(percentage)}%</span>
      </div>
      
      <div className="w-full bg-slate-100 rounded-full h-2.5 mb-3">
        <div 
          className="bg-gradient-to-r from-primary to-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <div className="text-xs text-slate-500 text-center px-2 py-1 rounded-full bg-slate-50 border border-slate-100">
        <span>{getProgressMessage(days)}</span>
      </div>
    </div>
  );
};

export default DaysCleanTracker;
