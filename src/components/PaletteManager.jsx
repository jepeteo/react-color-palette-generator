import React, { useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import {
  setPrimaryColor,
  updatePaletteColor,
  randomizePalette,
  toggleColorLock,
} from '../store/colorSlice';

const PaletteManager = () => {
  const dispatch = useDispatch();
  const palette = useSelector((state) => state.color.palette, shallowEqual);
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
    <div className="glass-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-header">Palette Manager</h2>
        <button
          onClick={handleRandomize}
          className="btn-secondary flex items-center gap-2"
        >
          🎲 Randomize
        </button>
      </div>

      <div className="palette-grid">
        {Object.entries(palette).map(([name, color]) => (
          <div key={name} className="color-item">
            <div className="flex items-center justify-between mb-2">
              <label className="color-label">{name}</label>
              <button
                onClick={() => handleLockToggle(name)}
                className={`text-sm transition-all duration-300 hover:scale-110 ${lockedColors[name]
                    ? 'text-yellow-400 hover:text-yellow-300'
                    : 'text-gray-400 hover:text-gray-300'
                  }`}
                title={lockedColors[name] ? 'Unlock color' : 'Lock color'}
              >
                {lockedColors[name] ? '🔒' : '🔓'}
              </button>
            </div>

            <div className="relative">
              <input
                type="color"
                value={color ?? '#000000'}
                onChange={(e) => handleColorChange(name, e.target.value)}
                className="color-preview"
                style={{ backgroundColor: color }}
              />
              {lockedColors[name] && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-lg">
                  <span className="text-white text-lg">🔒</span>
                </div>
              )}
            </div>

            <p className="color-value">{color}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaletteManager;
