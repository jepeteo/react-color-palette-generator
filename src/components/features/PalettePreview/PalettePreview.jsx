import React, { useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ColorUtils } from '../../../utils/colorUtils';
import { useAccessibility } from '../../../hooks/useAccessibility';
import {
    selectPalette,
    selectPrimaryColor,
    selectHarmonyType,
    selectColorCount
} from '../../../store/slices/paletteSlice';
import {
    selectSelectedElement,
    setSelectedElement,
    addNotification
} from '../../../store/slices/uiSlice';

/**
 * Interactive PalettePreview component with element selection
 */
const PalettePreview = () => {
    const dispatch = useDispatch();

    const palette = useSelector(selectPalette);
    const primaryColor = useSelector(selectPrimaryColor);
    const harmonyType = useSelector(selectHarmonyType);
    const colorCount = useSelector(selectColorCount);
    const selectedElement = useSelector(selectSelectedElement);

    const { checkContrast, getWcagLevel } = useAccessibility();

    const [previewMode, setPreviewMode] = useState('web'); // web, mobile, print
    const [showAccessibilityInfo, setShowAccessibilityInfo] = useState(false);

    // Generate element styles based on palette
    const elementStyles = useMemo(() => {
        if (!palette.colors || palette.colors.length < 2) {
            return {
                background: '#1a1a1a',
                primary: '#3b82f6',
                text: '#ffffff',
                accent: '#10b981',
                secondary: '#6b7280'
            };
        }

        const colors = palette.colors;
        return {
            background: colors[colors.length - 1] || '#1a1a1a',
            primary: colors[0] || '#3b82f6',
            text: ColorUtils.getContrastColor(colors[colors.length - 1] || '#1a1a1a'),
            accent: colors[1] || '#10b981',
            secondary: colors[2] || '#6b7280'
        };
    }, [palette.colors]);

    // Check accessibility for current combination
    const accessibilityInfo = useMemo(() => {
        const bgColor = elementStyles.background;
        const textColor = elementStyles.text;
        const primaryColor = elementStyles.primary;

        return {
            textContrast: checkContrast(textColor, bgColor),
            primaryContrast: checkContrast(primaryColor, bgColor),
            textWcag: getWcagLevel(textColor, bgColor),
            primaryWcag: getWcagLevel(primaryColor, bgColor)
        };
    }, [elementStyles, checkContrast, getWcagLevel]);

    // Handle element selection
    const handleElementClick = useCallback((elementType, color) => {
        dispatch(setSelectedElement({
            type: elementType,
            color: color,
            timestamp: Date.now()
        }));

        dispatch(addNotification({
            type: 'info',
            message: `Selected ${elementType}: ${color}`,
            duration: 2000
        }));
    }, [dispatch]);

    // Copy color to clipboard
    const copyColor = useCallback(async (color) => {
        try {
            await navigator.clipboard.writeText(color);
            dispatch(addNotification({
                type: 'success',
                message: `Copied ${color}`,
                duration: 2000
            }));
        } catch (error) {
            console.error('Failed to copy color:', error);
        }
    }, [dispatch]);

    // Preview components based on mode
    const renderWebPreview = () => (
        <div
            className="rounded-lg overflow-hidden border border-white/20 transition-all duration-300"
            style={{ backgroundColor: elementStyles.background }}
        >
            {/* Header */}
            <div
                className="p-4 border-b border-white/10 cursor-pointer hover:bg-white/5 transition-colors group"
                onClick={() => handleElementClick('primary', elementStyles.primary)}
                style={{ backgroundColor: elementStyles.primary }}
            >
                <h3
                    className="font-semibold group-hover:scale-105 transition-transform"
                    style={{ color: ColorUtils.getContrastColor(elementStyles.primary) }}
                >
                    Website Header
                </h3>
                {selectedElement?.type === 'primary' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                <div
                    className="cursor-pointer hover:bg-white/5 p-2 rounded transition-colors group relative"
                    onClick={() => handleElementClick('text', elementStyles.text)}
                >
                    <p style={{ color: elementStyles.text }}>
                        This is sample body text showing how your colors work together.
                    </p>
                    {selectedElement?.type === 'text' && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                    )}
                </div>

                <div className="flex gap-2">
                    <button
                        className="px-4 py-2 rounded font-medium hover:scale-105 transition-transform cursor-pointer relative group"
                        style={{
                            backgroundColor: elementStyles.accent,
                            color: ColorUtils.getContrastColor(elementStyles.accent)
                        }}
                        onClick={() => handleElementClick('accent', elementStyles.accent)}
                    >
                        Primary Button
                        {selectedElement?.type === 'accent' && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                        )}
                    </button>

                    <button
                        className="px-4 py-2 rounded border hover:scale-105 transition-transform cursor-pointer relative group"
                        style={{
                            borderColor: elementStyles.secondary,
                            color: elementStyles.secondary
                        }}
                        onClick={() => handleElementClick('secondary', elementStyles.secondary)}
                    >
                        Secondary Button
                        {selectedElement?.type === 'secondary' && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                        )}
                    </button>
                </div>

                <div
                    className="p-3 rounded border-l-4 cursor-pointer hover:bg-white/5 transition-colors relative group"
                    style={{
                        borderLeftColor: elementStyles.accent,
                        backgroundColor: `${elementStyles.accent}10`
                    }}
                    onClick={() => handleElementClick('highlight', elementStyles.accent)}
                >
                    <p style={{ color: elementStyles.text }}>
                        This is a highlighted section or call-out box.
                    </p>
                    {selectedElement?.type === 'highlight' && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                    )}
                </div>
            </div>
        </div>
    );

    const renderMobilePreview = () => (
        <div className="w-64 mx-auto rounded-3xl overflow-hidden border-2 border-white/20" style={{ backgroundColor: elementStyles.background }}>
            {/* Status Bar */}
            <div className="h-6 bg-black/20 flex items-center justify-center">
                <div className="text-xs" style={{ color: elementStyles.text }}>9:41 AM</div>
            </div>

            {/* Header */}
            <div
                className="p-4 cursor-pointer hover:bg-white/5 transition-colors relative"
                style={{ backgroundColor: elementStyles.primary }}
                onClick={() => handleElementClick('primary', elementStyles.primary)}
            >
                <h3 className="font-bold text-center" style={{ color: ColorUtils.getContrastColor(elementStyles.primary) }}>
                    Mobile App
                </h3>
                {selectedElement?.type === 'primary' && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                <div
                    className="cursor-pointer hover:bg-white/5 p-2 rounded transition-colors relative"
                    onClick={() => handleElementClick('text', elementStyles.text)}
                >
                    <p className="text-sm" style={{ color: elementStyles.text }}>
                        Mobile interface preview
                    </p>
                    {selectedElement?.type === 'text' && (
                        <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    )}
                </div>

                <button
                    className="w-full py-3 rounded-lg font-semibold hover:scale-105 transition-transform relative"
                    style={{
                        backgroundColor: elementStyles.accent,
                        color: ColorUtils.getContrastColor(elementStyles.accent)
                    }}
                    onClick={() => handleElementClick('accent', elementStyles.accent)}
                >
                    Touch Button
                    {selectedElement?.type === 'accent' && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    )}
                </button>
            </div>
        </div>
    );

    const renderPrintPreview = () => (
        <div className="bg-white text-black p-6 rounded-lg border border-gray-300 max-w-md mx-auto">
            <div
                className="border-b-4 pb-2 mb-4 cursor-pointer hover:bg-gray-50 transition-colors relative"
                style={{ borderBottomColor: elementStyles.primary }}
                onClick={() => handleElementClick('primary', elementStyles.primary)}
            >
                <h2 className="text-xl font-bold" style={{ color: elementStyles.primary }}>
                    Print Document
                </h2>
                {selectedElement?.type === 'primary' && (
                    <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                )}
            </div>

            <div
                className="mb-4 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors relative"
                onClick={() => handleElementClick('text', '#000000')}
            >
                <p className="text-gray-800 leading-relaxed">
                    This shows how your color palette works in print materials. The primary color is used for headings and accents.
                </p>
                {selectedElement?.type === 'text' && (
                    <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                )}
            </div>

            <div
                className="p-3 rounded cursor-pointer hover:bg-gray-50 transition-colors relative"
                style={{ backgroundColor: `${elementStyles.accent}20`, borderLeft: `4px solid ${elementStyles.accent}` }}
                onClick={() => handleElementClick('accent', elementStyles.accent)}
            >
                <p className="text-sm">Important information or call-out section</p>
                {selectedElement?.type === 'accent' && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                )}
            </div>
        </div>
    );

    return (
        <Card
            title="Interactive Preview"
            subtitle="Click elements to select colors for your palette"
        >
            <div className="space-y-4">
                {/* Preview Mode Selector */}
                <div className="flex gap-2">
                    {[
                        { mode: 'web', label: '🌐 Web', icon: '💻' },
                        { mode: 'mobile', label: '📱 Mobile', icon: '📱' },
                        { mode: 'print', label: '🖨️ Print', icon: '📄' }
                    ].map(({ mode, label, icon }) => (
                        <Button
                            key={mode}
                            onClick={() => setPreviewMode(mode)}
                            variant={previewMode === mode ? 'primary' : 'outline'}
                            size="sm"
                            icon={<span>{icon}</span>}
                        >
                            {label.split(' ')[1]}
                        </Button>
                    ))}
                </div>

                {/* Preview Content */}
                <div className="relative min-h-[200px]">
                    {previewMode === 'web' && renderWebPreview()}
                    {previewMode === 'mobile' && renderMobilePreview()}
                    {previewMode === 'print' && renderPrintPreview()}
                </div>

                {/* Selected Element Info */}
                {selectedElement && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-blue-400">
                                Selected: {selectedElement.type}
                            </h4>
                            <button
                                onClick={() => copyColor(selectedElement.color)}
                                className="text-xs text-blue-300 hover:text-blue-200 transition-colors"
                            >
                                📋 Copy
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-6 h-6 rounded border border-white/20"
                                style={{ backgroundColor: selectedElement.color }}
                            />
                            <span className="font-mono text-sm text-white/90">
                                {selectedElement.color}
                            </span>
                        </div>
                    </div>
                )}

                {/* Accessibility Info Toggle */}
                <div className="flex items-center justify-between">
                    <span className="text-sm text-white/80">Accessibility Check</span>
                    <Button
                        onClick={() => setShowAccessibilityInfo(!showAccessibilityInfo)}
                        variant="outline"
                        size="sm"
                        icon={<span>{showAccessibilityInfo ? '👁️' : '♿'}</span>}
                    >
                        {showAccessibilityInfo ? 'Hide' : 'Show'}
                    </Button>
                </div>

                {/* Accessibility Information */}
                {showAccessibilityInfo && (
                    <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 rounded-lg p-3">
                                <h5 className="text-xs font-medium text-white/80 mb-1">Text Contrast</h5>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-1 rounded ${accessibilityInfo.textContrast >= 4.5 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                        }`}>
                                        {accessibilityInfo.textContrast.toFixed(2)}:1
                                    </span>
                                    <span className="text-xs text-white/60">{accessibilityInfo.textWcag}</span>
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-lg p-3">
                                <h5 className="text-xs font-medium text-white/80 mb-1">Primary Contrast</h5>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-1 rounded ${accessibilityInfo.primaryContrast >= 3 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                        }`}>
                                        {accessibilityInfo.primaryContrast.toFixed(2)}:1
                                    </span>
                                    <span className="text-xs text-white/60">{accessibilityInfo.primaryWcag}</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-xs text-white/60">
                            <p>WCAG AA requires 4.5:1 for normal text, 3:1 for large text</p>
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="flex gap-2">
                    <Button
                        onClick={() => copyColor(elementStyles.primary)}
                        size="sm"
                        variant="outline"
                        icon={<span>🎨</span>}
                    >
                        Copy Primary
                    </Button>
                    <Button
                        onClick={() => dispatch(setSelectedElement(null))}
                        size="sm"
                        variant="outline"
                        icon={<span>✕</span>}
                    >
                        Clear Selection
                    </Button>
                </div>

                {/* Usage Tips */}
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                    <h5 className="text-sm font-medium text-amber-400 mb-1">💡 Preview Tips</h5>
                    <ul className="text-xs text-amber-300/80 space-y-1">
                        <li>• Click any element to select its color</li>
                        <li>• Switch between web, mobile, and print previews</li>
                        <li>• Check accessibility compliance before finalizing</li>
                        <li>• Copy colors directly from selected elements</li>
                    </ul>
                </div>
            </div>
        </Card>
    );
};

export default PalettePreview;
