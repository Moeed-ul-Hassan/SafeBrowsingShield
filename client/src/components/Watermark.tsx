import { FC } from 'react';

const Watermark: FC = () => {
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="text-xs text-slate-500 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
        <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Made on Zylox
        </span> by Moeed Mirza
      </div>
    </div>
  );
};

export default Watermark;