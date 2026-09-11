import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light-green' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme | string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('gamelearn_theme');
    // If explicitly set to clean light, use light, otherwise default to lush light-green
    if (saved === 'light') return 'light';
    return 'light-green';
  });

  useEffect(() => {
    const root = document.documentElement;
    // Permanently remove dark mode class
    root.classList.remove('dark');

    if (theme === 'light-green') {
      root.classList.add('theme-light-green');
      root.setAttribute('data-theme', 'light-green');
    } else {
      root.classList.remove('theme-light-green');
      root.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('gamelearn_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light-green' ? 'light' : 'light-green'));
  };

  const setTheme = (t: Theme | string) => {
    if (t === 'light') {
      setThemeState('light');
    } else {
      setThemeState('light-green');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
