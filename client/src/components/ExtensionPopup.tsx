import { FC, useState } from 'react';
import { Switch } from '@/components/ui/switch';

// This component represents what the Chrome extension popup would look like
// It's for demonstration purposes in the web app
const ExtensionPopup: FC = () => {
  const [settings, setSettings] = useState({
    websiteFiltering: true,
    imageFiltering: true,
    vpnDetection: true
  });

  const handleSettingChange = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div className="w-80 bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-primary-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-white flex items-center justify-center text-primary-600">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h2 className="ml-2 text-lg font-bold text-white">FocusShield</h2>
          </div>
          <span className="bg-green-500 text-xs text-white px-2 py-1 rounded-full">Active</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <span className="text-sm font-medium text-slate-700">Website Filtering</span>
          <Switch 
            checked={settings.websiteFiltering} 
            onCheckedChange={() => handleSettingChange('websiteFiltering')} 
            size="sm"
          />
        </div>

        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <span className="text-sm font-medium text-slate-700">Image Filtering</span>
          <Switch 
            checked={settings.imageFiltering} 
            onCheckedChange={() => handleSettingChange('imageFiltering')} 
            size="sm"
          />
        </div>

        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <span className="text-sm font-medium text-slate-700">VPN Detection</span>
          <Switch 
            checked={settings.vpnDetection} 
            onCheckedChange={() => handleSettingChange('vpnDetection')} 
            size="sm"
          />
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-600">Day streak</span>
            <span className="text-xs font-bold text-primary-600">12 days</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-primary-600 h-2 rounded-full" style={{ width: '40%' }}></div>
          </div>
        </div>

        <div className="mt-4 pt-2 border-t border-slate-100">
          <button 
            className="flex items-center text-sm text-slate-600 hover:text-primary-600"
            onClick={() => window.open('/', '_blank')}
          >
            <i className="fas fa-cog mr-1"></i> Open Settings
          </button>
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <button className="text-sm text-primary-600 font-medium">
            <i className="fas fa-external-link-alt mr-1"></i> Dashboard
          </button>
          <button className="text-sm text-red-600 font-medium">
            <i className="fas fa-sign-out-alt mr-1"></i> Lock Mode
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExtensionPopup;
