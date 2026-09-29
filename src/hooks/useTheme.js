import { useState, useEffect } from 'react';
import { THEMES } from '../types/habit';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('winter_arc_theme') || 'theme-pastel';
  });

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('winter_arc_theme', theme);
  }, [theme]);

  const currentThemeObj = THEMES.find(t => t.id === theme) || THEMES[0];

  return { theme, setTheme, currentThemeObj, themes: THEMES };
}
