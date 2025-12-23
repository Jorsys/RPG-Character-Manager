import React, { useEffect, useState } from 'react';

const ThemeToggle: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<'medieval' | 'dark'>('medieval');

  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') as 'medieval' | 'dark' | null;
    if (savedTheme) {
      setCurrentTheme(savedTheme);
      document.documentElement.className = savedTheme;
    } else {
      document.documentElement.className = 'medieval';
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = currentTheme === 'medieval' ? 'dark' : 'medieval';
    setCurrentTheme(newTheme);
    document.documentElement.className = newTheme;
    localStorage.setItem('app-theme', newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none"
      aria-label={`Cambiar a tema ${currentTheme === 'medieval' ? 'oscuro' : 'medieval'}`}
    >
      {currentTheme === 'medieval' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle;