// src/components/ThemeToggle.js
import React from 'react';

function ThemeToggle({ isDarkMode, setIsDarkMode }) {
  return (
    <div className="toggleSwitch">
      <label className="switch">
        <input
          type="checkbox"
          checked={isDarkMode}
          onChange={() => setIsDarkMode(!isDarkMode)}
        />
      </label>
      {isDarkMode ? (
        <span className="ml-2">Change to Light Theme</span>
      ) : (
        <span className="ml-2">Change to Dark Theme</span>
      )}
    </div>
  );
}

export default ThemeToggle;
