import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`relative inline-flex items-center justify-center p-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
        isDark
          ? 'bg-slate-800/90 text-amber-400 hover:bg-slate-700 border border-slate-700/80 shadow-xs'
          : 'bg-slate-100 text-indigo-600 hover:bg-slate-200 border border-slate-200 shadow-xs'
      } ${className}`}
    >
      {/* Animated icon container */}
      <div className="relative w-4 h-4 flex items-center justify-center">
        {/* Sun Icon */}
        <Sun
          className={`w-4 h-4 transition-all duration-500 transform absolute ${
            isDark
              ? 'rotate-90 scale-0 opacity-0'
              : 'rotate-0 scale-100 opacity-100 text-amber-500'
          }`}
        />

        {/* Moon Icon */}
        <Moon
          className={`w-4 h-4 transition-all duration-500 transform absolute ${
            isDark
              ? 'rotate-0 scale-100 opacity-100 text-indigo-300'
              : '-rotate-90 scale-0 opacity-0'
          }`}
        />
      </div>
    </button>
  );
};
