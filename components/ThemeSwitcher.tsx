import React from 'react';
import { themes } from '../themes';

interface ThemeSwitcherProps {
  currentThemeId: string;
  onThemeChange: (id: string) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentThemeId, onThemeChange }) => {
  return (
    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg">
       <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 ml-2">السمة</span>
       <div className="flex items-center gap-2">
            {themes.map(theme => (
                <button
                    key={theme.id}
                    title={theme.name}
                    onClick={() => onThemeChange(theme.id)}
                    className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${currentThemeId === theme.id ? 'border-gray-800 dark:border-gray-200 scale-110 shadow-md' : 'border-transparent hover:scale-110'}`}
                    style={{ backgroundColor: theme.colors['--color-primary-action'] }}
                    aria-label={`Select ${theme.name} theme`}
                    aria-pressed={currentThemeId === theme.id}
                />
            ))}
       </div>
    </div>
  );
};

export default ThemeSwitcher;