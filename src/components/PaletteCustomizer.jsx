// src/components/PaletteCustomizer.js
import React from 'react';

function PaletteCustomizer({ palette, updatePalette, setPrimaryColor }) {
  const handleColorChange = (colorName, newValue) => {
    console.log(`Changing ${colorName} to ${newValue}`);
    updatePalette({ ...palette, [colorName]: newValue });
    if (colorName === 'primary') {
      setPrimaryColor(newValue);
    }
  };

  return (
    <div className="containerCustomizePalette">
      <h2 className="containerTitle">Customize Palette</h2>
      <div className="containerPalette">
        {Object.entries(palette).map(([name, color]) => (
          <div key={name} className="paletteItems">
            <label htmlFor={`color-${name}`} className="mr-2">
              {name}:
            </label>
            <input
              type="color"
              id={`color-${name}`}
              value={color}
              onChange={(e) => handleColorChange(name, e.target.value)}
              className="h-8 w-8"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PaletteCustomizer;
