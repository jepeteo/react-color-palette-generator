// src/components/ThemeToggle.js
import React from 'react';

function ThemeToggle({ isDarkMode, setIsDarkMode }) {
  return (
    <div className="flex items-center mt-4">
      <span className="mr-2">Light</span>
      <label className="switch">
        <input
          type="checkbox"
          checked={isDarkMode}
          onChange={() => setIsDarkMode(!isDarkMode)}
        />
        <span className="slider round"></span>
      </label>
      <span className="ml-2">Dark</span>
    </div>
  );
}

export default ThemeToggle;