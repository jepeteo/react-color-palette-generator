import React from 'react';

function ThemeToggle({ isDarkMode, setIsDarkMode }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-300">
          {isDarkMode ? '🌙' : '☀️'} Theme
        </span>
      </div>
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`modern-toggle ${isDarkMode ? 'active' : ''}`}
      >
        <span className="toggle-thumb" />
      </button>
    </div>
  );
}

export default ThemeToggle;
