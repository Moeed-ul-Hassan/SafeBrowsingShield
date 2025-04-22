import { FC, useState } from 'react';
import StatCard from '@/components/StatCard';
import ProtectionCard from '@/components/ProtectionCard';
import StrictModeCard from '@/components/StrictModeCard';
import AccountabilityCard from '@/components/AccountabilityCard';
import StatsCard from '@/components/StatsCard';
import ExtensionPopup from '@/components/ExtensionPopup';
import { useQuery } from '@tanstack/react-query';

const Dashboard: FC = () => {
  const [showExtensionPopup, setShowExtensionPopup] = useState(false);

  // In a real implementation, we'd fetch this data from APIs
  const { data: blocksToday, isLoading: isLoadingBlocks } = useQuery({
    queryKey: ['/api/blocked-sites/today/1'],
    queryFn: async () => {
      // For demo purposes
      return 8;
    }
  });

  const { data: strictModeData, isLoading: isLoadingStrictMode } = useQuery({
    queryKey: ['/api/strict-mode/1'],
    queryFn: async () => {
      // For demo purposes
      return {
        enabled: true,
        expiresIn: 5 // days
      };
    }
  });

  return (
    <div className="flex-1 p-6">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">Manage your protection settings and view your progress</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Protection Status" 
          value="Active" 
          icon={<i className="fas fa-shield-alt text-green-600"></i>}
          iconBgColor="bg-green-100"
          textColor="text-green-600"
          showDot={true}
        />
        
        <StatCard 
          title="Blocks Today" 
          value={isLoadingBlocks ? "Loading..." : blocksToday} 
          trend={{ value: "+2", direction: "up" }}
          icon={<i className="fas fa-ban text-red-600"></i>}
          iconBgColor="bg-red-100"
          textColor="text-slate-800"
        />
        
        <StatCard 
          title="Strict Mode" 
          value={isLoadingStrictMode ? "Loading..." : `Ends in ${strictModeData?.expiresIn} days`}
          icon={<i className="fas fa-lock text-blue-600"></i>}
          iconBgColor="bg-blue-100"
          textColor="text-blue-600"
        />
      </div>

      {/* Main Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProtectionCard />
        <StrictModeCard />
        <AccountabilityCard />
        <StatsCard />
      </div>
      
      {/* Extension Popup Demo */}
      {showExtensionPopup && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center" onClick={() => setShowExtensionPopup(false)}>
          <div onClick={e => e.stopPropagation()}>
            <ExtensionPopup />
          </div>
        </div>
      )}
      
      {/* Demo Controls */}
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 flex space-x-2 z-30">
        <button 
          onClick={() => setShowExtensionPopup(true)}
          className="px-3 py-1.5 bg-primary-100 text-primary-600 rounded hover:bg-primary-200 text-sm"
        >
          Extension Demo
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
