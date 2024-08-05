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
    aaa
  };
}