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
    selectColorCount,
} from '../../../store/slices/paletteSlice';
import {
    selectSelectedElement,
    setSelectedElement,
    addNotification,
} from '../../../store/slices/uiSlice';

/**
 * Interactive PalettePreview component with element selection
 */
function PalettePreview() {
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
                secondary: '#6b7280',
            };
        }

        const { colors } = palette;
        return {
            background: colors[colors.length - 1] || '#1a1a1a',
            primary: colors[0] || '#3b82f6',
            text: ColorUtils.getContrastColor(colors[colors.length - 1] || '#1a1a1a'),
            accent: colors[1] || '#10b981',
            secondary: colors[2] || '#6b7280',
        };
    }, [palette]);

    // Handle element click for color selection
    const handleElementClick = useCallback(
        (elementType, currentColor) => {
            dispatch(setSelectedElement({ type: elementType, color: currentColor }));
            dispatch(
                addNotification({
                    type: 'info',
                    message: `Selected ${elementType} element`,
                    duration: 2000,
                }),
            );
        },
        [dispatch],
    );

    // Copy color to clipboard
    const copyColor = useCallback(async (color) => {
        try {
            await navigator.clipboard.writeText(color);
            dispatch(addNotification({
                type: 'success',
                message: `Copied ${color}`,
                duration: 2000,
            }));
        } catch (error) {
            console.error('Failed to copy color:', error);
        }
    }, [dispatch]);

    // Preview components based on mode
    const renderWebPreview = () => (
        <div
            className="mx-auto w-80 overflow-hidden rounded-lg border border-white/20"
            style={{ backgroundColor: elementStyles.background }}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between p-4 border-b border-white/10"
                style={{ backgroundColor: elementStyles.primary }}
            >
                <h3
                    className="font-semibold cursor-pointer"
                    style={{ color: ColorUtils.getContrastColor(elementStyles.primary) }}
                    onClick={() => handleElementClick('primary', elementStyles.primary)}
                >
                    Website Header
                </h3>
                <button
                    className="px-3 py-1 rounded text-sm cursor-pointer"
                    style={{
                        backgroundColor: elementStyles.accent,
                        color: ColorUtils.getContrastColor(elementStyles.accent),
                    }}
                    onClick={() => handleElementClick('accent', elementStyles.accent)}
                >
                    CTA Button
                </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                <h4
                    className="text-lg font-medium cursor-pointer"
                    style={{ color: elementStyles.text }}
                    onClick={() => handleElementClick('text', elementStyles.text)}
                >
                    Main Content Area
                </h4>
                <p
                    className="text-sm opacity-80 cursor-pointer"
                    style={{ color: elementStyles.secondary }}
                    onClick={() => handleElementClick('secondary', elementStyles.secondary)}
                >
                    This is a sample paragraph to demonstrate how your colors look in a real website layout.
                </p>
                <div className="flex gap-2">
                    <button
                        className="px-3 py-2 rounded text-sm cursor-pointer"
                        style={{
                            backgroundColor: elementStyles.accent,
                            color: ColorUtils.getContrastColor(elementStyles.accent),
                        }}
                        onClick={() => handleElementClick('accent', elementStyles.accent)}
                    >
                        Primary Button
                    </button>
                    <button
                        className="px-3 py-2 rounded text-sm border cursor-pointer"
                        style={{
                            color: elementStyles.accent,
                            borderColor: elementStyles.accent,
                        }}
                        onClick={() => handleElementClick('accent', elementStyles.accent)}
                    >
                        Secondary Button
                    </button>
                </div>
            </div>
        </div>
    );

    const renderMobilePreview = () => (
        <div
            className="mx-auto w-64 overflow-hidden rounded-3xl border-2 border-white/20"
            style={{ backgroundColor: elementStyles.background }}
        >
            {/* Status Bar */}
            <div className="flex h-6 items-center justify-center bg-black/20">
                <div className="text-xs" style={{ color: elementStyles.text }}>
                    9:41 AM
                </div>
            </div>

            {/* Header */}
            <div
                className="flex items-center justify-between p-4"
                style={{ backgroundColor: elementStyles.primary }}
            >
                <h3
                    className="font-semibold cursor-pointer"
                    style={{ color: ColorUtils.getContrastColor(elementStyles.primary) }}
                    onClick={() => handleElementClick('primary', elementStyles.primary)}
                >
                    App Name
                </h3>
                <div
                    className="w-8 h-8 rounded-full cursor-pointer"
                    style={{ backgroundColor: elementStyles.accent }}
                    onClick={() => handleElementClick('accent', elementStyles.accent)}
                />
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
                <div
                    className="p-3 rounded-lg cursor-pointer"
                    style={{ backgroundColor: `${elementStyles.accent}20` }}
                    onClick={() => handleElementClick('accent', elementStyles.accent)}
                >
                    <h4 className="font-medium" style={{ color: elementStyles.accent }}>
                        Feature Card
                    </h4>
                    <p className="text-sm mt-1" style={{ color: elementStyles.text }}>
                        Mobile app interface preview
                    </p>
                </div>
                <button
                    className="w-full py-3 rounded-lg font-medium cursor-pointer"
                    style={{
                        backgroundColor: elementStyles.accent,
                        color: ColorUtils.getContrastColor(elementStyles.accent),
                    }}
                    onClick={() => handleElementClick('accent', elementStyles.accent)}
                >
                    Action Button
                </button>
            </div>
        </div>
    );

    const renderPrintPreview = () => (
        <div
            className="mx-auto w-80 aspect-[8.5/11] overflow-hidden border border-white/20 p-6"
            style={{ backgroundColor: elementStyles.background }}
        >
            <div className="h-full flex flex-col">
                <h1
                    className="text-2xl font-bold mb-4 cursor-pointer"
                    style={{ color: elementStyles.primary }}
                    onClick={() => handleElementClick('primary', elementStyles.primary)}
                >
                    Document Title
                </h1>
                <div className="flex-1 space-y-3">
                    <p
                        className="text-sm cursor-pointer"
                        style={{ color: elementStyles.text }}
                        onClick={() => handleElementClick('text', elementStyles.text)}
                    >
                        This is how your color palette would look in print materials like brochures, flyers, or business cards.
                    </p>
                    <div
                        className="p-3 border-l-4 cursor-pointer"
                        style={{
                            borderColor: elementStyles.accent,
                            backgroundColor: `${elementStyles.accent}10`,
                        }}
                        onClick={() => handleElementClick('accent', elementStyles.accent)}
                    >
                        <p className="text-sm" style={{ color: elementStyles.text }}>
                            Highlighted content or callout box
                        </p>
                    </div>
                </div>
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
                        { id: 'web', label: '🌐 Web', icon: '🌐' },
                        { id: 'mobile', label: '📱 Mobile', icon: '📱' },
                        { id: 'print', label: '🖨️ Print', icon: '🖨️' },
                    ].map((mode) => (
                        <Button
                            key={mode.id}
                            onClick={() => setPreviewMode(mode.id)}
                            variant={previewMode === mode.id ? 'primary' : 'ghost'}
                            size="sm"
                        >
                            {mode.label}
                        </Button>
                    ))}
                </div>

                {/* Preview Area */}
                <div className="bg-white/5 rounded-lg p-6 min-h-[300px] flex items-center justify-center">
                    {previewMode === 'web' && renderWebPreview()}
                    {previewMode === 'mobile' && renderMobilePreview()}
                    {previewMode === 'print' && renderPrintPreview()}
                </div>

                {/* Selected Element Info */}
                {selectedElement && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <h5 className="text-sm font-medium text-blue-400">
                                    Selected: {selectedElement.type}
                                </h5>
                                <p className="text-xs text-blue-300/80">
                                    Color: {selectedElement.color}
                                </p>
                            </div>
                            <Button
                                onClick={() => copyColor(selectedElement.color)}
                                variant="ghost"
                                size="sm"
                                icon={<span>📋</span>}
                            >
                                Copy
                            </Button>
                        </div>
                    </div>
                )}

                {/* Color Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <h5 className="text-sm font-medium text-white/90">Current Palette</h5>
                        <div className="flex gap-2">
                            {palette.colors?.slice(0, 5).map((color, index) => (
                                <div
                                    key={index}
                                    className="w-8 h-8 rounded cursor-pointer hover:scale-110 transition-transform"
                                    style={{ backgroundColor: color }}
                                    onClick={() => copyColor(color)}
                                    title={`Click to copy ${color}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <h5 className="text-sm font-medium text-white/90">Accessibility</h5>
                            <Button
                                onClick={() => setShowAccessibilityInfo(!showAccessibilityInfo)}
                                variant="ghost"
                                size="sm"
                            >
                                {showAccessibilityInfo ? '▼' : '▶'}
                            </Button>
                        </div>
                        {showAccessibilityInfo && (
                            <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white/5 rounded-lg p-3">
                                        <h5 className="text-xs font-medium text-white/70 mb-1">
                                            Text Contrast
                                        </h5>
                                        <span className="text-sm font-mono">
                                            {checkContrast(elementStyles.text, elementStyles.background).toFixed(1)}:1
                                        </span>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3">
                                        <h5 className="text-xs font-medium text-white/70 mb-1">
                                            WCAG Level
                                        </h5>
                                        <span className="text-sm">
                                            {getWcagLevel(elementStyles.text, elementStyles.background)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Usage Tips */}
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <h5 className="text-sm font-medium text-green-400 mb-1">💡 Tips</h5>
                    <ul className="space-y-1 text-xs text-green-300/80">
                        <li>• Click any element in the preview to select it for editing</li>
                        <li>• Check contrast ratios to ensure accessibility compliance</li>
                        <li>• Switch between preview modes to see your palette in different contexts</li>
                    </ul>
                </div>
            </div>
        </Card>
    );
}

export default PalettePreview;
