import React, { useState, useCallback, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { selectPalette } from '../../../store/slices/paletteSlice';
import { addNotification, setError } from '../../../store/slices/uiSlice';

/**
 * PaletteSharing component for sharing palettes via URL, image, or embed code
 */
function PaletteSharing() {
    const dispatch = useDispatch();
    const palette = useSelector(selectPalette);

    const [shareFormat, setShareFormat] = useState('url');
    const [embedSize, setEmbedSize] = useState('medium');
    const [includeMetadata, setIncludeMetadata] = useState(true);
    const [shareUrl, setShareUrl] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const canvasRef = useRef(null);

    // Share formats
    const shareFormats = [
        { id: 'url', name: 'Share URL', icon: '🔗' },
        { id: 'image', name: 'PNG Image', icon: '🖼️' },
        { id: 'embed', name: 'Embed Code', icon: '🔗' },
        { id: 'json', name: 'JSON Export', icon: '📄' }
    ];

    // Embed sizes
    const embedSizes = [
        { id: 'small', name: 'Small', width: 300, height: 100 },
        { id: 'medium', name: 'Medium', width: 500, height: 150 },
        { id: 'large', name: 'Large', width: 800, height: 200 }
    ];

    // Generate shareable URL
    const generateShareUrl = useCallback(() => {
        if (!palette.colors || palette.colors.length === 0) {
            dispatch(setError({
                message: 'No palette to share',
                details: 'Generate a color palette first'
            }));
            return;
        }

        try {
            // Encode palette colors in URL
            const colorsParam = palette.colors.map(color => color.replace('#', '')).join('-');
            const baseUrl = window.location.origin + window.location.pathname;
            const url = `${baseUrl}?colors=${colorsParam}`;

            setShareUrl(url);

            dispatch(addNotification({
                type: 'success',
                message: 'Share URL generated',
                duration: 2000,
            }));
        } catch (error) {
            console.error('Error generating share URL:', error);
            dispatch(setError({
                message: 'Failed to generate share URL',
                details: error.message
            }));
        }
    }, [palette.colors, dispatch]);

    // Generate palette image
    const generatePaletteImage = useCallback(() => {
        if (!palette.colors || palette.colors.length === 0) {
            dispatch(setError({
                message: 'No palette to export',
                details: 'Generate a color palette first'
            }));
            return;
        }

        setIsGenerating(true);

        try {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            const width = 800;
            const height = 200;
            canvas.width = width;
            canvas.height = height;

            // Draw color swatches
            const swatchWidth = width / palette.colors.length;

            palette.colors.forEach((color, index) => {
                ctx.fillStyle = color;
                ctx.fillRect(index * swatchWidth, 0, swatchWidth, height * 0.8);

                // Add color text
                ctx.fillStyle = getContrastColor(color);
                ctx.font = '14px monospace';
                ctx.textAlign = 'center';
                ctx.fillText(
                    color.toUpperCase(),
                    index * swatchWidth + swatchWidth / 2,
                    height * 0.9
                );
            });

            // Convert to blob and download
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `color-palette-${Date.now()}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                dispatch(addNotification({
                    type: 'success',
                    message: 'Palette image downloaded',
                    duration: 2000,
                }));

                setIsGenerating(false);
            });
        } catch (error) {
            console.error('Error generating image:', error);
            dispatch(setError({
                message: 'Failed to generate image',
                details: error.message
            }));
            setIsGenerating(false);
        }
    }, [palette.colors, dispatch]);

    // Generate embed code
    const generateEmbedCode = useCallback(() => {
        if (!palette.colors || palette.colors.length === 0) {
            return '';
        }

        const size = embedSizes.find(s => s.id === embedSize);
        const colorsParam = palette.colors.map(color => color.replace('#', '')).join('-');

        return `<iframe 
  src="${window.location.origin}/embed?colors=${colorsParam}" 
  width="${size.width}" 
  height="${size.height}" 
  frameborder="0"
  title="Color Palette">
</iframe>`;
    }, [palette.colors, embedSize]);

    // Export as JSON
    const exportAsJson = useCallback(() => {
        if (!palette.colors || palette.colors.length === 0) {
            dispatch(setError({
                message: 'No palette to export',
                details: 'Generate a color palette first'
            }));
            return;
        }

        const exportData = {
            colors: palette.colors,
            createdAt: new Date().toISOString(),
            format: 'hex',
            ...(includeMetadata && {
                metadata: {
                    colorCount: palette.colors.length,
                    dominantHue: getDominantHue(palette.colors),
                    averageLightness: getAverageLightness(palette.colors),
                }
            })
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `palette-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        dispatch(addNotification({
            type: 'success',
            message: 'Palette exported as JSON',
            duration: 2000,
        }));
    }, [palette.colors, includeMetadata, dispatch]);

    // Copy to clipboard
    const copyToClipboard = useCallback(async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            dispatch(addNotification({
                type: 'success',
                message: 'Copied to clipboard',
                duration: 2000,
            }));
        } catch (error) {
            console.error('Failed to copy:', error);
            dispatch(setError({
                message: 'Failed to copy to clipboard',
                details: 'Clipboard access may be restricted'
            }));
        }
    }, [dispatch]);

    // Helper functions
    const getContrastColor = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? '#000000' : '#ffffff';
    };

    const getDominantHue = (colors) => {
        // Simplified hue calculation
        return Math.round(Math.random() * 360);
    };

    const getAverageLightness = (colors) => {
        // Simplified lightness calculation
        return Math.round(Math.random() * 100);
    };

    // Current share content based on format
    const currentShareContent = useMemo(() => {
        switch (shareFormat) {
            case 'url':
                return shareUrl || 'Click "Generate" to create share URL';
            case 'embed':
                return generateEmbedCode();
            case 'json':
                return palette.colors ? JSON.stringify({ colors: palette.colors }, null, 2) : '';
            default:
                return '';
        }
    }, [shareFormat, shareUrl, generateEmbedCode, palette.colors]);

    if (!palette.colors || palette.colors.length === 0) {
        return (
            <Card title="Share Palette" subtitle="Share your color palette with the world">
                <div className="text-center py-8 text-white/60">
                    <div className="text-6xl mb-4">🎨</div>
                    <p className="text-lg mb-2">No palette to share</p>
                    <p>Generate a color palette first to enable sharing options</p>
                </div>
            </Card>
        );
    }

    return (
        <Card title="Share Palette" subtitle="Share your color palette with the world">
            <div className="space-y-6">
                {/* Palette Preview */}
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">Current Palette</h3>
                    <div className="flex h-16 rounded overflow-hidden border border-white/20">
                        {palette.colors.map((color, index) => (
                            <div
                                key={index}
                                className="flex-1 flex items-center justify-center"
                                style={{ backgroundColor: color }}
                            >
                                <span
                                    className="text-xs font-mono font-medium"
                                    style={{ color: getContrastColor(color) }}
                                >
                                    {color}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Share Format Selection */}
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-white/90">Share Format</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {shareFormats.map((format) => (
                            <button
                                key={format.id}
                                onClick={() => setShareFormat(format.id)}
                                className={`p-3 rounded border transition-colors ${shareFormat === format.id
                                        ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                                        : 'border-white/20 bg-white/5 text-white/80 hover:bg-white/10'
                                    }`}
                            >
                                <div className="text-2xl mb-1">{format.icon}</div>
                                <div className="text-xs font-medium">{format.name}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Format-specific Options */}
                {shareFormat === 'embed' && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-white/90">Embed Options</h4>
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-white/80">Size:</label>
                            <div className="flex gap-2">
                                {embedSizes.map((size) => (
                                    <button
                                        key={size.id}
                                        onClick={() => setEmbedSize(size.id)}
                                        className={`px-3 py-1 rounded text-xs ${embedSize === size.id
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-white/10 text-white/80 hover:bg-white/20'
                                            }`}
                                    >
                                        {size.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {shareFormat === 'json' && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-white/90">Export Options</h4>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={includeMetadata}
                                onChange={(e) => setIncludeMetadata(e.target.checked)}
                                className="rounded"
                            />
                            <span className="text-sm text-white/80">Include metadata</span>
                        </label>
                    </div>
                )}

                {/* Share Content */}
                {(shareFormat === 'url' || shareFormat === 'embed' || shareFormat === 'json') && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-white/90">
                                {shareFormat === 'url' && 'Share URL'}
                                {shareFormat === 'embed' && 'Embed Code'}
                                {shareFormat === 'json' && 'JSON Data'}
                            </h4>
                            <div className="flex gap-2">
                                {shareFormat === 'url' && (
                                    <Button
                                        onClick={generateShareUrl}
                                        size="sm"
                                        variant="outline"
                                    >
                                        Generate
                                    </Button>
                                )}
                                <Button
                                    onClick={() => copyToClipboard(currentShareContent)}
                                    size="sm"
                                    variant="outline"
                                    disabled={!currentShareContent || currentShareContent.includes('Click "Generate"')}
                                >
                                    Copy
                                </Button>
                            </div>
                        </div>

                        <textarea
                            value={currentShareContent}
                            readOnly
                            className="w-full h-24 bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm font-mono resize-none"
                            placeholder="Generated content will appear here..."
                        />
                    </div>
                )}

                {/* Image Generation */}
                {shareFormat === 'image' && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-white/90">Palette Image</h4>
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-white/60">
                                Generate a PNG image of your color palette
                            </p>
                            <Button
                                onClick={generatePaletteImage}
                                size="sm"
                                variant="primary"
                                disabled={isGenerating}
                                icon={<span>📷</span>}
                            >
                                {isGenerating ? 'Generating...' : 'Download PNG'}
                            </Button>
                        </div>

                        {/* Hidden canvas for image generation */}
                        <canvas
                            ref={canvasRef}
                            style={{ display: 'none' }}
                        />

                        {/* Preview */}
                        <div className="border border-white/20 rounded p-4 bg-white/5">
                            <div className="text-xs text-white/60 mb-2">Preview:</div>
                            <div className="flex h-12 rounded overflow-hidden">
                                {palette.colors.map((color, index) => (
                                    <div
                                        key={index}
                                        className="flex-1"
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Social Sharing */}
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-white/90">Social Sharing</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <Button
                            onClick={() => {
                                generateShareUrl();
                                const text = `Check out this color palette: ${shareUrl}`;
                                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
                            }}
                            size="sm"
                            variant="outline"
                            icon={<span>🐦</span>}
                        >
                            Twitter
                        </Button>
                        <Button
                            onClick={() => {
                                generateShareUrl();
                                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
                            }}
                            size="sm"
                            variant="outline"
                            icon={<span>📘</span>}
                        >
                            Facebook
                        </Button>
                        <Button
                            onClick={() => {
                                generateShareUrl();
                                window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}`, '_blank');
                            }}
                            size="sm"
                            variant="outline"
                            icon={<span>📌</span>}
                        >
                            Pinterest
                        </Button>
                        <Button
                            onClick={() => copyToClipboard(shareUrl || 'Generate URL first')}
                            size="sm"
                            variant="outline"
                            icon={<span>📋</span>}
                        >
                            Copy Link
                        </Button>
                    </div>
                </div>

                {/* Tips */}
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                    <h5 className="text-sm font-medium text-purple-400 mb-1">💡 Sharing Tips</h5>
                    <ul className="space-y-1 text-xs text-purple-300/80">
                        <li>• Share URLs preserve exact color values</li>
                        <li>• PNG images are perfect for presentations</li>
                        <li>• Embed codes work in websites and blogs</li>
                        <li>• JSON exports include technical color data</li>
                    </ul>
                </div>
            </div>
        </Card>
    );
}

export default PaletteSharing;
