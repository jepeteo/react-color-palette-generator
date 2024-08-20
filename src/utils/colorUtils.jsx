import chroma from 'chroma-js';

/* High-order functions for generating color palettes */
function createPaletteGenerator(generateColors) {
  return (primaryColor, isDarkMode) => {
    const colors = generateColors(primaryColor);
    const textColor = isDarkMode ? '#f8f8f8' : '#161616';
    const backgroundColor = isDarkMode ? '#161616' : '#f8f8f8';

    return {
      ...colors,
      text: textColor,
      background: backgroundColor,
    };
  };
}

const generateAnalogousPalette = createPaletteGenerator((primaryColor) => {
  const base = chroma(primaryColor);
  const analog1 = base.set('hsl.h', '+30');
  const analog2 = base.set('hsl.h', '-30');

  return {
    primary: base.hex(),
    secondary: analog1.hex(),
    accent: analog2.hex(),
  };
});
const generateComplementaryPalette = createPaletteGenerator((primaryColor) => {
  const base = chroma(primaryColor);
  const complement = base.set('hsl.h', '+180');

  return {
    primary: base.hex(),
    secondary: complement.hex(),
    accent: base.set('hsl.s', '+0.1').set('hsl.l', '-0.1').hex(),
  };
});
const generateSplitComplementaryPalette = createPaletteGenerator(
  (primaryColor) => {
    const base = chroma(primaryColor);
    const complement = base.set('hsl.h', '+180');
    const split1 = complement.set('hsl.h', '-30');
    const split2 = complement.set('hsl.h', '+30');

    return {
      primary: base.hex(),
      secondary: split1.hex(),
      accent: split2.hex(),
    };
  },
);
const generateTriadicPalette = createPaletteGenerator((primaryColor) => {
  const base = chroma(primaryColor);
  const triad1 = base.set('hsl.h', '+120');
  const triad2 = base.set('hsl.h', '+240');

  return {
    primary: base.hex(),
    secondary: triad1.hex(),
    accent: triad2.hex(),
  };
});
const generateTetradicPalette = createPaletteGenerator((primaryColor) => {
  const base = chroma(primaryColor);
  const tetrad1 = base.set('hsl.h', '+60');
  const tetrad2 = base.set('hsl.h', '+180');
  const tetrad3 = base.set('hsl.h', '+240');

  return {
    primary: base.hex(),
    secondary: tetrad1.hex(),
    accent: tetrad2.hex(),
    highlight: tetrad3.hex(),
  };
});
const generateMonochromaticPalette = createPaletteGenerator((primaryColor) => {
  const base = chroma(primaryColor);

  return {
    primary: base.hex(),
    secondary: base.brighten(1).hex(),
    accent: base.darken(1).hex(),
    highlight: base.saturate(1).hex(),
  };
});
const generateSquarePalette = createPaletteGenerator((primaryColor) => {
  const base = chroma(primaryColor);
  const square1 = base.set('hsl.h', '+90');
  const square2 = base.set('hsl.h', '+180');
  const square3 = base.set('hsl.h', '+270');

  return {
    primary: base.hex(),
    secondary: square1.hex(),
    accent: square2.hex(),
    highlight: square3.hex(),
  };
});
const generateDoubleSplitComplementaryPalette = createPaletteGenerator(
  (primaryColor) => {
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
    };
  },
);

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

export function calculateContrastRatio(color1, color2) {
  const luminance1 = chroma(color1).luminance();
  const luminance2 = chroma(color2).luminance();
  const brightest = Math.max(luminance1, luminance2);
  const darkest = Math.min(luminance1, luminance2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export function generateRandomPalette(harmony, isDarkMode) {
  const randomColor = chroma.random().hex();

  switch (harmony) {
    case 'complementary':
      return generateComplementaryPalette(randomColor, isDarkMode);
    case 'triadic':
      return generateTriadicPalette(randomColor, isDarkMode);
    case 'analogous':
      return generateAnalogousPalette(randomColor, isDarkMode);
    case 'split-complementary':
      return generateSplitComplementaryPalette(randomColor, isDarkMode);
    case 'tetradic':
      return generateTetradicPalette(randomColor, isDarkMode);
    case 'monochromatic':
      return generateMonochromaticPalette(randomColor, isDarkMode);
    case 'square':
      return generateSquarePalette(randomColor, isDarkMode);
    case 'double-split complementary':
      return generateDoubleSplitComplementaryPalette(randomColor, isDarkMode);
    default:
      return generatePalette(randomColor, isDarkMode);
  }
}

export {
  generateAnalogousPalette,
  generateComplementaryPalette,
  generateSplitComplementaryPalette,
  generateTriadicPalette,
  generateTetradicPalette,
  generateMonochromaticPalette,
  generateSquarePalette,
  generateDoubleSplitComplementaryPalette
};
