'use client';

import { ReactNode, useState } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({ children, content, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={`absolute ${positionClasses[position]} z-50 px-3 py-2 text-sm text-white glass-strong rounded-lg whitespace-nowrap animate-fade-in`}
          role="tooltip"
        >
          {content}
          <div className={`absolute ${
            position === 'top' ? 'top-full left-1/2 -translate-x-1/2 border-t-white/20' :
            position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 border-b-white/20' :
            position === 'left' ? 'left-full top-1/2 -translate-y-1/2 border-l-white/20' :
            'right-full top-1/2 -translate-y-1/2 border-r-white/20'
          } w-0 h-0 border-4 border-transparent`} />
        </div>
      )}
    </div>
  );
}
