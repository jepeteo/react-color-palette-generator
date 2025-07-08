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
    <div className="glass-card">
      <h3 className="section-title mb-4">Accessibility Checks</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
          <span className="text-sm font-medium">Text Contrast</span>
          <span className={`text-sm font-semibold px-2 py-1 rounded ${textContrast >= 7 ? 'bg-green-500/20 text-green-400' :
              textContrast >= 4.5 ? 'bg-yellow-500/20 text-yellow-400' :
                textContrast >= 3 ? 'bg-orange-500/20 text-orange-400' :
                  'bg-red-500/20 text-red-400'
            }`}>
            {textContrast.toFixed(2)} ({getContrastLevel(textContrast)})
          </span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
          <span className="text-sm font-medium">Primary Contrast</span>
          <span className={`text-sm font-semibold px-2 py-1 rounded ${primaryContrast >= 7 ? 'bg-green-500/20 text-green-400' :
              primaryContrast >= 4.5 ? 'bg-yellow-500/20 text-yellow-400' :
                primaryContrast >= 3 ? 'bg-orange-500/20 text-orange-400' :
                  'bg-red-500/20 text-red-400'
            }`}>
            {primaryContrast.toFixed(2)} ({getContrastLevel(primaryContrast)})
          </span>
        </div>
      </div>
    </div>
  );
}

export default AccessibilityChecker;
