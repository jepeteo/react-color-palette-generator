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
    <div className="containerColorHarmony">
      <h3 className="containerTitle">Color Harmony</h3>
      <div className="containerHarmonies">
        {harmonies.map((harmony) => (
          <button
            key={harmony}
            onClick={() =>
              handleHarmonyChange(harmony.toLowerCase().replace(' ', '-'))
            }
            title={harmony}
            aria-label={harmony}
            className={`harmony ${
              currentHarmony === harmony.toLowerCase().replace(' ', '-')
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800'
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
