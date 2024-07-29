// src/components/PaletteGenerator.js
import React, { useEffect } from 'react';
import { generatePalette } from '../utils/colorUtils';

function PaletteGenerator({
  primaryColor,
  setPalette,
  isDarkMode,
  imageColors,
}) {
  useEffect(() => {
    let newPalette;
    if (imageColors) {
      newPalette = generatePaletteFromImage(imageColors, isDarkMode);
    } else {
      newPalette = generatePalette(primaryColor, isDarkMode);
    }
    setPalette(newPalette);
  }, [primaryColor, setPalette, isDarkMode, imageColors]);

  return null;
}

export default PaletteGenerator;
