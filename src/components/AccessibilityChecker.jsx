import React from 'react';
import { calculateContrastRatio } from '../utils/colorUtils';

function AccessibilityChecker({ palette }) {
  if (!palette) return null;
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
      <h3 className="containerTitle">Accessibility Checks</h3>
      <div className="accessibilityChecks">
        <div className="flex w-full gap-2 text-sm">
          Text Contrast:
          <span className="ml-auto">
            {textContrast.toFixed(2)} ({getContrastLevel(textContrast)})
          </span>
        </div>
        <div className="flex w-full gap-2 text-sm">
          Primary Color Contrast:
          <span className="ml-auto">
            {primaryContrast.toFixed(2)} ({getContrastLevel(primaryContrast)})
          </span>
        </div>
      </div>
    </div>
  );
}

export default AccessibilityChecker;
