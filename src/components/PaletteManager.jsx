import React, { useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { setPrimaryColor, updatePaletteColor } from '../store/colorSlice';
import { randomizePalette } from '../store/colorSlice';

const PaletteManager = () => {
  const dispatch = useDispatch();
  const palette = useSelector((state) => state.color.palette, shallowEqual);

  const harmony = useSelector((state) => state.color.harmony);

  const handleColorChange = useCallback(
    (colorName, newValue) => {
      dispatch(updatePaletteColor({ colorName, newValue }));

      if (colorName === 'primary') {
        dispatch(setPrimaryColor(newValue));
      }
    },
    [dispatch],
  );

  const handleRandomize = () => {
    dispatch(randomizePalette({ harmony }));
  };

  if (!palette || typeof palette !== 'object') {
    return <div>Error: Invalid palette data!</div>;
  }

  return (
    <div className="containerCustomizePalette">
      <h2 className="containerTitle">Palette Manager</h2>
      <div className="containerPalette">
        {Object.entries(palette).map(([name, color]) => (
          <div key={name} className="paletteItems">
            <label htmlFor={`color-${name}`} className="mr-2">
              {name}:
            </label>
            <span className="">{color}</span>
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
      <button onClick={handleRandomize}>Randomize Palette</button>
    </div>
  );
};
export default PaletteManager;
