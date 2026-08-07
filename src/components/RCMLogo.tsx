import React from 'react';
import { ThemeType } from '../types';

interface RCMLogoProps {
  className?: string;
  theme?: ThemeType;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RotaryWheelSVG: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => {
  return (
    <img
      src="/logo/rotary-wheel-transparent.png"
      alt="Rotary International Wheel Logo"
      className={`object-contain inline-block ${className}`}
    />
  );
};

export const RCMLogo: React.FC<RCMLogoProps> = ({
  className = '',
  size = 'md',
  theme = 'dark',
  showTagline = true,
}) => {
  const isDark = theme === 'dark';
  const imgSizeClass =
    size === 'sm'
      ? 'h-8 w-8 sm:h-9 sm:w-9'
      : size === 'lg'
      ? 'h-12 w-12 sm:h-14 sm:w-14'
      : 'h-10 w-10 sm:h-12 sm:w-12';

  return (
    <div
      className={`inline-flex items-center select-none transition-transform duration-200 group hover:opacity-95 shrink-0 space-x-3 ${className}`}
    >
      {/* Official Rotary Wheel Logo on the left */}
      <img
        src="/logo/rotary-wheel-transparent.png"
        alt="Rotary International Logo"
        className={`object-contain shrink-0 drop-shadow-md group-hover:scale-[1.03] transition-transform duration-300 ${imgSizeClass}`}
      />
      {/* Brand Text Block */}
      <div className="flex flex-col text-left justify-center">
        <span
          className={`font-serif font-extrabold tracking-tight leading-tight transition-colors duration-200 ${
            size === 'sm'
              ? 'text-sm'
              : size === 'lg'
              ? 'text-xl'
              : 'text-base sm:text-lg'
          } ${isDark ? 'text-white' : 'text-[#01142E]'}`}
        >
          Rotary Club of Makati
        </span>
        {showTagline && (
          <span
            className={`font-montserrat font-extrabold uppercase tracking-widest text-[9px] sm:text-[10px] ${
              isDark ? 'text-[#F7A81B]' : 'text-[#17458F]'
            }`}
          >
            THE MOTHER CLUB • EST. 1966
          </span>
        )}
      </div>
    </div>
  );
};



