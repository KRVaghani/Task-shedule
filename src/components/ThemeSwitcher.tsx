import { useEffect, useState } from 'react';
import { BsSun, BsMoonStars } from 'react-icons/bs';

type Theme = 'light' | 'dark';

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Check if user has a saved theme preference
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light-theme', 'dark-theme');

    // Apply new theme
    root.classList.add(`${newTheme}-theme`);

    // Save theme preference
    localStorage.setItem('theme', newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  return (
    <div className="theme-switcher">
      <button
        onClick={toggleTheme}
        className="theme-button"
        title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      >
        {theme === 'light' ? <BsMoonStars size={20} /> : <BsSun size={20} />}
      </button>
    </div>
  );
}