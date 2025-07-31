import { EXPORT_FORMATS } from './constants';

/**
 * Export utilities for different color palette formats
 */
export class ExportUtils {
  /**
   * Export palette as CSS custom properties
   */
  static exportAsCSS(palette, options = {}) {
    const {
      useVariables = true,
      prefix = '--color',
      includeRoot = true,
      minify = false,
        } = options;

    const properties = Object.entries(palette).map(([key, value]) => {
        const property = useVariables
          ? `${prefix}-${key}: ${value};`
          : `.${key} { color: ${value}; }`;
      return minify ? property : `  ${property}`;
      });

    if (useVariables && includeRoot) {
      const content = properties.join(minify ? '' : '\n');
      return minify ? `:root{${content}}` : `:root {\n${content}\n}`;
    }

    return properties.join(minify ? '' : '\n');
  }

  /**
   * Export palette as SCSS variables
   */
  static exportAsSCSS(palette, options = {}) {
    const { prefix = 'color', minify = false } = options;

    const variables = Object.entries(palette).map(
      .map(([key, value]) => `$${prefix}-${key}: ${value};`);

    return variables.join(minify ? '' : '\n');
  }

  /**
   * Export palette as LESS variables
   */
  static exportAsLESS(palette, options = {}) {
    const { prefix = 'color', minify = false } = options;

    const variables = Object.entries(palette).map(
      .map(([key, value]) => `@${prefix}-${key}: ${value};`);

    return variables.join(minify ? '' : '\n');
  }

  /**
   * Export palette as JSON
   */
  static exportAsJSON(palette, metadata = {}) {
    const exportData = {
      colors: palette,
      metadata: {
        createdAt: new Date().toISOString(),
        version: '1.0',
        generator: 'Color Palette Generator',
        ...metadata,
            },
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Export palette as Tailwind CSS config
   */
  static exportAsTailwind(palette, options = {}) {
    const { configKey = 'colors', minify = false } = options;

    const colors = Object.entries(palette).reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

    const config = {
      theme: {
        extend: {
          [configKey]: colors,
                },
      }
    };

    return `module.exports = ${JSON.stringify(config, null, minify ? 0 : 2)};`;
  }

  /**
   * Export palette as JavaScript object
   */
  static exportAsJS(palette, options = {}) {
    const { exportType = 'const', variableName = 'colorPalette', minify = false } = options;

    const jsonString = JSON.stringify(palette, null, minify ? 0 : 2);
    return `${exportType} ${variableName} = ${jsonString};`;
  }

  /**
   * Export palette as Adobe Swatch Exchange (ASE) data structure
   */
  static exportAsASE(palette) {
    // This would require a proper ASE library implementation
    // For now, return a simplified structure
    const swatches = Object.entries(palette).map(([name, color]) => ({
      name,
      color,
      type: 'color',
        }));

    return {
      version: '1.0',
      swatches,
        };
  }

  /**
   * Generate download blob for a given format
   */
  static generateDownloadBlob(palette, format, options = {}) {
    let content;
    let mimeType;
    let filename;

    switch (format) {
      case EXPORT_FORMATS.CSS:
        content = this.exportAsCSS(palette, options);
        mimeType = 'text/css';
        filename = 'palette.css';
        break;

      case EXPORT_FORMATS.SCSS:
        content = this.exportAsSCSS(palette, options);
        mimeType = 'text/scss';
        filename = 'palette.scss';
        break;

      case EXPORT_FORMATS.LESS:
        content = this.exportAsLESS(palette, options);
        mimeType = 'text/less';
        filename = 'palette.less';
        break;

      case EXPORT_FORMATS.JSON:
        content = this.exportAsJSON(palette, options.metadata);
        mimeType = 'application/json';
        filename = 'palette.json';
        break;

      case EXPORT_FORMATS.TAILWIND:
        content = this.exportAsTailwind(palette, options);
        mimeType = 'text/javascript';
        filename = 'tailwind.config.js';
        break;

      default:
        content = this.exportAsJSON(palette, options.metadata);
        mimeType = 'application/json';
        filename = 'palette.json';
    }

    return {
      blob: new Blob([content], { type: mimeType }),
      filename,
      content,
        };
  }

  /**
   * Download palette as file
   */
  static downloadPalette(palette, format = EXPORT_FORMATS.JSON, options = {}) {
    try {
      const { blob, filename } = this.generateDownloadBlob(palette, format, options);

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Error downloading palette:', error);
      return false;
    }
  }

  /**
   * Copy palette to clipboard
   */
  static async copyToClipboard(
    palette,
    format = EXPORT_FORMATS.JSON,
    options = {},
    try {
            const { content } = this.generateDownloadBlob(palette, format, options);

      if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(content);
                return true;
            }
      // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = content;
                textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
                document.body.removeChild(textArea);
                return true;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
            return false;
        }
    }

  /**
   * Generate shareable URL with palette data
   */
  static generateShareableURL(palette, baseUrl = window.location.origin) {
    try {
      const paletteData = btoa(JSON.stringify(palette));
      const url = new URL(baseUrl);
      url.searchParams.set('palette', paletteData);
      return url.toString();
    } catch (error) {
      console.error('Error generating shareable URL:', error);
      return null;
    }
  }

  /**
   * Parse palette from shareable URL
   */
  static parseFromURL(url = window.location.href) {
    try {
      const urlObj = new URL(url);
      const paletteData = urlObj.searchParams.get('palette');

      if (paletteData) {
        return JSON.parse(atob(paletteData));
      }

      return null;
    } catch (error) {
      console.error('Error parsing palette from URL:', error);
      return null;
    }
  }

  /**
   * Validate export format
   */
  static isValidFormat(format) {
    return Object.values(EXPORT_FORMATS).includes(format);
  }

  /**
   * Get available export formats with descriptions
   */
  static getAvailableFormats() {
    return [
      {
        value: EXPORT_FORMATS.CSS,
        label: 'CSS Custom Properties',
        description: 'CSS variables for use in web projects',
        extension: '.css',
            },
      {
        value: EXPORT_FORMATS.SCSS,
        label: 'SCSS Variables',
        description: 'Sass variables for SCSS projects',
        extension: '.scss',
            },
      {
        value: EXPORT_FORMATS.LESS,
        label: 'LESS Variables',
        description: 'LESS variables for LESS projects',
        extension: '.less',
            },
      {
        value: EXPORT_FORMATS.JSON,
        label: 'JSON Data',
        description: 'JSON format for programmatic use',
        extension: '.json',
            },
      {
        value: EXPORT_FORMATS.TAILWIND,
        label: 'Tailwind Config',
        description: 'Tailwind CSS configuration file',
        extension: '.js',
      },
        ];
  }
}
