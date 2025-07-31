import chroma from 'chroma-js';
import { HARMONY_TYPES, PALETTE_ROLES } from './constants';

/**
 * Enhanced ColorUtils class with comprehensive color manipulation and harmony generation
 */
export class ColorUtils {
  /**
     * Generate a color palette based on harmony type
   * @param {string} baseColor - Base color in hex format
   * @param {string} harmonyType - Type of harmony to generate
   * @param {boolean} isDarkMode - Whether to generate for dark mode
   * @returns {Object} Generated color palette
   */
  static generateHarmony(baseColor, harmonyType = HARMONY_TYPES.TRIADIC, isDarkMode = false) {
  ) {
    try {
      const base = chroma(baseColor);

      const generators = {
                [HARMONY_TYPES.COMPLEMENTARY]: () => this.generateComplementary(base),
                [HARMONY_TYPES.TRIADIC]: () => this.generateTriadic(base),
                [HARMONY_TYPES.ANALOGOUS]: () => this.generateAnalogous(base),
                [HARMONY_TYPES.SPLIT_COMPLEMENTARY]: () => this.generateSplitComplementary(base),
                [HARMONY_TYPES.TETRADIC]: () => this.generateTetradic(base),
                [HARMONY_TYPES.MONOCHROMATIC]: () => this.generateMonochromatic(base),
                [HARMONY_TYPES.SQUARE]: () => this.generateSquare(base),
                [HARMONY_TYPES.DOUBLE_SPLIT_COMPLEMENTARY]: () => this.generateDoubleSplitComplementary(base),
            };

      const colors = generators[harmonyType]?.() || generators[HARMONY_TYPES.TRIADIC]();

      // Add appropriate text and background colors
            return {
                ...colors,
                [PALETTE_ROLES.TEXT]: this.getOptimalTextColor(colors[PALETTE_ROLES.BACKGROUND] || colors[PALETTE_ROLES.PRIMARY], isDarkMode),
        ),
        [PALETTE_ROLES.BACKGROUND]: this.getOptimalBackgroundColor(
          colors[PALETTE_ROLES.PRIMARY],
          isDarkMode,
      };
        } catch (error) {
            console.error('Error generating harmony:', error);
            return this.getFallbackPalette(isDarkMode);
        }
    }

  /**
     * Generate complementary color harmony
     */
    static generateComplementary(baseColor) {
        const base = chroma(baseColor);
        const complement = base.set('hsl.h', '+180');

    return {
            [PALETTE_ROLES.PRIMARY]: base.hex(),
            [PALETTE_ROLES.SECONDARY]: complement.hex(),
            [PALETTE_ROLES.ACCENT]: base.brighten(0.5).hex(),
            [PALETTE_ROLES.SURFACE]: base.alpha(0.1).hex(),
        };
    }

  /**
     * Generate triadic color harmony
     */
  static generateTriadic(baseColor) {
    const base = chroma(baseColor);
        const triad1 = base.set('hsl.h', '+120');
        const triad2 = base.set('hsl.h', '+240');

    return {
      [PALETTE_ROLES.PRIMARY]: base.hex(),
      [PALETTE_ROLES.SECONDARY]: triad1.hex(),
            [PALETTE_ROLES.ACCENT]: triad2.hex(),
            [PALETTE_ROLES.SURFACE]: base.alpha(0.1).hex(),
        };
    }

  /**
     * Generate analogous color harmony
   */
  static generateAnalogous(baseColor) {
    const base = chroma(baseColor);
    const analog1 = base.set('hsl.h', '+30');
        const analog2 = base.set('hsl.h', '-30');

    return {
            [PALETTE_ROLES.PRIMARY]: base.hex(),
            [PALETTE_ROLES.SECONDARY]: analog1.hex(),
            [PALETTE_ROLES.ACCENT]: analog2.hex(),
            [PALETTE_ROLES.SURFACE]: base.alpha(0.1).hex(),
        };
    }

  /**
     * Generate split complementary color harmony
     */
    static generateSplitComplementary(baseColor) {
        const base = chroma(baseColor);
        const complement = base.set('hsl.h', '+180');
        const split1 = complement.set('hsl.h', '-30');
        const split2 = complement.set('hsl.h', '+30');

    return {
            [PALETTE_ROLES.PRIMARY]: base.hex(),
            [PALETTE_ROLES.SECONDARY]: split1.hex(),
            [PALETTE_ROLES.ACCENT]: split2.hex(),
            [PALETTE_ROLES.SURFACE]: base.alpha(0.1).hex(),
        };
  }

  /**
     * Generate tetradic (rectangle) color harmony
     */
    static generateTetradic(baseColor) {
        const base = chroma(baseColor);
        const tetrad1 = base.set('hsl.h', '+60');
        const tetrad2 = base.set('hsl.h', '+180');
    const tetrad3 = base.set('hsl.h', '+240');

    return {
            [PALETTE_ROLES.PRIMARY]: base.hex(),
            [PALETTE_ROLES.SECONDARY]: tetrad1.hex(),
      [PALETTE_ROLES.ACCENT]: tetrad2.hex(),
      [PALETTE_ROLES.SURFACE]: tetrad3.alpha(0.1).hex(),
        };
    }

  /**
     * Generate monochromatic color harmony
     */
    static generateMonochromatic(baseColor) {
        const base = chroma(baseColor);

    return {
            [PALETTE_ROLES.PRIMARY]: base.hex(),
            [PALETTE_ROLES.SECONDARY]: base.brighten(1).hex(),
            [PALETTE_ROLES.ACCENT]: base.darken(1).hex(),
            [PALETTE_ROLES.SURFACE]: base.alpha(0.1).hex(),
        };
  }

