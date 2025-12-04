import chroma from 'chroma-js';
import { CONTRAST_RATIOS, WCAG_LEVELS } from './constants';

/**
 * Accessibility utilities for WCAG compliance checking
 */
export class AccessibilityUtils {
  /**
   * Calculate contrast ratio between two colors
   * @param {string} foreground - Foreground color
   * @param {string} background - Background color
   * @returns {number} Contrast ratio
   */
  static getContrastRatio(foreground, background) {
    try {
      const fg = chroma(foreground);
      const bg = chroma(background);

      return chroma.contrast(fg, bg);
    } catch (error) {
      console.error('Error calculating contrast ratio:', error);
      return 1;
    }
  }

  /**
   * Check if color combination meets WCAG AA standard
   * @param {string} foreground - Foreground color
   * @param {string} background - Background color
   * @param {boolean} isLargeText - Whether text is considered large
   * @returns {boolean} Whether it meets WCAG AA
   */
  static meetsWCAG_AA(foreground, background, isLargeText = false) {
    const contrast = this.getContrastRatio(foreground, background);
    const threshold = isLargeText
      ? CONTRAST_RATIOS[WCAG_LEVELS.LARGE_TEXT]
      : CONTRAST_RATIOS[WCAG_LEVELS.AA];

    return contrast >= threshold;
  }

  /**
   * Check if color combination meets WCAG AAA standard
   * @param {string} foreground - Foreground color
   * @param {string} background - Background color
   * @param {boolean} isLargeText - Whether text is considered large
   * @returns {boolean} Whether it meets WCAG AAA
   */
  static meetsWCAG_AAA(foreground, background, isLargeText = false) {
    const contrast = this.getContrastRatio(foreground, background);
    const threshold = isLargeText
      ? CONTRAST_RATIOS[WCAG_LEVELS.LARGE_TEXT]
      : CONTRAST_RATIOS[WCAG_LEVELS.AAA];

    return contrast >= threshold;
  }

  /**
   * Get WCAG level for a color combination
   * @param {string} foreground - Foreground color
   * @param {string} background - Background color
   * @param {boolean} isLargeText - Whether text is considered large
   * @returns {string} WCAG level (AAA, AA, Large Text, or Fail)
   */
  static getWCAGLevel(foreground, background, isLargeText = false) {
    const contrast = this.getContrastRatio(foreground, background);

    if (contrast >= CONTRAST_RATIOS[WCAG_LEVELS.AAA]) {
      return WCAG_LEVELS.AAA;
    }
    if (contrast >= CONTRAST_RATIOS[WCAG_LEVELS.AA]) {
      return WCAG_LEVELS.AA;
    } else if (
      isLargeText &&
      contrast >= CONTRAST_RATIOS[WCAG_LEVELS.LARGE_TEXT]
    ) {
      return WCAG_LEVELS.LARGE_TEXT;
    } else {
      return 'Fail';
    }
  }

  /**
   * Calculate accessibility score for a palette
   * @param {Object} colorCombinations - Array of {fg, bg, name, isLargeText} objects
   * @returns {Object} Accessibility analysis
   */
  static analyzePaletteAccessibility(colorCombinations) {
    if (!colorCombinations || colorCombinations.length === 0) {
      return {
        score: 0,
        total: 0,
        passed: 0,
        failed: 0,
        combinations: [],
      };
    }

    const results = colorCombinations.map((combo) => {
      const contrast = this.getContrastRatio(combo.fg, combo.bg);
      const wcagLevel = this.getWCAGLevel(
        combo.fg,
        combo.bg,
        combo.isLargeText,
      );
      const meetsAA = this.meetsWCAG_AA(combo.fg, combo.bg, combo.isLargeText);
      const meetsAAA = this.meetsWCAG_AAA(
        combo.fg,
        combo.bg,
        combo.isLargeText,
      );

      return {
        ...combo,
        contrast,
        wcagLevel,
        meetsAA,
        meetsAAA,
        passed: meetsAA,
      };
    });

    const passed = results.filter((r) => r.passed).length;
    const total = results.length;
    const score = total > 0 ? (passed / total) * 100 : 0;

    return {
      score: Math.round(score * 10) / 10, // Round to 1 decimal place
      total,
      passed,
      failed: total - passed,
      combinations: results,
    };
  }

