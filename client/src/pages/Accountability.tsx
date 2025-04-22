import { FC } from 'react';
import AccountabilityCard from '@/components/AccountabilityCard';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Accountability: FC = () => {
  // In a real implementation, we'd fetch this from an API
  const { data: partners, isLoading } = useQuery({
    queryKey: ['/api/accountability-partners/1'],
    queryFn: async () => {
      // For demo purposes
      return [];
    }
  });

  // In a real implementation, we'd fetch this from an API
  const { data: logs, isLoading: isLoadingLogs } = useQuery({
    queryKey: ['/api/accountability-logs/1'],
    queryFn: async () => {
      // For demo purposes
      return [
        { id: 1, type: 'blocked_site', url: 'example.com/adult', timestamp: '2023-05-02T14:23:15Z' },
        { id: 2, type: 'vpn_detected', timestamp: '2023-05-01T09:15:30Z' },
        { id: 3, type: 'settings_changed', change: 'Enabled strict mode', timestamp: '2023-04-30T18:45:22Z' }
      ];
    }
  });

  return (
    <div className="flex-1 p-6">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Accountability</h1>
        <p className="text-slate-500 mt-1">Manage your accountability partners and view activity logs</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AccountabilityCard />
        
        {/* Accountability Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Logs</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingLogs ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-14 bg-slate-100 rounded"></div>
                <div className="h-14 bg-slate-100 rounded"></div>
                <div className="h-14 bg-slate-100 rounded"></div>
              </div>
            ) : logs && logs.length > 0 ? (
              <div className="space-y-4">
                {logs.map((log) => (
                  <div key={log.id} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-start">
                      <div className="mt-0.5">
                        {log.type === 'blocked_site' && (
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
                            <i className="fas fa-ban text-sm"></i>
                          </span>
                        )}
                        {log.type === 'vpn_detected' && (
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                            <i className="fas fa-exclamation-triangle text-sm"></i>
                          </span>
                        )}
                        {log.type === 'settings_changed' && (
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <i className="fas fa-cog text-sm"></i>
                          </span>
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">
                            {log.type === 'blocked_site' && 'Blocked Site Access'}
                            {log.type === 'vpn_detected' && 'VPN Usage Detected'}
                            {log.type === 'settings_changed' && 'Settings Changed'}
                          </p>
                          <span className="text-xs text-slate-500">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                          {log.type === 'blocked_site' && `Attempted to access: ${log.url}`}
                          {log.type === 'vpn_detected' && 'Attempted to use VPN to bypass filters'}
                          {log.type === 'settings_changed' && log.change}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-check text-slate-400 text-xl"></i>
                </div>
                <h3 className="text-lg font-medium text-slate-700 mb-1">No activity logs yet</h3>
                <p className="text-sm text-slate-500">
                  Activity logs will appear here when there are attempts to access blocked content or when settings are changed.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Benefits Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Benefits of Accountability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 p-5 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                  <i className="fas fa-users"></i>
                </div>
                <h3 className="font-medium text-slate-800 mb-2">Support System</h3>
                <p className="text-sm text-slate-600">
                  Having someone who knows about your journey creates a powerful support system for long-term success.
                </p>
              </div>
              
              <div className="bg-slate-50 p-5 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h3 className="font-medium text-slate-800 mb-2">Increased Commitment</h3>
                <p className="text-sm text-slate-600">
                  Sharing your goals with others increases your commitment and makes you 65% more likely to achieve them.
                </p>
              </div>
              
              <div className="bg-slate-50 p-5 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-4">
                  <i className="fas fa-brain"></i>
                </div>
                <h3 className="font-medium text-slate-800 mb-2">Rewired Thinking</h3>
                <p className="text-sm text-slate-600">
                  Accountability helps rewire your brain by creating new associations with potential relapse moments.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Accountability;
