import chroma from 'chroma-js';

const darkColor = '#161616';
const lightColor = '#f8f8f8';

export function generatePalette(primaryColor, isDarkMode) {
  const base = chroma(primaryColor);

  return {
    primary: base.hex(),
    secondary: base.set('hsl.h', '+120').hex(),
    accent: base.set('hsl.h', '+180').hex(),
    text: isDarkMode ? lightColor : darkColor,
    background: isDarkMode ? darkColor : lightColor,
  };
}

export function generatePaletteFromImage(imageColors, isDarkMode) {
  return {
    primary: imageColors[0],
    secondary: imageColors[1],
    accent: imageColors[2],
    text: isDarkMode ? lightColor : darkColor,
    background: isDarkMode ? darkColor : lightColor,
  };
}

export function generateComplementaryPalette(primaryColor, isDarkMode) {
  const base = chroma(primaryColor);
  const complement = base.set('hsl.h', '+180');

  return {
    primary: base.hex(),
    secondary: complement.hex(),
    accent: base.set('hsl.s', '+0.1').set('hsl.l', '-0.1').hex(),
    text: isDarkMode ? lightColor : darkColor,
    background: isDarkMode ? darkColor : lightColor,
  };
}

export function generateTriadicPalette(primaryColor, isDarkMode) {
  const base = chroma(primaryColor);
  const triad1 = base.set('hsl.h', '+120');
  const triad2 = base.set('hsl.h', '+240');

  return {
    primary: base.hex(),
    secondary: triad1.hex(),
    accent: triad2.hex(),
    text: isDarkMode ? lightColor : darkColor,
    background: isDarkMode ? darkColor : lightColor,
  };
}

export function generateAnalogousPalette(primaryColor, isDarkMode) {
  const base = chroma(primaryColor);
  const analog1 = base.set('hsl.h', '+30');
  const analog2 = base.set('hsl.h', '-30');

  return {
    primary: base.hex(),
    secondary: analog1.hex(),
    accent: analog2.hex(),
    text: isDarkMode ? lightColor : darkColor,
    background: isDarkMode ? darkColor : lightColor,
  };
}

export function generateSplitComplementaryPalette(primaryColor, isDarkMode) {
  const base = chroma(primaryColor);
  const complement = base.set('hsl.h', '+180');
  const split1 = complement.set('hsl.h', '-30');
  const split2 = complement.set('hsl.h', '+30');

  return {
    primary: base.hex(),
    secondary: split1.hex(),
    accent: split2.hex(),
    text: isDarkMode ? lightColor : darkColor,
    background: isDarkMode ? darkColor : lightColor,
  };
}

export function generateTetradicPalette(primaryColor, isDarkMode) {
  const base = chroma(primaryColor);
  const tetrad1 = base.set('hsl.h', '+90');
  const tetrad2 = base.set('hsl.h', '+180');
  const tetrad3 = base.set('hsl.h', '+270');

  return {
    primary: base.hex(),
    secondary: tetrad1.hex(),
    accent: tetrad2.hex(),
    highlight: tetrad3.hex(),
    text: isDarkMode ? lightColor : darkColor,
    background: isDarkMode ? darkColor : lightColor,
  };
}

export function generateMonochromaticPalette(primaryColor, isDarkMode) {
  const base = chroma(primaryColor);

  return {
    primary: base.hex(),
    secondary: base.brighten(1).hex(),
    accent: base.darken(1).hex(),
    highlight: base.saturate(1).hex(),
    text: isDarkMode ? lightColor : darkColor,
    background: isDarkMode ? darkColor : lightColor,
  };
}

export function generateSquarePalette(primaryColor, isDarkMode) {
  const base = chroma(primaryColor);
  const square1 = base.set('hsl.h', '+90');
  const square2 = base.set('hsl.h', '+180');
  const square3 = base.set('hsl.h', '+270');

  return {
    primary: base.hex(),
    secondary: square1.hex(),
    accent: square2.hex(),
    highlight: square3.hex(),
    text: isDarkMode ? lightColor : darkColor,
    background: isDarkMode ? darkColor : lightColor,
  };
}

export function generateDoubleSplitComplementaryPalette(
  primaryColor,
  isDarkMode,
) {
  const base = chroma(primaryColor);
  const complement = base.set('hsl.h', '+180');
  const split1 = complement.set('hsl.h', '-30');
  const split2 = complement.set('hsl.h', '+30');
  const split3 = base.set('hsl.h', '-30');
  const split4 = base.set('hsl.h', '+30');

  return {
    primary: base.hex(),
    secondary: split1.hex(),
    accent: split2.hex(),
    highlight1: split3.hex(),
    highlight2: split4.hex(),
    text: isDarkMode ? lightColor : darkColor,
    background: isDarkMode ? darkColor : lightColor,
  };
}

export function calculateContrastRatio(color1, color2) {
  const luminance1 = chroma(color1).luminance();
  const luminance2 = chroma(color2).luminance();
  const brightest = Math.max(luminance1, luminance2);
  const darkest = Math.min(luminance1, luminance2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export function generateRandomPalette() {
  const baseHue = Math.floor(Math.random() * 360);
  return {
    primary: chroma.hsl(baseHue, 0.7, 0.5).hex(),
    secondary: chroma.hsl((baseHue + 30) % 360, 0.6, 0.6).hex(),
    accent: chroma.hsl((baseHue + 60) % 360, 0.65, 0.55).hex(),
    text: chroma.hsl(baseHue, 0.15, 0.2).hex(),
    background: chroma.hsl(baseHue, 0.2, 0.95).hex(),
  };
}
