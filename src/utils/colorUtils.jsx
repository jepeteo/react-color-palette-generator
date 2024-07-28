// src/utils/colorUtils.js
import chroma from "chroma-js"

export function generatePalette(primaryColor, isDarkMode) {
  const base = chroma(primaryColor)

  return {
    primary: base.hex(),
    secondary: base.set("hsl.h", "+120").hex(),
    accent: base.set("hsl.h", "+180").hex(),
    text: isDarkMode ? "#FFFFFF" : "#000000",
    background: isDarkMode ? "#000000" : "#FFFFFF",
  }
  // Add more shades
  palette.primaryLight = chroma.mix(palette.primary, "#ffffff", 0.3).hex()
  palette.primaryDark = chroma.mix(palette.primary, "#000000", 0.3).hex()
  palette.secondaryLight = chroma.mix(palette.secondary, "#ffffff", 0.3).hex()
  palette.secondaryDark = chroma.mix(palette.secondary, "#000000", 0.3).hex()

  return palette
}

export function generateComplementaryPalette(primaryColor, isDarkMode) {
  const base = chroma(primaryColor)
  const complement = base.set("hsl.h", "+180")

  return {
    primary: base.hex(),
    secondary: complement.hex(),
    accent: base.set("hsl.s", "+0.1").set("hsl.l", "-0.1").hex(),
    // text: base.luminance() > 0.5 ? "#000000" : "#FFFFFF",
    // background: base.luminance() > 0.5 ? "#FFFFFF" : "#000000",
    text: isDarkMode ? "#FFFFFF" : "#000000",
    background: isDarkMode ? "#000000" : "#FFFFFF",
  }
}

export function generateTriadicPalette(primaryColor, isDarkMode) {
  const base = chroma(primaryColor)
  const triad1 = base.set("hsl.h", "+120")
  const triad2 = base.set("hsl.h", "+240")

  return {
    primary: base.hex(),
    secondary: triad1.hex(),
    accent: triad2.hex(),
    // text: base.luminance() > 0.5 ? "#000000" : "#FFFFFF",
    // background: base.luminance() > 0.5 ? "#FFFFFF" : "#000000",
    text: isDarkMode ? "#FFFFFF" : "#000000",
    background: isDarkMode ? "#000000" : "#FFFFFF",
  }
}

export function generateAnalogousPalette(primaryColor, isDarkMode) {
  const base = chroma(primaryColor)
  const analog1 = base.set("hsl.h", "+30")
  const analog2 = base.set("hsl.h", "-30")

  return {
    primary: base.hex(),
    secondary: analog1.hex(),
    accent: analog2.hex(),
    // text: base.luminance() > 0.5 ? "#000000" : "#FFFFFF",
    // background: base.luminance() > 0.5 ? "#FFFFFF" : "#000000",
    text: isDarkMode ? "#FFFFFF" : "#000000",
    background: isDarkMode ? "#000000" : "#FFFFFF",
  }
}
export function generateSplitComplementaryPalette(primaryColor, isDarkMode) {
  const base = chroma(primaryColor)
  const complement = base.set("hsl.h", "+180")
  const split1 = complement.set("hsl.h", "-30")
  const split2 = complement.set("hsl.h", "+30")

  return {
    primary: base.hex(),
    secondary: split1.hex(),
    accent: split2.hex(),
    // text: base.luminance() > 0.5 ? "#000000" : "#FFFFFF",
    // background: base.luminance() > 0.5 ? "#FFFFFF" : "#000000",
    text: isDarkMode ? "#FFFFFF" : "#000000",
    background: isDarkMode ? "#000000" : "#FFFFFF",
  }
}

export function generateTetradicPalette(primaryColor, isDarkMode) {
  const base = chroma(primaryColor)
  const tetrad1 = base.set("hsl.h", "+90")
  const tetrad2 = base.set("hsl.h", "+180")
  const tetrad3 = base.set("hsl.h", "+270")

  return {
    primary: base.hex(),
    secondary: tetrad1.hex(),
    accent: tetrad2.hex(),
    highlight: tetrad3.hex(),
    // text: base.luminance() > 0.5 ? "#000000" : "#FFFFFF",
    // background: base.luminance() > 0.5 ? "#FFFFFF" : "#000000",
    text: isDarkMode ? "#FFFFFF" : "#000000",
    background: isDarkMode ? "#000000" : "#FFFFFF",
  }
}

export function generateMonochromaticPalette(primaryColor, isDarkMode) {
  const base = chroma(primaryColor)

  return {
    primary: base.hex(),
    secondary: base.brighten(1).hex(),
    accent: base.darken(1).hex(),
    highlight: base.saturate(1).hex(),
    // text: base.luminance() > 0.5 ? "#000000" : "#FFFFFF",
    // background: base.luminance() > 0.5 ? "#FFFFFF" : "#000000",
    text: isDarkMode ? "#FFFFFF" : "#000000",
    background: isDarkMode ? "#000000" : "#FFFFFF",
  }
}
