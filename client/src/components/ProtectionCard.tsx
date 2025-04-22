import { FC, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Switch } from '@/components/ui/switch';

const ProtectionCard: FC = () => {
  // In a real implementation, we'd fetch this from an API
  const { data, isLoading } = useQuery({
    queryKey: ['/api/settings/1'],
    queryFn: async () => {
      // For demo purposes
      return {
        websiteFiltering: true,
        imageDetection: true,
        vpnDetection: true,
        keywordFiltering: true
      };
    }
  });

  const [settings, setSettings] = useState({
    websiteFiltering: true,
    imageDetection: true,
    vpnDetection: true,
    keywordFiltering: true
  });

  // Update settings when data is loaded
  if (data && !isLoading && 
      (settings.websiteFiltering !== data.websiteFiltering ||
       settings.imageDetection !== data.imageDetection ||
       settings.vpnDetection !== data.vpnDetection ||
       settings.keywordFiltering !== data.keywordFiltering)) {
    setSettings(data);
  }

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: typeof settings) => {
      return apiRequest('POST', '/api/settings', {
        userId: 1,
        ...newSettings
      });
    },
    onSuccess: () => {
      // Invalidate settings cache on successful update
      console.log('Settings updated successfully');
    }
  });

  const handleChange = (setting: keyof typeof settings) => {
    const newSettings = {
      ...settings,
      [setting]: !settings[setting]
    };
    setSettings(newSettings);
    updateSettingsMutation.mutate(newSettings);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
        <div className="h-12 bg-slate-100 mb-4"></div>
        <div className="px-6 py-4">
          <div className="h-6 bg-slate-100 w-1/3 mb-3"></div>
          <div className="h-4 bg-slate-100 w-1/2 mb-6"></div>
          <div className="h-6 bg-slate-100 w-1/3 mb-3"></div>
          <div className="h-4 bg-slate-100 w-1/2 mb-6"></div>
          <div className="h-6 bg-slate-100 w-1/3 mb-3"></div>
          <div className="h-4 bg-slate-100 w-1/2 mb-6"></div>
          <div className="h-6 bg-slate-100 w-1/3 mb-3"></div>
          <div className="h-4 bg-slate-100 w-1/2 mb-6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-200">
        <h2 className="font-bold text-lg text-slate-800">Protection Settings</h2>
      </div>
      <div className="p-6">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-slate-800">Website Filtering</h3>
              <p className="text-sm text-slate-500">Block known adult websites</p>
            </div>
            <div>
              <Switch 
                checked={settings.websiteFiltering} 
                onCheckedChange={() => handleChange('websiteFiltering')} 
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-slate-800">Image Detection</h3>
              <p className="text-sm text-slate-500">Blur NSFW images using AI</p>
            </div>
            <div>
              <Switch 
                checked={settings.imageDetection} 
                onCheckedChange={() => handleChange('imageDetection')} 
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-slate-800">VPN Detection</h3>
              <p className="text-sm text-slate-500">Detect attempts to bypass using VPN</p>
            </div>
            <div>
              <Switch 
                checked={settings.vpnDetection} 
                onCheckedChange={() => handleChange('vpnDetection')} 
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-slate-800">Keyword Filtering</h3>
              <p className="text-sm text-slate-500">Block pages with explicit keywords</p>
            </div>
            <div>
              <Switch 
                checked={settings.keywordFiltering} 
                onCheckedChange={() => handleChange('keywordFiltering')} 
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button className="text-primary-600 text-sm font-medium hover:text-primary-700">
            <i className="fas fa-cog mr-1"></i> Advanced Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProtectionCard;
