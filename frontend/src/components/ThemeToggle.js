import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import Button from './Button';
import apiService from '../utils/apiService';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const user = apiService.getUser();
    const savedTheme = user?.theme || 'dark';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme) => {
    if (newTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    applyTheme(newTheme);
    
    const user = apiService.getUser();
    if (user) {
      try {
        await apiService.request(`/users/${user.id}`, {
          method: 'PUT',
          body: JSON.stringify({ theme: newTheme })
        });
        
        const updatedUser = { ...user, theme: newTheme };
        apiService.setUser(updatedUser);
      } catch (error) {
        console.error('Failed to save theme:', error);
      }
    }
  };

  return (
    <div className="mb-4">
      <Button
        variant={theme === 'light' ? 'warning' : 'secondary'}
        icon={theme === 'dark' ? Sun : Moon}
        onClick={toggleTheme}
        className="w-full"
      >
        {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </Button>
    </div>
  );
};

export default ThemeToggle;
