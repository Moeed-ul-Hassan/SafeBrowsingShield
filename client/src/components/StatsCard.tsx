import { FC } from 'react';
import { useQuery } from '@tanstack/react-query';

const StatsCard: FC = () => {
  // In a real implementation, we'd fetch this from an API
  const { data, isLoading } = useQuery({
    queryKey: ['/api/blocked-sites/1'],
    queryFn: async () => {
      // For demo purposes
      return [
        { timestamp: '2023-05-01', category: 'Adult Websites' },
        { timestamp: '2023-05-01', category: 'Adult Websites' },
        { timestamp: '2023-05-02', category: 'Social Media' },
        { timestamp: '2023-05-03', category: 'Adult Websites' },
        { timestamp: '2023-05-04', category: 'Social Media' },
        { timestamp: '2023-05-04', category: 'Adult Websites' },
        { timestamp: '2023-05-05', category: 'Adult Websites' },
        { timestamp: '2023-05-06', category: 'Other' },
      ];
    }
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
        <div className="h-12 bg-slate-100 mb-4"></div>
        <div className="p-6">
          <div className="h-32 bg-slate-100 mb-4"></div>
        </div>
      </div>
    );
  }

  // Calculate week data (demo data)
  const weekData = [
    { day: 'M', count: 4 },
    { day: 'T', count: 6 },
    { day: 'W', count: 2 },
    { day: 'T', count: 8 },
    { day: 'F', count: 5 },
    { day: 'S', count: 3 },
    { day: 'S', count: 1 },
  ];

  // Calculate category percentages
  const categories = data ? data.reduce((acc: Record<string, number>, item: any) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {}) : {};

  const total = data ? data.length : 0;
  const categoryPercentages = Object.entries(categories).map(([name, count]) => ({
    name,
    percentage: Math.round((count / total) * 100)
  }));

  // Sort by percentage (highest first)
  categoryPercentages.sort((a, b) => b.percentage - a.percentage);

  // Define colors for categories
  const categoryColors: Record<string, string> = {
    'Adult Websites': 'bg-primary-600',
    'Social Media': 'bg-secondary-500',
    'Other': 'bg-accent-500'
  };

  const maxBarHeight = 80; // max height in pixels for bars

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-200">
        <h2 className="font-bold text-lg text-slate-800">Activity Statistics</h2>
      </div>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1 p-4 bg-slate-50 rounded-lg mb-4 md:mb-0">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Week Overview</h3>
            <div className="flex items-end justify-between h-32">
              {weekData.map((day, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="bg-primary-500 w-6 rounded-t" 
                    style={{ height: `${(day.count / 10) * maxBarHeight}px` }}
                  ></div>
                  <span className="text-xs text-slate-500 mt-1">{day.day}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 p-4 bg-slate-50 rounded-lg">
            <h3 className="text-sm font-medium text-slate-600 mb-4">Blocked Content Categories</h3>
            <div className="space-y-3">
              {categoryPercentages.map((category, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-600">{category.name}</span>
                    <span className="text-xs font-medium text-slate-700">{category.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div 
                      className={`${categoryColors[category.name] || 'bg-primary-600'} h-1.5 rounded-full`} 
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
