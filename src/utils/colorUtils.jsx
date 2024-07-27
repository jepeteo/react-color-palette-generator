// src/utils/colorUtils.js
import chroma from 'chroma-js';

export function generatePalette(primaryColor) {
  const baseColor = chroma(primaryColor);
  
  return {
    primary: primaryColor,
    secondary: baseColor.set('hsl.h', '+120').hex(),
    accent: baseColor.set('hsl.h', '+180').hex(),
    text: baseColor.luminance() > 0.5 ? '#000000' : '#FFFFFF',
    background: baseColor.luminance() > 0.5 ? '#FFFFFF' : '#000000',
  };
}
