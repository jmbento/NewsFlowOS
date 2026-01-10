import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { theme, Theme } from '../services/theme';

const ThemeLanguageToggle: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(theme.getTheme());

  useEffect(() => {
    const handleThemeChange = (e: CustomEvent) => {
      setCurrentTheme(e.detail);
    };

    window.addEventListener('themeChanged', handleThemeChange as EventListener);

    return () => {
      window.removeEventListener('themeChanged', handleThemeChange as EventListener);
    };
  }, []);

  const handleThemeToggle = () => {
    theme.toggle();
  };

  return (
    <div className="flex items-center gap-2">
      {/* Theme Toggle */}
      <button
        onClick={handleThemeToggle}
        className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
        title={currentTheme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
      >
        {currentTheme === 'dark' ? (
          <Sun className="w-4 h-4 text-zinc-400 group-hover:text-amber-500 transition-colors" />
        ) : (
          <Moon className="w-4 h-4 text-zinc-400 group-hover:text-brand-neon-purple transition-colors" />
        )}
      </button>
    </div>
  );
};

export default ThemeLanguageToggle;
