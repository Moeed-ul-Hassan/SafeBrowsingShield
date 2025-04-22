import { FC, useState, useEffect } from 'react';

interface BuyMeCoffeeProps {
  username: string;
}

const BuyMeCoffee: FC<BuyMeCoffeeProps> = ({ username }) => {
  const buyMeACoffeeUrl = `https://www.buymeacoffee.com/${username}`;
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  
  // Periodically animate the button to draw attention
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setIsAnimated(true);
      setTimeout(() => setIsAnimated(false), 1000);
    }, 10000);
    
    return () => clearInterval(animationInterval);
  }, []);
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <a 
        href={buyMeACoffeeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`
          flex items-center gap-2 
          bg-gradient-to-r from-yellow-500 to-amber-500 
          hover:from-yellow-600 hover:to-amber-600
          text-white font-medium px-4 py-2 rounded-full 
          shadow-lg transition-all duration-300 hover:shadow-xl 
          ${isHovered || isAnimated ? 'translate-y-[-4px]' : ''}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          stroke="none"
          className={`transition-transform duration-300 ${isHovered ? 'rotate-12' : ''}`}
        >
          <path d="M7.5 4C7.5 4 6.5 4 6.5 3C6.5 2 7.5 2 7.5 2H19.5C19.5 2 20.5 2 20.5 3C20.5 4 19.5 4 19.5 4H7.5Z"/>
          <path d="M8.5 12V12C8.5 10.4087 9.13214 8.88258 10.2574 7.75736L10.5 7.5C11.6652 6.33481 11.6652 4.46519 10.5 3.3L10.5 3.3"/>
          <path d="M16.5 3.3C15.3348 4.46519 15.3348 6.33481 16.5 7.5L16.7426 7.75736C17.8679 8.88258 18.5 10.4087 18.5 12V12"/>
          <path d="M6.5 12H20.5V12C20.5 14.8284 20.5 16.2426 19.6213 17.1213C18.7426 18 17.3284 18 14.5 18H12.5C9.67157 18 8.25736 18 7.37868 17.1213C6.5 16.2426 6.5 14.8284 6.5 12V12Z"/>
          <path d="M12 18V21"/>
          <path d="M9 21H15"/>
        </svg>
        <span className={`${isHovered ? 'ml-1' : ''} transition-all duration-300`}>
          Buy me a coffee
        </span>
      </a>
    </div>
  );
};

export default BuyMeCoffee;