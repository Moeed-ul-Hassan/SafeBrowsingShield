import { FC } from 'react';
import { Button } from '@/components/ui/button';

interface BlockedOverlayProps {
  onClose: () => void;
}

const BlockedOverlay: FC<BlockedOverlayProps> = ({ onClose }) => {
  // In a real implementation, we might log this block attempt and
  // potentially notify accountability partners

  const getRandomQuote = () => {
    const quotes = [
      "Every time you resist temptation, you become stronger than you were before.",
      "Recovery is not for people who need it, it's for people who want it.",
      "The best time to plant a tree was 20 years ago. The second best time is now.",
      "Progress is impossible without change, and those who cannot change their minds cannot change anything.",
      "You don't have to be great to start, but you have to start to be great."
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full text-center">
        <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-shield-alt text-3xl text-red-600"></i>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">Content Blocked</h2>
        <p className="text-slate-600 mb-6">
          This website contains explicit content that you've chosen to block as part of your recovery journey.
        </p>

        <div className="bg-slate-50 rounded-lg p-6 mb-6">
          <blockquote className="text-xl italic text-slate-700 mb-2">
            "{getRandomQuote()}"
          </blockquote>
          <p className="text-sm text-slate-500">Remember why you started this journey</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={onClose}
            className="flex-1 bg-primary-600 hover:bg-primary-700"
          >
            <i className="fas fa-arrow-left mr-2"></i> Go Back
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => {
              window.location.href = '/motivation';
            }}
          >
            <i className="fas fa-brain mr-2"></i> View Motivation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlockedOverlay;
