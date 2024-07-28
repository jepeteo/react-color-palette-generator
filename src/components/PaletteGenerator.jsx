// src/components/PaletteGenerator.js
import React, { useEffect } from 'react';
import { generatePalette } from '../utils/colorUtils';

function PaletteGenerator({ primaryColor, setPalette }) {
  useEffect(() => {
    const newPalette = generatePalette(primaryColor);
    setPalette(newPalette);
  }, [primaryColor, setPalette]);

  return null;
}

export default PaletteGenerator;
