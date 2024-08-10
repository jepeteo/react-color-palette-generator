import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPrimaryColor, updatePaletteColor } from '../store/colorSlice';
import { generatePalette } from '../utils/colorUtils';

function PaletteCustomizer() {
  const primaryColor = useSelector((state) => state.color.primaryColor);
  const palette = useSelector((state) => state.color.palette);
  const dispatch = useDispatch();

  const handleColorChange = (colorName, newValue) => {
    dispatch(updatePaletteColor({ colorName, newValue }));

    if (colorName === 'primary') {
      dispatch(setPrimaryColor(newValue));
    }
  };

  if (!palette || typeof palette !== 'object') {
    return <div>Loading palette...</div>;
  }
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
