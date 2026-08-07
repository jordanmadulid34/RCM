import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { ThemeType } from '../types';

interface ThemeToggleProps {
  theme: ThemeType;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      className={`relative px-3 py-1.5 rounded-full border transition-all duration-300 cursor-pointer flex items-center space-x-1.5 ${
        isDark
          ? 'bg-[#01142E] border-[#F7A81B]/50 text-[#F7A81B] hover:border-[#F7A81B] shadow-inner'
          : 'bg-[#F2EFE8] border-[#243447]/30 text-[#243447] hover:border-[#C9982B] shadow-xs'
      }`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
        {isDark ? (
          <Moon className="w-4 h-4 text-[#F7A81B] transition-transform duration-300 transform rotate-0 hover:-rotate-12" />
        ) : (
          <Sun className="w-4 h-4 text-[#C9982B] transition-transform duration-300 transform rotate-0 hover:rotate-90" />
        )}
      </div>
      <span className="text-[11px] font-montserrat font-extrabold uppercase tracking-wider select-none">
        {isDark ? 'Dark' : 'Light'}
      </span>
    </button>
  );
};

