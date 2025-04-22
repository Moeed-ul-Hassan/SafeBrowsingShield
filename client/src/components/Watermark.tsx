import { FC, useState } from 'react';

const Watermark: FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div 
        className={`
          text-xs text-slate-500 
          bg-white/80 backdrop-blur-sm 
          px-3 py-1.5 rounded-full 
          shadow-sm hover:shadow-md 
          transition-all duration-300
          border border-slate-100
          ${isHovered ? 'pl-4 pr-5' : ''}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className={`
          font-semibold 
          bg-gradient-to-r from-blue-600 to-purple-600 
          bg-clip-text text-transparent
          transition-all duration-300
          ${isHovered ? 'font-bold' : ''}
        `}>
          Made on Zylox
        </span>
        <span className={`transition-all duration-300 ${isHovered ? 'ml-1.5' : 'ml-1'}`}>
          by
        </span>
        <span className={`
          transition-all duration-300
          ${isHovered ? 'ml-1.5 text-slate-700 font-medium' : 'ml-1'}
        `}>
          Moeed Mirza
        </span>
      </div>
    </div>
  );
};

export default Watermark;