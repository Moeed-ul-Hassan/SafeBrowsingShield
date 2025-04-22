import { FC, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface VpnDetectedOverlayProps {
  onClose: () => void;
}

const VpnDetectedOverlay: FC<VpnDetectedOverlayProps> = ({ onClose }) => {
  // In a real implementation, we'd notify accountability partners
  // and log this attempt
  const notifyPartnerMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/notification', {
        userId: 1,
        type: 'vpn_detected',
        timestamp: new Date().toISOString()
      });
    }
  });

  useEffect(() => {
    // Attempt to notify partner when VPN is detected
    notifyPartnerMutation.mutate();
  }, []);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full text-center">
        <div className="w-24 h-24 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-exclamation-triangle text-3xl text-yellow-600"></i>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">VPN Detected</h2>
        <p className="text-slate-600 mb-6">
          We've detected that you're using a VPN or proxy service. This might be an attempt to bypass your content filters.
        </p>

        <div className="bg-red-50 rounded-lg p-6 mb-6 border border-red-100">
          <h3 className="font-medium text-red-800 mb-2">This attempt has been logged</h3>
          <p className="text-sm text-red-700">
            Your accountability partner will be notified about this activity. Remember, recovery comes from honesty with yourself and others.
          </p>
        </div>

        <Button 
          onClick={onClose}
          className="bg-primary-600 hover:bg-primary-700"
        >
          <i className="fas fa-check mr-2"></i> I Understand
        </Button>
      </div>
    </div>
  );
};

export default VpnDetectedOverlay;
