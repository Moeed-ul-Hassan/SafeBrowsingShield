import { FC } from 'react';
import ProtectionCard from '@/components/ProtectionCard';
import StrictModeCard from '@/components/StrictModeCard';
import { useQuery } from '@tanstack/react-query';

const Protection: FC = () => {
  // In a real implementation, we'd fetch this from an API
  const { data: blocklistStats, isLoading } = useQuery({
    queryKey: ['/api/blocklist/stats'],
    queryFn: async () => {
      // For demo purposes
      return {
        totalDomains: 15782,
        adultSites: 12450,
        socialMedia: 235,
        gambling: 1257,
        other: 1840
      };
    }
  });

  return (
    <div className="flex-1 p-6">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Protection Settings</h1>
        <p className="text-slate-500 mt-1">Configure and manage your content filtering</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProtectionCard />
        <StrictModeCard />
        
        {/* Blocklist Info Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200">
            <h2 className="font-bold text-lg text-slate-800">Blocklist Information</h2>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-4">
                  <i className="fas fa-ban"></i>
                </div>
                <div>
                  <h3 className="font-medium text-slate-800">Comprehensive Protection</h3>
                  <p className="text-sm text-slate-500">
                    Our blocklist is regularly updated with known adult sites
                  </p>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-5 bg-slate-100 rounded w-1/3"></div>
                <div className="h-20 bg-slate-100 rounded"></div>
                <div className="h-5 bg-slate-100 rounded w-1/2"></div>
                <div className="h-5 bg-slate-100 rounded w-1/4"></div>
              </div>
            ) : (
              <>
                <div className="mb-5">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Current Blocklist Size</h4>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-primary-600">{blocklistStats?.totalDomains.toLocaleString()}</span>
                    <span className="ml-2 text-sm text-slate-500">domains</span>
                  </div>
                </div>

                <div className="mb-5">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Blocklist Categories</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-600">Adult Sites</span>
                        <span className="text-xs font-medium text-slate-700">
                          {blocklistStats?.adultSites.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div 
                          className="bg-primary-600 h-1.5 rounded-full" 
                          style={{ width: `${(blocklistStats?.adultSites || 0) / (blocklistStats?.totalDomains || 1) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-600">Social Media</span>
                        <span className="text-xs font-medium text-slate-700">
                          {blocklistStats?.socialMedia.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div 
                          className="bg-secondary-500 h-1.5 rounded-full" 
                          style={{ width: `${(blocklistStats?.socialMedia || 0) / (blocklistStats?.totalDomains || 1) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-600">Gambling</span>
                        <span className="text-xs font-medium text-slate-700">
                          {blocklistStats?.gambling.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div 
                          className="bg-yellow-500 h-1.5 rounded-full" 
                          style={{ width: `${(blocklistStats?.gambling || 0) / (blocklistStats?.totalDomains || 1) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-600">Other</span>
                        <span className="text-xs font-medium text-slate-700">
                          {blocklistStats?.other.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div 
                          className="bg-accent-500 h-1.5 rounded-full" 
                          style={{ width: `${(blocklistStats?.other || 0) / (blocklistStats?.totalDomains || 1) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="text-sm text-slate-500">
              <p>Our blocklist is automatically updated daily to ensure the highest level of protection.</p>
            </div>
          </div>
        </div>

        {/* NSFW Detection Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200">
            <h2 className="font-bold text-lg text-slate-800">NSFW Detection Technology</h2>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center text-accent-600 mr-4">
                  <i className="fas fa-eye-slash"></i>
                </div>
                <div>
                  <h3 className="font-medium text-slate-800">AI-Powered Content Filtering</h3>
                  <p className="text-sm text-slate-500">
                    Using TensorFlow.js to detect and blur explicit images
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-5">
              <h4 className="text-sm font-medium text-slate-700 mb-2">How It Works</h4>
              <div className="space-y-4 text-sm text-slate-600">
                <p>
                  FocusShield uses NSFW.js, a machine learning model that runs directly in your browser to classify images 
                  in real-time without sending any data to external servers.
                </p>
                <p>
                  The model can identify and automatically blur potentially explicit content with high accuracy 
                  before it even appears on your screen.
                </p>
              </div>
            </div>

            <div className="mb-5">
              <h4 className="text-sm font-medium text-slate-700 mb-2">Classification Categories</h4>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="bg-slate-50 p-3 rounded">
                  <div className="font-medium mb-1 text-slate-700">Neutral</div>
                  <div className="text-xs text-slate-500">Safe content</div>
                </div>
                <div className="bg-slate-50 p-3 rounded">
                  <div className="font-medium mb-1 text-slate-700">Drawing</div>
                  <div className="text-xs text-slate-500">Illustrations/anime</div>
                </div>
                <div className="bg-slate-50 p-3 rounded">
                  <div className="font-medium mb-1 text-red-700">Pornographic</div>
                  <div className="text-xs text-slate-500">Explicit content</div>
                </div>
                <div className="bg-slate-50 p-3 rounded">
                  <div className="font-medium mb-1 text-red-700">Sexy</div>
                  <div className="text-xs text-slate-500">Suggestive content</div>
                </div>
              </div>
            </div>

            <div className="text-sm text-slate-500">
              <p>Images classified as potentially explicit are automatically blurred to protect you.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Protection;
