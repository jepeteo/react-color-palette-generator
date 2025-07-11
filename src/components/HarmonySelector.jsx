import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setHarmony, randomizePalette } from '../store/colorSlice';

function HarmonySelector() {
  const dispatch = useDispatch();
  const currentHarmony = useSelector((state) => state.color.harmony);
  const paletteSize = useSelector((state) => state.color.paletteSize);

  const harmonies = [
    'Default',
    'Complementary',
    'Triadic',
    'Square',
    'Analogous',
    'Split Complementary',
    'Tetradic',
    'Monochromatic',
    'Double Split Complementary',
  ];

  const handleHarmonyChange = (newHarmony) => {
    dispatch(setHarmony(newHarmony));
    dispatch(randomizePalette({ harmony: newHarmony }));
  };

  return (
    <div className="space-y-4">
      <h3 className="section-header">Color Harmony</h3>
      <div className="harmony-grid">
        {harmonies.map((harmony) => (
          <button
            key={harmony}
            onClick={() =>
              handleHarmonyChange(harmony.toLowerCase().replace(' ', '-'))
            }
            title={harmony}
            className={`harmony-button ${
              currentHarmony === harmony.toLowerCase().replace(' ', '-')
                ? 'active'
                : ''
            }`}
          >
            {harmony}
          </button>
        ))}
      </div>
    </div>
  );
}

export default HarmonySelector;
