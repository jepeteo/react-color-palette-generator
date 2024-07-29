// src/components/AccessibilityChecker.js
import React from 'react';
import { calculateContrastRatio } from '../utils/colorUtils';

function AccessibilityChecker({ palette }) {
  const textContrast = calculateContrastRatio(palette.text, palette.background);
  const primaryContrast = calculateContrastRatio(
    palette.primary,
    palette.background,
  );

  const getContrastLevel = (ratio) => {
    if (ratio >= 7) return 'AAA';
    if (ratio >= 4.5) return 'AA';
    if (ratio >= 3) return 'AA Large';
    return 'Fail';
  };

  return (
    <div className="mt-4">
      <h3 className="mb-2 text-lg font-semibold">Accessibility Checks</h3>
      <div>
        <p>
          Text Contrast: {textContrast.toFixed(2)} (
          {getContrastLevel(textContrast)})
        </p>
        <p>
          Primary Color Contrast: {primaryContrast.toFixed(2)} (
          {getContrastLevel(primaryContrast)})
        </p>
      </div>
    </div>
  );
}

export default AccessibilityChecker;
