import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setHarmony } from '../store/colorSlice';

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

function HarmonySelector() {
  const dispatch = useDispatch();
  const currentHarmony = useSelector((state) => state.color.harmony);

  return (
    <div className="containerColorHarmony">
      <h3 className="containerTitle">Color Harmony</h3>
      <div className="containerHarmonies">
        {harmonies.map((harmony) => (
          <button
            key={harmony}
            onClick={() =>
              dispatch(setHarmony(harmony.toLowerCase().replace(' ', '-')))
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
