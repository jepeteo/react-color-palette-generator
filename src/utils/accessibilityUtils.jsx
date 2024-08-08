import chroma from 'chroma-js';

export function getAccessibilityInfo(color, backgroundColor) {
  const contrast = chroma.contrast(color, backgroundColor);
  const aaLarge = contrast >= 3;
  const aa = contrast >= 4.5;
  const aaaLarge = contrast >= 4.5;
  const aaa = contrast >= 7;

  return {
    contrast,
    aaLarge,
    aa,
    aaaLarge,
    aaa,
  };
}

export function generateAccessibleAlternatives(
  color,
  backgroundColor,
  targetContrast = 4.5,
) {
  let alternativeColor = chroma(color);
  const darken =
    chroma.contrast(alternativeColor, backgroundColor) < targetContrast;
  while (chroma.contrast(alternativeColor, backgroundColor) < targetContrast) {
    alternativeColor = alternativeColor.darken(0.1);
  }
  return alternativeColor.hex();
}
