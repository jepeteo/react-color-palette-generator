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
        {isDarkMode ? (
          <span className="ml-2 block w-full">Uncheck for Light Theme</span>
        ) : (
          <span className="ml-2 block w-full">Check for Dark Theme</span>
        )}
      </label>
    </div>
  );
}

export default ThemeToggle;