  /**
     * Generate square color harmony
     */
  static generateSquare(baseColor) {
    const base = chroma(baseColor);
        const square1 = base.set('hsl.h', '+90');
        const square2 = base.set('hsl.h', '+180');
    const square3 = base.set('hsl.h', '+270');

    return {
            [PALETTE_ROLES.PRIMARY]: base.hex(),
            [PALETTE_ROLES.SECONDARY]: square1.hex(),
      [PALETTE_ROLES.ACCENT]: square2.hex(),
      [PALETTE_ROLES.SURFACE]: square3.alpha(0.1).hex(),
        };
    }

  /**
     * Generate double split complementary color harmony
     */
    static generateDoubleSplitComplementary(baseColor) {
        const base = chroma(baseColor);
        const complement = base.set('hsl.h', '+180');
        const split1 = base.set('hsl.h', '+150');
        const split2 = base.set('hsl.h', '+210');

    return {
      [PALETTE_ROLES.PRIMARY]: base.hex(),
      [PALETTE_ROLES.SECONDARY]: complement.hex(),
            [PALETTE_ROLES.ACCENT]: split1.hex(),
            [PALETTE_ROLES.SURFACE]: split2.alpha(0.1).hex(),
        };
    }

  /**
     * Get optimal text color for a given background
   */
  static getOptimalTextColor(backgroundColor, isDarkMode = false) {
        try {
            const bg = chroma(backgroundColor);
            const luminance = bg.luminance();

            if (isDarkMode) {
                return luminance > 0.5 ? '#1a1a1a' : '#f8f8f8';
            } 
                return luminance > 0.5 ? '#1a1a1a' : '#ffffff';
            
        } catch (error) {
            return isDarkMode ? '#f8f8f8' : '#1a1a1a';
        }
    }

  /**
     * Get contrast color for a given background (alias for getOptimalTextColor)
     * @param {string} backgroundColor - Background color
     * @param {boolean} isDarkMode - Whether in dark mode
     * @returns {string} Optimal text color
     */
    static getContrastColor(backgroundColor, isDarkMode = false) {
        return this.getOptimalTextColor(backgroundColor, isDarkMode);
    }

  /**
     * Get optimal background color for a given primary color
     */
    static getOptimalBackgroundColor(primaryColor, isDarkMode = false) {
        try {
            const primary = chroma(primaryColor);

            if (isDarkMode) {
                return primary.darken(3).desaturate(2).hex();
            } 
                return primary.brighten(3).desaturate(2).hex();
            
        } catch (error) {
            return isDarkMode ? '#1a1a1a' : '#ffffff';
        }
    }

  /**
     * Generate a random color within a specific range
     */
    static generateRandomColor(hueRange = [0, 360], saturationRange = [0.3, 0.8], lightnessRange = [0.3, 0.7]) {
    const hue = Math.random() * (hueRange[1] - hueRange[0]) + hueRange[0];
    const saturation = Math.random() * (saturationRange[1] - saturationRange[0]) + saturationRange[0];
        const lightness = Math.random() * (lightnessRange[1] - lightnessRange[0]) + lightnessRange[0];

    return chroma.hsl(hue, saturation, lightness).hex();
    }

  /**
     * Validate if a string is a valid color
     */
    static isValidColor(color) {
        try {
            chroma(color);
            return true;
    } catch (error) {
      return false;
        }
    }

  /**
     * Convert color to different formats
     */
    static convertColor(color, format = 'hex') {
        try {
            const c = chroma(color);

      switch (format.toLowerCase()) {
                case 'hex':
                    return c.hex();
                case 'rgb':
                    return c.css();
                case 'hsl':
                    return c.css('hsl');
                case 'hsv':
                    return c.hsv();
                default:
                    return c.hex();
            }
        } catch (error) {
            return color;
        }
    }

  /**
     * Get fallback palette in case of errors
   */
  static getFallbackPalette(isDarkMode = false) {
    return {
      [PALETTE_ROLES.PRIMARY]: '#336699',
      [PALETTE_ROLES.SECONDARY]: '#66ccff',
      [PALETTE_ROLES.ACCENT]: '#ff6b6b',
            [PALETTE_ROLES.TEXT]: isDarkMode ? '#f8f8f8' : '#1a1a1a',
            [PALETTE_ROLES.BACKGROUND]: isDarkMode ? '#1a1a1a' : '#ffffff',
            [PALETTE_ROLES.SURFACE]: isDarkMode ? '#2a2a2a' : '#f5f5f5',
        };
  }

  /**
     * Blend two colors together
     */
    static blendColors(color1, color2, ratio = 0.5) {
        try {
            return chroma.mix(color1, color2, ratio).hex();
        } catch (error) {
            return color1;
        }
    }

  /**
     * Generate tints and shades of a color
     */
    static generateTintsAndShades(baseColor, steps = 5) {
        try {
            const base = chroma(baseColor);
            const tints = [];
            const shades = [];

      for (let i = 1; i <= steps; i++) {
                const factor = i / (steps + 1);
                tints.push(base.brighten(factor * 2).hex());
                shades.push(base.darken(factor * 2).hex());
      }

      return { tints, shades, base: base.hex() };
        } catch (error) {
            return { tints: [], shades: [], base: baseColor };
        }
    }
}
