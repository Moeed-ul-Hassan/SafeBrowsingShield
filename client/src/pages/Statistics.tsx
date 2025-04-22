import { FC } from 'react';
import StatsCard from '@/components/StatsCard';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Statistics: FC = () => {
  // In a real implementation, we'd fetch this from an API
  const { data: monthlyData, isLoading: isLoadingMonthly } = useQuery({
    queryKey: ['/api/stats/monthly/1'],
    queryFn: async () => {
      // For demo purposes
      return [
        { name: 'Jan', blocks: 120 },
        { name: 'Feb', blocks: 98 },
        { name: 'Mar', blocks: 85 },
        { name: 'Apr', blocks: 65 },
        { name: 'May', blocks: 45 },
        { name: 'Jun', blocks: 40 },
      ];
    }
  });

  // In a real implementation, we'd fetch this from an API
  const { data: timeOfDayData, isLoading: isLoadingTimeOfDay } = useQuery({
    queryKey: ['/api/stats/time-of-day/1'],
    queryFn: async () => {
      // For demo purposes
      return [
        { name: 'Morning (6am-12pm)', blocks: 15 },
        { name: 'Afternoon (12pm-6pm)', blocks: 30 },
        { name: 'Evening (6pm-12am)', blocks: 45 },
        { name: 'Night (12am-6am)', blocks: 25 },
      ];
    }
  });

  // In a real implementation, we'd fetch this from an API
  const { data: streakData, isLoading: isLoadingStreak } = useQuery({
    queryKey: ['/api/stats/streak/1'],
    queryFn: async () => {
      // For demo purposes
      return {
        currentStreak: 12,
        longestStreak: 15,
        totalDaysClean: 27,
        relapses: 2,
        startDate: '2023-04-15'
      };
    }
  });

  return (
    <div className="flex-1 p-6">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Statistics</h1>
        <p className="text-slate-500 mt-1">View your progress and identify patterns</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <StatsCard />
        
        {/* Progress Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Progress Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStreak ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-20 bg-slate-100 rounded"></div>
                <div className="h-20 bg-slate-100 rounded"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-sm text-slate-500 mb-1">Current Streak</div>
                  <div className="flex items-end">
                    <span className="text-3xl font-bold text-primary-600">{streakData?.currentStreak}</span>
                    <span className="ml-1 text-sm text-slate-500">days</span>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-sm text-slate-500 mb-1">Longest Streak</div>
                  <div className="flex items-end">
                    <span className="text-3xl font-bold text-primary-600">{streakData?.longestStreak}</span>
                    <span className="ml-1 text-sm text-slate-500">days</span>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-sm text-slate-500 mb-1">Total Days Clean</div>
                  <div className="flex items-end">
                    <span className="text-3xl font-bold text-green-600">{streakData?.totalDaysClean}</span>
                    <span className="ml-1 text-sm text-slate-500">days</span>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-sm text-slate-500 mb-1">Journey Started</div>
                  <div className="font-semibold text-slate-700">
                    {new Date(streakData?.startDate || '').toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {isLoadingMonthly ? (
                <div className="w-full h-full bg-slate-100 rounded animate-pulse"></div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="blocks" 
                      name="Blocked Attempts"
                      stroke="hsl(var(--primary))" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="text-sm text-slate-500 mt-4 text-center">
              <p>Your blocked attempts are decreasing over time - a sign of great progress!</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Time of Day Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Time of Day Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {isLoadingTimeOfDay ? (
                <div className="w-full h-full bg-slate-100 rounded animate-pulse"></div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={timeOfDayData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="blocks" 
                      name="Blocked Attempts" 
                      fill="hsl(var(--primary))" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="text-sm text-slate-500 mt-4 text-center">
              <p>This analysis helps you identify your most vulnerable time periods.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Statistics;
