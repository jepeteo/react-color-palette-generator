import React, { useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ColorUtils } from '../../../utils/colorUtils';
import {
    selectPalette,
    selectPrimaryColor,
    selectHarmonyType
} from '../../../store/slices/paletteSlice';
import {
    addNotification,
    setError
} from '../../../store/slices/uiSlice';

/**
 * Comprehensive ExportTools component with multiple format support
 */
const ExportTools = () => {
    const dispatch = useDispatch();
    const palette = useSelector(selectPalette);
    const primaryColor = useSelector(selectPrimaryColor);
    const harmonyType = useSelector(selectHarmonyType);

    const [selectedFormat, setSelectedFormat] = useState('css');
    const [includeMetadata, setIncludeMetadata] = useState(true);
    const [colorNaming, setColorNaming] = useState('descriptive'); // descriptive, numeric, custom
    const [customNames, setCustomNames] = useState({});
    const [previewCode, setPreviewCode] = useState('');

    // Export formats configuration
    const exportFormats = {
        css: {
            name: 'CSS Custom Properties',
            extension: 'css',
            icon: '🎨',
            description: 'CSS variables for web development'
        },
        scss: {
            name: 'SCSS Variables',
            extension: 'scss',
            icon: '💎',
            description: 'Sass variables for preprocessing'
        },
        json: {
            name: 'JSON Data',
            extension: 'json',
            icon: '📊',
            description: 'Structured data format'
        },
        js: {
            name: 'JavaScript Object',
            extension: 'js',
            icon: '⚡',
            description: 'JavaScript module export'
        },
        swift: {
            name: 'Swift UIColor',
            extension: 'swift',
            icon: '🍎',
            description: 'iOS Swift color definitions'
        },
        android: {
            name: 'Android XML',
            extension: 'xml',
            icon: '🤖',
            description: 'Android color resources'
        },
        figma: {
            name: 'Figma Tokens',
            extension: 'json',
            icon: '🎯',
            description: 'Design tokens for Figma'
        },
        ase: {
            name: 'Adobe ASE',
            extension: 'ase',
            icon: '🎪',
            description: 'Adobe Swatch Exchange (simulated)'
        }
    };

    // Generate color names
    const generateColorNames = useCallback((colors, namingType) => {
        return colors.map((color, index) => {
            if (namingType === 'custom' && customNames[index]) {
                return customNames[index];
            }

            if (namingType === 'numeric') {
                return `color-${index + 1}`;
            }

            // Descriptive naming
            try {
                const hsl = ColorUtils.hexToHsl(color);
                const lightness = hsl.l;
                const saturation = hsl.s;

                let baseName = '';

                // Determine base color name from hue
                const hue = hsl.h;
                if (hue >= 0 && hue < 15) baseName = 'red';
                else if (hue >= 15 && hue < 45) baseName = 'orange';
                else if (hue >= 45 && hue < 75) baseName = 'yellow';
                else if (hue >= 75 && hue < 105) baseName = 'lime';
                else if (hue >= 105 && hue < 135) baseName = 'green';
                else if (hue >= 135 && hue < 165) baseName = 'teal';
                else if (hue >= 165 && hue < 195) baseName = 'cyan';
                else if (hue >= 195 && hue < 225) baseName = 'blue';
                else if (hue >= 225 && hue < 255) baseName = 'indigo';
                else if (hue >= 255 && hue < 285) baseName = 'purple';
                else if (hue >= 285 && hue < 315) baseName = 'pink';
                else if (hue >= 315 && hue < 345) baseName = 'rose';
                else baseName = 'red';

                // Add descriptors based on lightness and saturation
                let modifier = '';
                if (saturation < 20) {
                    modifier = lightness > 80 ? 'light-gray' : lightness > 20 ? 'gray' : 'dark-gray';
                    baseName = '';
                } else if (lightness > 85) {
                    modifier = 'very-light';
                } else if (lightness > 65) {
                    modifier = 'light';
                } else if (lightness < 15) {
                    modifier = 'very-dark';
                } else if (lightness < 35) {
                    modifier = 'dark';
                }

                const name = modifier ? `${modifier}-${baseName}` : baseName;
                return name.replace(/^-+|-+$/g, '') || `color-${index + 1}`;
            } catch (error) {
                return `color-${index + 1}`;
            }
        });
    }, [customNames]);

    // Generate export content
    const generateExportContent = useCallback((format, colors, names) => {
        const timestamp = new Date().toISOString();
        const metadata = includeMetadata ? {
            generated: timestamp,
            harmony: harmonyType,
            primaryColor: primaryColor,
            totalColors: colors.length
        } : null;

        switch (format) {
            case 'css':
                let css = includeMetadata ? `/* Generated by Color Palette Generator - ${timestamp} */\n` : '';
                css += includeMetadata ? `/* Harmony: ${harmonyType} | Primary: ${primaryColor} */\n\n` : '';
                css += ':root {\n';
                colors.forEach((color, index) => {
                    css += `  --${names[index]}: ${color};\n`;
                });
                css += '}\n';

                if (includeMetadata) {
                    css += '\n/* Usage example:\n';
                    css += ' * background-color: var(--' + names[0] + ');\n';
                    css += ' * color: var(--' + names[1] + ');\n';
                    css += ' */';
                }
                return css;

            case 'scss':
                let scss = includeMetadata ? `// Generated by Color Palette Generator - ${timestamp}\n` : '';
                scss += includeMetadata ? `// Harmony: ${harmonyType} | Primary: ${primaryColor}\n\n` : '';
                colors.forEach((color, index) => {
                    scss += `$${names[index]}: ${color};\n`;
                });

                if (includeMetadata) {
                    scss += '\n// Color map for easy iteration\n';
                    scss += '$colors: (\n';
                    colors.forEach((color, index) => {
                        scss += `  "${names[index]}": ${color}${index < colors.length - 1 ? ',' : ''}\n`;
                    });
                    scss += ');\n';
                }
                return scss;

            case 'json':
                const jsonData = {
                    ...(metadata && { metadata }),
                    colors: colors.reduce((acc, color, index) => {
                        acc[names[index]] = {
                            hex: color,
                            rgb: ColorUtils.hexToRgb(color),
                            hsl: ColorUtils.hexToHsl(color)
                        };
                        return acc;
                    }, {})
                };
                return JSON.stringify(jsonData, null, 2);

            case 'js':
                let js = includeMetadata ? `// Generated by Color Palette Generator - ${timestamp}\n` : '';
                js += includeMetadata ? `// Harmony: ${harmonyType} | Primary: ${primaryColor}\n\n` : '';
                js += 'export const colors = {\n';
                colors.forEach((color, index) => {
                    js += `  ${names[index]}: "${color}",\n`;
                });
                js += '};\n\n';
                js += 'export const colorDetails = {\n';
                colors.forEach((color, index) => {
                    const rgb = ColorUtils.hexToRgb(color);
                    const hsl = ColorUtils.hexToHsl(color);
                    js += `  ${names[index]}: {\n`;
                    js += `    hex: "${color}",\n`;
                    js += `    rgb: [${rgb.r}, ${rgb.g}, ${rgb.b}],\n`;
                    js += `    hsl: [${Math.round(hsl.h)}, ${Math.round(hsl.s)}, ${Math.round(hsl.l)}]\n`;
                    js += `  }${index < colors.length - 1 ? ',' : ''}\n`;
                });
                js += '};\n\n';
                js += 'export default colors;';
                return js;

            case 'swift':
                let swift = includeMetadata ? `// Generated by Color Palette Generator - ${timestamp}\n` : '';
                swift += includeMetadata ? `// Harmony: ${harmonyType} | Primary: ${primaryColor}\n\n` : '';
                swift += 'import UIKit\n\n';
                swift += 'extension UIColor {\n';
                colors.forEach((color, index) => {
                    const rgb = ColorUtils.hexToRgb(color);
                    const name = names[index].replace(/-/g, '').replace(/\s+/g, '');
                    swift += `    static let ${name} = UIColor(red: ${(rgb.r / 255).toFixed(3)}, green: ${(rgb.g / 255).toFixed(3)}, blue: ${(rgb.b / 255).toFixed(3)}, alpha: 1.0)\n`;
                });
                swift += '}\n';
                return swift;

            case 'android':
                let xml = '<?xml version="1.0" encoding="utf-8"?>\n';
                xml += includeMetadata ? `<!-- Generated by Color Palette Generator - ${timestamp} -->\n` : '';
                xml += includeMetadata ? `<!-- Harmony: ${harmonyType} | Primary: ${primaryColor} -->\n` : '';
                xml += '<resources>\n';
                colors.forEach((color, index) => {
                    const name = names[index].replace(/-/g, '_');
                    xml += `    <color name="${name}">${color}</color>\n`;
                });
                xml += '</resources>\n';
                return xml;

            case 'figma':
                const figmaTokens = {
                    ...(metadata && { $metadata: metadata }),
                    color: colors.reduce((acc, color, index) => {
                        acc[names[index]] = {
                            $type: "color",
                            $value: color,
                            $description: `Generated color from ${harmonyType} harmony`
                        };
                        return acc;
                    }, {})
                };
                return JSON.stringify(figmaTokens, null, 2);

            case 'ase':
                // ASE format is binary, so we'll create a JSON representation
                const aseData = {
                    version: "1.0",
                    groups: [{
                        name: "Color Palette",
                        colors: colors.map((color, index) => ({
                            name: names[index],
                            model: "RGB",
                            color: ColorUtils.hexToRgb(color),
                            type: "global"
                        }))
                    }]
                };
                return JSON.stringify(aseData, null, 2);

            default:
                return '';
        }
    }, [includeMetadata, harmonyType, primaryColor]);

    // Generated content preview
    const generatedContent = useMemo(() => {
        if (!palette.colors || palette.colors.length === 0) return '';

        const names = generateColorNames(palette.colors, colorNaming);
        return generateExportContent(selectedFormat, palette.colors, names);
    }, [palette.colors, selectedFormat, colorNaming, generateColorNames, generateExportContent]);

    // Handle export
    const handleExport = useCallback((format) => {
        if (!palette.colors || palette.colors.length === 0) {
            dispatch(setError({
                message: 'No palette to export',
                details: 'Generate a color palette first'
            }));
            return;
        }

        try {
            const names = generateColorNames(palette.colors, colorNaming);
            const content = generateExportContent(format, palette.colors, names);
            const formatConfig = exportFormats[format];

            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `color-palette-${Date.now()}.${formatConfig.extension}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            dispatch(addNotification({
                type: 'success',
                message: `Exported as ${formatConfig.name}`,
                duration: 2000
            }));
        } catch (error) {
            console.error('Export error:', error);
            dispatch(setError({
                message: 'Export failed',
                details: error.message
            }));
        }
    }, [palette.colors, colorNaming, generateColorNames, generateExportContent, exportFormats, dispatch]);

    // Copy to clipboard
    const copyToClipboard = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(generatedContent);
            dispatch(addNotification({
                type: 'success',
                message: 'Copied to clipboard',
                duration: 2000
            }));
        } catch (error) {
            console.error('Copy failed:', error);
        }
    }, [generatedContent, dispatch]);

    // Handle custom name change
    const handleCustomNameChange = useCallback((index, name) => {
        setCustomNames(prev => ({
            ...prev,
            [index]: name.replace(/[^a-zA-Z0-9-_]/g, '')
        }));
    }, []);

    if (!palette.colors || palette.colors.length === 0) {
        return (
            <Card title="Export Tools" subtitle="Export your palette in multiple formats">
                <div className="text-center py-8 text-white/60">
                    <div className="text-4xl mb-4">📦</div>
                    <p>No palette to export</p>
                    <p className="text-sm mt-2">Generate colors to access export tools</p>
                </div>
            </Card>
        );
    }

    return (
        <Card title="Export Tools" subtitle="Export your palette in developer-friendly formats">
            <div className="space-y-6">
                {/* Format Selection */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.entries(exportFormats).map(([key, format]) => (
                        <button
                            key={key}
                            onClick={() => setSelectedFormat(key)}
                            className={`p-3 rounded-lg border transition-all duration-200 text-left ${selectedFormat === key
                                    ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                                    : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40 hover:bg-white/10'
                                }`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">{format.icon}</span>
                                <span className="font-medium text-sm">{format.name}</span>
                            </div>
                            <p className="text-xs opacity-80">{format.description}</p>
                        </button>
                    ))}
                </div>

                {/* Options */}
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Color Naming */}
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Color Naming
                            </label>
                            <select
                                value={colorNaming}
                                onChange={(e) => setColorNaming(e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            >
                                <option value="descriptive">Descriptive (red, blue, etc.)</option>
                                <option value="numeric">Numeric (color-1, color-2)</option>
                                <option value="custom">Custom Names</option>
                            </select>
                        </div>

                        {/* Metadata Toggle */}
                        <div className="flex items-center">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={includeMetadata}
                                    onChange={(e) => setIncludeMetadata(e.target.checked)}
                                    className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500/50"
                                />
                                <span className="text-sm text-white/80">Include metadata</span>
                            </label>
                        </div>

                        {/* Quick Export */}
                        <div className="flex gap-2">
                            <Button
                                onClick={() => handleExport(selectedFormat)}
                                variant="primary"
                                size="sm"
                                icon={<span>💾</span>}
                            >
                                Export
                            </Button>
                            <Button
                                onClick={copyToClipboard}
                                variant="outline"
                                size="sm"
                                icon={<span>📋</span>}
                            >
                                Copy
                            </Button>
                        </div>
                    </div>

                    {/* Custom Names Input */}
                    {colorNaming === 'custom' && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-white/80">Custom Color Names</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {palette.colors.map((color, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div
                                            className="w-6 h-6 rounded border border-white/20"
                                            style={{ backgroundColor: color }}
                                        />
                                        <input
                                            type="text"
                                            placeholder={`color-${index + 1}`}
                                            value={customNames[index] || ''}
                                            onChange={(e) => handleCustomNameChange(index, e.target.value)}
                                            className="flex-1 bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Preview */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-white/80">
                            Preview ({exportFormats[selectedFormat].name})
                        </h4>
                        <div className="text-xs text-white/60">
                            {generatedContent.split('\n').length} lines
                        </div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 max-h-64 overflow-y-auto">
                        <pre className="text-xs text-white/80 whitespace-pre-wrap font-mono">
                            {generatedContent}
                        </pre>
                    </div>
                </div>

                {/* Bulk Export */}
                <div className="border-t border-white/10 pt-4">
                    <h4 className="text-sm font-medium text-white/80 mb-3">Bulk Export</h4>
                    <div className="flex gap-2 flex-wrap">
                        <Button
                            onClick={() => {
                                Object.keys(exportFormats).forEach(format => {
                                    setTimeout(() => handleExport(format), 100 * Object.keys(exportFormats).indexOf(format));
                                });
                            }}
                            variant="outline"
                            size="sm"
                            icon={<span>📦</span>}
                        >
                            Export All Formats
                        </Button>
                        <Button
                            onClick={() => {
                                ['css', 'scss', 'json'].forEach(format => {
                                    setTimeout(() => handleExport(format), 100 * ['css', 'scss', 'json'].indexOf(format));
                                });
                            }}
                            variant="outline"
                            size="sm"
                            icon={<span>🌐</span>}
                        >
                            Web Formats Only
                        </Button>
                        <Button
                            onClick={() => {
                                ['swift', 'android'].forEach(format => {
                                    setTimeout(() => handleExport(format), 100 * ['swift', 'android'].indexOf(format));
                                });
                            }}
                            variant="outline"
                            size="sm"
                            icon={<span>📱</span>}
                        >
                            Mobile Formats
                        </Button>
                    </div>
                </div>

                {/* Usage Tips */}
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
                    <h5 className="text-sm font-medium text-indigo-400 mb-1">💡 Export Tips</h5>
                    <ul className="text-xs text-indigo-300/80 space-y-1">
                        <li>• CSS/SCSS formats are perfect for web development</li>
                        <li>• JSON format works great for design systems</li>
                        <li>• Swift/Android formats for mobile app development</li>
                        <li>• Use descriptive naming for better code readability</li>
                    </ul>
                </div>
            </div>
        </Card>
    );
};

export default ExportTools;
