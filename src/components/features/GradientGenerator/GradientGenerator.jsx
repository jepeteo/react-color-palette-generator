import React, { useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { setPalette } from '../../../store/slices/paletteSlice';
import { addNotification } from '../../../store/slices/uiSlice';
import { selectPalette } from '../../../store/slices/paletteSlice';
import { ColorUtils } from '../../../utils/colorUtils';

/**
 * Advanced Gradient Generator with multiple gradient types and customization
 */
function GradientGenerator() {
    const dispatch = useDispatch();
    const palette = useSelector(selectPalette);

    const [gradientType, setGradientType] = useState('linear');
    const [direction, setDirection] = useState('to right');
    const [steps, setSteps] = useState(5);
    const [colorSpace, setColorSpace] = useState('rgb');
    const [easingFunction, setEasingFunction] = useState('linear');
    const [showCode, setShowCode] = useState(false);
    const [selectedColors, setSelectedColors] = useState([]);

    // Gradient types
    const gradientTypes = {
        linear: { name: 'Linear', icon: '↗️', description: 'Straight line gradients' },
        radial: { name: 'Radial', icon: '⭕', description: 'Circular gradients' },
        conic: { name: 'Conic', icon: '🌀', description: 'Rotating gradients' },
        mesh: { name: 'Mesh', icon: '🕸️', description: 'Complex mesh gradients' },
    };

    // Direction options for linear gradients
    const directions = [
        { value: 'to right', label: 'Left to Right', angle: '90deg' },
        { value: 'to left', label: 'Right to Left', angle: '270deg' },
        { value: 'to bottom', label: 'Top to Bottom', angle: '180deg' },
        { value: 'to top', label: 'Bottom to Top', angle: '0deg' },
        { value: 'to bottom right', label: 'Diagonal ↘', angle: '135deg' },
        { value: 'to bottom left', label: 'Diagonal ↙', angle: '225deg' },
        { value: 'to top right', label: 'Diagonal ↗', angle: '45deg' },
        { value: 'to top left', label: 'Diagonal ↖', angle: '315deg' },
    ];

    // Easing functions
    const easingFunctions = {
        linear: { name: 'Linear', description: 'Constant speed' },
        'ease-in': { name: 'Ease In', description: 'Slow start' },
        'ease-out': { name: 'Ease Out', description: 'Slow end' },
        'ease-in-out': { name: 'Ease In-Out', description: 'Slow start and end' },
        cubic: { name: 'Cubic', description: 'Smooth curve' }
    };

    // Generate gradient colors
    const generateGradientColors = useCallback((startColor, endColor, steps, colorSpace, easing) => {
        try {
            const colors = [];

            if (colorSpace === 'hsl') {
                const startHsl = ColorUtils.hexToHsl(startColor);
                const endHsl = ColorUtils.hexToHsl(endColor);

                for (let i = 0; i < steps; i++) {
                    const progress = i / (steps - 1);
                    const easedProgress = applyEasing(progress, easing);

                    const h = interpolate(startHsl.h, endHsl.h, easedProgress);
                    const s = interpolate(startHsl.s, endHsl.s, easedProgress);
                    const l = interpolate(startHsl.l, endHsl.l, easedProgress);

                    colors.push(ColorUtils.hslToHex({ h, s, l }));
                }
            } else {
                // RGB color space
                const startRgb = ColorUtils.hexToRgb(startColor);
                const endRgb = ColorUtils.hexToRgb(endColor);

                for (let i = 0; i < steps; i++) {
                    const progress = i / (steps - 1);
                    const easedProgress = applyEasing(progress, easing);

                    const r = Math.round(interpolate(startRgb.r, endRgb.r, easedProgress));
                    const g = Math.round(interpolate(startRgb.g, endRgb.g, easedProgress));
                    const b = Math.round(interpolate(startRgb.b, endRgb.b, easedProgress));

                    colors.push(ColorUtils.rgbToHex({ r, g, b }));
                }
            }

            return colors;
        } catch (error) {
            console.error('Gradient generation error:', error);
            return [startColor, endColor];
        }
    }, []);

    // Apply easing function
    const applyEasing = (t, easing) => {
        switch (easing) {
            case 'ease-in':
                return t * t;
            case 'ease-out':
                return 1 - Math.pow(1 - t, 2);
            case 'ease-in-out':
                return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            case 'cubic':
                return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            default:
                return t;
        }
    };

    // Interpolate between two values
    const interpolate = (start, end, progress) => {
        return start + (end - start) * progress;
    };

    // Generate multi-color gradient
    const generateMultiColorGradient = useCallback(() => {
        if (!palette.colors || palette.colors.length < 2) {
            dispatch(addNotification({
                type: 'error',
                message: 'Need at least 2 colors',
                details: 'Generate a palette with multiple colors first'
            }));
            return;
        }

        const colors = palette.colors.slice(0, 4); // Limit to 4 colors for performance
        const gradientColors = [];

        for (let i = 0; i < colors.length - 1; i++) {
            const segmentColors = generateGradientColors(
                colors[i],
                colors[i + 1],
                Math.ceil(steps / (colors.length - 1)),
                colorSpace,
                easingFunction
            );

            if (i === 0) {
                gradientColors.push(...segmentColors);
            } else {
                gradientColors.push(...segmentColors.slice(1)); // Skip first to avoid duplicates
            }
        }

        dispatch(setPalette({
            colors: gradientColors,
            name: `${gradientType} Gradient`,
            type: 'gradient'
        }));

        dispatch(addNotification({
            type: 'success',
            message: 'Gradient generated',
            details: `${gradientColors.length} gradient colors created`
        }));
    }, [palette.colors, steps, colorSpace, easingFunction, gradientType, generateGradientColors, dispatch]);

    // Generate CSS gradient code
    const generateCSSGradient = useMemo(() => {
        if (!palette.colors || palette.colors.length < 2) return '';

        const colors = palette.colors.join(', ');

        switch (gradientType) {
            case 'linear':
                return `background: linear-gradient(${direction}, ${colors});`;
            case 'radial':
                return `background: radial-gradient(circle, ${colors});`;
            case 'conic':
                return `background: conic-gradient(${colors});`;
            case 'mesh':
                return `background: linear-gradient(45deg, ${colors}), linear-gradient(-45deg, ${colors});\nbackground-blend-mode: multiply;`;
            default:
                return `background: linear-gradient(${direction}, ${colors});`;
        }
    }, [palette.colors, gradientType, direction]);

    // Copy CSS to clipboard
    const copyCSSCode = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(generateCSSGradient);
            dispatch(addNotification({
                type: 'success',
                message: 'CSS code copied',
                duration: 2000
            }));
        } catch (error) {
            dispatch(addNotification({
                type: 'error',
                message: 'Failed to copy',
                details: 'Clipboard not available'
            }));
        }
    }, [generateCSSGradient, dispatch]);

    // Generate random gradient palette
    const generateRandomGradient = useCallback(() => {
        const colors = [];
        const baseHue = Math.random() * 360;

        for (let i = 0; i < steps; i++) {
            const hue = (baseHue + (i * 360 / steps)) % 360;
            const saturation = 60 + Math.random() * 40;
            const lightness = 40 + Math.random() * 40;

            colors.push(ColorUtils.hslToHex({ h: hue, s: saturation, l: lightness }));
        }

        dispatch(setPalette({
            colors,
            name: `Random ${gradientType} Gradient`,
            type: 'gradient'
        }));

        dispatch(addNotification({
            type: 'success',
            message: 'Random gradient created',
            details: `${colors.length} colors generated`
        }));
    }, [steps, gradientType, dispatch]);

    // Preset gradients
    const presetGradients = {
        sunset: ['#FF6B6B', '#FF8E53', '#FF6B9D', '#C44569'],
        ocean: ['#667db6', '#0082c8', '#0094c6', '#667db6'],
        forest: ['#5A6C57', '#7F8C7F', '#A8B5A8', '#C9D1C8'],
        cosmic: ['#1e3c72', '#2a5298', '#6dd5fa', '#ffffff'],
        fire: ['#FF0000', '#FF4500', '#FFD700', '#FFA500'],
        ice: ['#00CED1', '#87CEEB', '#E0F6FF', '#F0F8FF'],
        purple: ['#667db6', '#9d50bb', '#c44569', '#f093fb'],
        rainbow: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3']
    };

    // Apply preset gradient
    const applyPresetGradient = useCallback((presetName) => {
        const colors = presetGradients[presetName];
        dispatch(setPalette({
            colors,
            name: `${presetName.charAt(0).toUpperCase() + presetName.slice(1)} Gradient`,
            type: 'gradient'
        }));

        dispatch(addNotification({
            type: 'success',
            message: 'Preset gradient applied',
            details: `${presetName} gradient loaded`
        }));
    }, [dispatch]);

    return (
        <Card title="Gradient Generator" subtitle="Create beautiful gradients and extract color palettes">
            <div className="space-y-6">
                {/* Gradient Preview */}
                {palette.colors && palette.colors.length >= 2 && (
                    <div className="space-y-4">
                        <div
                            className="h-32 rounded-lg border border-white/20 relative overflow-hidden"
                            style={{
                                background: gradientType === 'linear'
                                    ? `linear-gradient(${direction}, ${palette.colors.join(', ')})`
                                    : gradientType === 'radial'
                                        ? `radial-gradient(circle, ${palette.colors.join(', ')})`
                                        : gradientType === 'conic'
                                            ? `conic-gradient(${palette.colors.join(', ')})`
                                            : `linear-gradient(45deg, ${palette.colors.join(', ')}), linear-gradient(-45deg, ${palette.colors.join(', ')})`
                            }}
                        >
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <span className="text-white font-medium text-lg">
                                    {gradientTypes[gradientType].name} Gradient
                                </span>
                            </div>
                        </div>

                        {/* CSS Code */}
                        {showCode && (
                            <div className="bg-black/30 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-white font-medium text-sm">CSS Code</h4>
                                    <Button onClick={copyCSSCode} size="xs">
                                        📋 Copy
                                    </Button>
                                </div>
                                <pre className="text-xs text-green-300 whitespace-pre-wrap font-mono">
                                    {generateCSSGradient}
                                </pre>
                            </div>
                        )}
                    </div>
                )}

                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Gradient Type */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-white/80">Gradient Type</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(gradientTypes).map(([key, type]) => (
                                <button
                                    key={key}
                                    onClick={() => setGradientType(key)}
                                    className={`p-3 rounded-lg border transition-all duration-200 text-left ${gradientType === key
                                            ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                                            : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40'
                                        }`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span>{type.icon}</span>
                                        <span className="font-medium text-sm">{type.name}</span>
                                    </div>
                                    <p className="text-xs opacity-80">{type.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-white/80">Settings</h3>

                        {/* Direction (for linear gradients) */}
                        {gradientType === 'linear' && (
                            <div>
                                <label className="block text-xs font-medium text-white/70 mb-1">
                                    Direction
                                </label>
                                <select
                                    value={direction}
                                    onChange={(e) => setDirection(e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                >
                                    {directions.map((dir) => (
                                        <option key={dir.value} value={dir.value} className="bg-gray-800">
                                            {dir.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Steps */}
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1">
                                Gradient Steps: {steps}
                            </label>
                            <input
                                type="range"
                                min="3"
                                max="20"
                                value={steps}
                                onChange={(e) => setSteps(parseInt(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        {/* Color Space */}
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1">
                                Color Space
                            </label>
                            <select
                                value={colorSpace}
                                onChange={(e) => setColorSpace(e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            >
                                <option value="rgb" className="bg-gray-800">RGB</option>
                                <option value="hsl" className="bg-gray-800">HSL</option>
                            </select>
                        </div>

                        {/* Easing */}
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1">
                                Easing Function
                            </label>
                            <select
                                value={easingFunction}
                                onChange={(e) => setEasingFunction(e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            >
                                {Object.entries(easingFunctions).map(([key, easing]) => (
                                    <option key={key} value={key} className="bg-gray-800">
                                        {easing.name} - {easing.description}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                    <Button onClick={generateMultiColorGradient} size="sm">
                        🎨 Generate from Palette
                    </Button>
                    <Button onClick={generateRandomGradient} variant="outline" size="sm">
                        🎲 Random Gradient
                    </Button>
                    <Button
                        onClick={() => setShowCode(!showCode)}
                        variant="outline"
                        size="sm"
                    >
                        {showCode ? '🙈 Hide' : '👁️ Show'} CSS
                    </Button>
                </div>

                {/* Preset Gradients */}
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-white/80">Preset Gradients</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {Object.entries(presetGradients).map(([name, colors]) => (
                            <button
                                key={name}
                                onClick={() => applyPresetGradient(name)}
                                className="group relative h-16 rounded-lg border border-white/20 overflow-hidden hover:border-white/40 transition-all duration-200"
                                style={{
                                    background: `linear-gradient(to right, ${colors.join(', ')})`
                                }}
                            >
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <span className="text-white text-xs font-medium capitalize">
                                        {name}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tips */}
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                    <h5 className="text-purple-300 font-medium mb-2 flex items-center">
                        <span className="mr-2">💡</span>
                        Gradient Tips
                    </h5>
                    <ul className="text-purple-200/80 text-sm space-y-1">
                        <li>• Use HSL color space for smoother hue transitions</li>
                        <li>• Linear gradients work best for backgrounds and overlays</li>
                        <li>• Radial gradients create spotlight and glow effects</li>
                        <li>• Try different easing functions for unique transition curves</li>
                        <li>• Combine multiple gradients with blend modes for complex effects</li>
                    </ul>
                </div>
            </div>
        </Card>
    );
}

export default GradientGenerator;
