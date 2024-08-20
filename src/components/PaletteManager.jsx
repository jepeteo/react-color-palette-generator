import React, { useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import {
  setPrimaryColor,
  updatePaletteColor,
  setPaletteSize,
  randomizePalette,
  toggleColorLock,
} from '../store/colorSlice';

const PaletteManager = () => {
  const dispatch = useDispatch();
  const palette = useSelector((state) => state.color.palette, shallowEqual);
  const paletteSize = useSelector((state) => state.color.paletteSize);
  const lockedColors = useSelector((state) => state.color.lockedColors);
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

  const handleSizeChange = (newSize) => {
    dispatch(setPaletteSize(newSize));
    dispatch(randomizePalette({ harmony }));
  };

  const handleRandomize = () => {
    dispatch(randomizePalette({ harmony }));
  };

  const handleLockToggle = (colorName) => {
    dispatch(toggleColorLock(colorName));
  };

  if (!palette || typeof palette !== 'object') {
    return <div>Error: Invalid palette data!</div>;
  }

  return (
    <div className="containerCustomizePalette">
      <h2 className="containerTitle">Palette Manager</h2>
      <div className="sizeAdjuster">
        <label htmlFor="paletteSize">Palette Size:</label>
        <input
          type="number"
          id="paletteSize"
          min="2"
          max="10"
          value={paletteSize}
          onChange={(e) => handleSizeChange(parseInt(e.target.value, 10))}
        />
      </div>
      <div className="containerPalette">
        {Object.entries(palette)
          .slice(0, paletteSize)
          .map(([name, color]) => (
            <div key={name} className="paletteItems">
              <label htmlFor={`color-${name}`} className="mr-2">
                {name}:
              </label>
              <span className="">{color}</span>
              <input
                type="color"
                id={`color-${name}`}
                value={color ?? '#000000'}
                onChange={(e) => handleColorChange(name, e.target.value)}
                className="h-8 w-8"
              />
              <button onClick={() => handleLockToggle(name)}>
                {lockedColors[name] ? '🔒' : '🔓'}
              </button>
            </div>
          ))}
      </div>
      <button onClick={handleRandomize}>Randomize Palette</button>
    </div>
  );
};

export default PaletteManager;
