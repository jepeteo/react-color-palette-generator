// src/components/PaletteCustomizer.js
import React from 'react';

function PaletteCustomizer({ palette, updatePalette }) {
  const handleColorChange = (colorName, newValue) => {
    updatePalette({ ...palette, [colorName]: newValue });
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-3">Customize Palette</h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(palette).map(([name, color]) => (
          <div key={name} className="flex items-center">
            <label htmlFor={`color-${name}`} className="mr-2">{name}:</label>
            <input
              type="color"
              id={`color-${name}`}
              value={color}
              onChange={(e) => handleColorChange(name, e.target.value)}
              className="w-8 h-8 rounded-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PaletteCustomizer;