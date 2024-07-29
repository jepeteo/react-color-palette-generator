// src/components/HarmonySelector.js
import React from 'react';

function HarmonySelector({ currentHarmony, setHarmony }) {
  const harmonies = [
    'Default',
    'Complementary',
    'Triadic',
    'Analogous',
    'Split Complementary',
    'Tetradic',
    'Monochromatic',
  ];

  return (
    <div className="containerColorHarmony">
      <h3 className="containerTitle">Color Harmony</h3>
      <div className="containerHarmonies">
        {harmonies.map((harmony) => (
          <button
            key={harmony}
            title={harmony}
            aria-label={harmony}
            onClick={() => setHarmony(harmony.toLowerCase().replace(' ', '-'))}
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