  /**
   * Get accessibility recommendations for improving a color combination
   * @param {string} foreground - Foreground color
   * @param {string} background - Background color
   * @param {boolean} isLargeText - Whether text is considered large
   * @returns {Object} Recommendations
   */
  static getAccessibilityRecommendations(
    foreground,
    background,
    isLargeText = false,
  ) {
    const contrast = this.getContrastRatio(foreground, background);
    const targetRatio = isLargeText
      ? CONTRAST_RATIOS[WCAG_LEVELS.LARGE_TEXT]
      : CONTRAST_RATIOS[WCAG_LEVELS.AA];

    if (contrast >= targetRatio) {
      return {
        needsImprovement: false,
        currentContrast: contrast,
        targetContrast: targetRatio,
        message: 'This color combination meets accessibility standards!',
      };
    }

    try {
      const fg = chroma(foreground);
      const bg = chroma(background);

      // Calculate how much we need to adjust
      const adjustmentNeeded = targetRatio / contrast;

      // Try darkening foreground
      const darkerFg = fg.darken(Math.log(adjustmentNeeded)).hex();
      const darkerFgContrast = this.getContrastRatio(darkerFg, background);

      // Try lightening foreground
      const lighterFg = fg.brighten(Math.log(adjustmentNeeded)).hex();
      const lighterFgContrast = this.getContrastRatio(lighterFg, background);

      // Try darkening background
      const darkerBg = bg.darken(Math.log(adjustmentNeeded)).hex();
      const darkerBgContrast = this.getContrastRatio(foreground, darkerBg);

      // Try lightening background
      const lighterBg = bg.brighten(Math.log(adjustmentNeeded)).hex();
      const lighterBgContrast = this.getContrastRatio(foreground, lighterBg);

      const suggestions = [
        {
          type: 'darken-foreground',
          color: darkerFg,
          contrast: darkerFgContrast,
        },
        {
          type: 'lighten-foreground',
          color: lighterFg,
          contrast: lighterFgContrast,
        },
        {
          type: 'darken-background',
          color: darkerBg,
          contrast: darkerBgContrast,
        },
        {
          type: 'lighten-background',
          color: lighterBg,
          contrast: lighterBgContrast,
        },
      ].filter((s) => s.contrast >= targetRatio);

      return {
        needsImprovement: true,
        currentContrast: contrast,
        targetContrast: targetRatio,
        message: `Current contrast ratio is ${contrast.toFixed(2)}. Need ${targetRatio} or higher.`,
        suggestions: suggestions.slice(0, 2), // Return top 2 suggestions
      };
    } catch {
      return {
        needsImprovement: true,
        currentContrast: contrast,
        targetContrast: targetRatio,
        message:
          'Unable to generate specific recommendations, but contrast needs improvement.',
        suggestions: [],
      };
    }
  }

  /**
   * Generate accessible color variations
   * @param {string} baseColor - Base color to generate variations from
   * @param {string} backgroundColor - Background color to test against
   * @returns {Array} Array of accessible color variations
   */
  static generateAccessibleVariations(baseColor, backgroundColor) {
    try {
      const base = chroma(baseColor);
      const variations = [];

      // Generate darker variations
      for (let i = 0.5; i <= 3; i += 0.5) {
        const darker = base.darken(i).hex();
        const contrast = this.getContrastRatio(darker, backgroundColor);

        if (contrast >= CONTRAST_RATIOS[WCAG_LEVELS.AA]) {
          variations.push({
            color: darker,
            contrast,
            type: 'darker',
            wcagLevel: this.getWCAGLevel(darker, backgroundColor),
          });
        }
      }

      // Generate lighter variations
      for (let i = 0.5; i <= 3; i += 0.5) {
        const lighter = base.brighten(i).hex();
        const contrast = this.getContrastRatio(lighter, backgroundColor);

        if (contrast >= CONTRAST_RATIOS[WCAG_LEVELS.AA]) {
          variations.push({
            color: lighter,
            contrast,
            type: 'lighter',
            wcagLevel: this.getWCAGLevel(lighter, backgroundColor),
          });
        }
      }

      // Sort by contrast ratio (highest first)
      return variations.sort((a, b) => b.contrast - a.contrast);
    } catch (error) {
      console.error('Error generating accessible variations:', error);
      return [];
    }
  }

  /**
   * Check if a color is perceivable by users with color vision deficiencies
   * @param {string} color1 - First color
   * @param {string} color2 - Second color
   * @returns {Object} Color blindness analysis
   */
  static checkColorBlindnessCompatibility(color1, color2) {
    try {
      const c1 = chroma(color1);
      const c2 = chroma(color2);

      // Simulate different types of color blindness
      const protanopia = {
        c1: this.simulateProtanopia(c1).hex(),
        c2: this.simulateProtanopia(c2).hex(),
      };

      const deuteranopia = {
        c1: this.simulateDeuteranopia(c1).hex(),
        c2: this.simulateDeuteranopia(c2).hex(),
      };

      const tritanopia = {
        c1: this.simulateTritanopia(c1).hex(),
        c2: this.simulateTritanopia(c2).hex(),
      };

      return {
        protanopia: {
          colors: protanopia,
          contrast: this.getContrastRatio(protanopia.c1, protanopia.c2),
          accessible: this.meetsWCAG_AA(protanopia.c1, protanopia.c2),
        },
        deuteranopia: {
          colors: deuteranopia,
          contrast: this.getContrastRatio(deuteranopia.c1, deuteranopia.c2),
          accessible: this.meetsWCAG_AA(deuteranopia.c1, deuteranopia.c2),
        },
        tritanopia: {
          colors: tritanopia,
          contrast: this.getContrastRatio(tritanopia.c1, tritanopia.c2),
          accessible: this.meetsWCAG_AA(tritanopia.c1, tritanopia.c2),
        },
      };
    } catch (error) {
      console.error('Error checking color blindness compatibility:', error);
      return null;
    }
  }

  // Simplified color blindness simulation methods
  static simulateProtanopia(color) {
    // Simplified protanopia simulation (red-blind)
    const [l, a, b] = color.lab();
    return chroma.lab(l, a * 0.1, b);
  }

  static simulateDeuteranopia(color) {
    // Simplified deuteranopia simulation (green-blind)
    const [l, a, b] = color.lab();
    return chroma.lab(l, a * 0.1, b);
  }

  static simulateTritanopia(color) {
    // Simplified tritanopia simulation (blue-blind)
    const [l, a, b] = color.lab();
    return chroma.lab(l, a, b * 0.1);
  }
}
