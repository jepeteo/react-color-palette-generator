import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Card from '../../ui/Card';
import { ColorUtils } from '../../../utils/colorUtils';
import { selectPalette, selectHarmonyType } from '../../../store/slices/paletteSlice';

/**
 * Visual color wheel showing harmony relationships
 */
function ColorWheel() {
    const palette = useSelector(selectPalette);
    const harmonyType = useSelector(selectHarmonyType);

    // Generate color wheel points
    const colorPoints = useMemo(() => {
        if (!palette.colors || palette.colors.length === 0) return [];

        return palette.colors.map((color, index) => {
            try {
                const hsl = ColorUtils.hexToHsl(color);
                const angle = (hsl.h * Math.PI) / 180;
                const radius = 80; // Base radius for color wheel
                const x = 120 + radius * Math.cos(angle - Math.PI / 2);
                const y = 120 + radius * Math.sin(angle - Math.PI / 2);

                return {
                    x,
                    y,
                    color,
                    hue: hsl.h,
                    saturation: hsl.s,
                    lightness: hsl.l,
                    index,
                };
            } catch (error) {
                return null;
            }
        }).filter(Boolean);
    }, [palette.colors]);

    // Generate harmony lines
    const harmonyLines = useMemo(() => {
        if (colorPoints.length < 2) return [];

        const lines = [];
        const centerX = 120;
        const centerY = 120;

        // Connect harmony relationships
        switch (harmonyType) {
            case 'complementary':
                if (colorPoints.length >= 2) {
                    lines.push({
                        x1: colorPoints[0].x,
                        y1: colorPoints[0].y,
                        x2: colorPoints[1].x,
                        y2: colorPoints[1].y,
                        type: 'complementary'
                    });
                }
                break;

            case 'triadic':
                for (let i = 0; i < colorPoints.length; i++) {
                    const next = (i + 1) % colorPoints.length;
                    if (colorPoints[next]) {
                        lines.push({
                            x1: colorPoints[i].x,
                            y1: colorPoints[i].y,
                            x2: colorPoints[next].x,
                            y2: colorPoints[next].y,
                            type: 'triadic'
                        });
                    }
                }
                break;

            case 'analogous':
                for (let i = 0; i < colorPoints.length - 1; i++) {
                    lines.push({
                        x1: colorPoints[i].x,
                        y1: colorPoints[i].y,
                        x2: colorPoints[i + 1].x,
                        y2: colorPoints[i + 1].y,
                        type: 'analogous'
                    });
                }
                break;

            default:
                // For other harmonies, connect to center
                colorPoints.forEach(point => {
                    lines.push({
                        x1: centerX,
                        y1: centerY,
                        x2: point.x,
                        y2: point.y,
                        type: 'radial'
                    });
                });
        }

        return lines;
    }, [colorPoints, harmonyType]);

    if (!palette.colors || palette.colors.length === 0) {
        return (
            <Card title="Color Wheel" subtitle="Visual harmony relationships">
                <div className="text-center py-8 text-white/60">
                    <div className="text-4xl mb-4">🎯</div>
                    <p>Generate colors to see harmony visualization</p>
                </div>
            </Card>
        );
    }

    return (
        <Card title="Color Wheel" subtitle={`${harmonyType} harmony visualization`}>
            <div className="flex flex-col items-center space-y-4">
                {/* Color Wheel SVG */}
                <div className="relative">
                    <svg width="240" height="240" className="drop-shadow-lg">
                        {/* Background circle */}
                        <circle
                            cx="120"
                            cy="120"
                            r="100"
                            fill="none"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                        />

                        {/* Harmony relationship lines */}
                        {harmonyLines.map((line, index) => (
                            <line
                                key={index}
                                x1={line.x1}
                                y1={line.y1}
                                x2={line.x2}
                                y2={line.y2}
                                stroke="rgba(255,255,255,0.3)"
                                strokeWidth="1"
                                strokeDasharray={line.type === 'radial' ? '3,3' : '1,0'}
                            />
                        ))}

                        {/* Color points */}
                        {colorPoints.map((point, index) => (
                            <g key={index}>
                                {/* Color circle */}
                                <circle
                                    cx={point.x}
                                    cy={point.y}
                                    r="12"
                                    fill={point.color}
                                    stroke="rgba(255,255,255,0.8)"
                                    strokeWidth="2"
                                />
                                {/* Index label */}
                                <text
                                    x={point.x}
                                    y={point.y + 25}
                                    textAnchor="middle"
                                    className="fill-white text-xs font-medium"
                                >
                                    {index + 1}
                                </text>
                            </g>
                        ))}

                        {/* Center point */}
                        <circle
                            cx="120"
                            cy="120"
                            r="3"
                            fill="rgba(255,255,255,0.5)"
                        />
                    </svg>
                </div>

                {/* Color Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-sm">
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-white/60 mb-1">Harmony Type</div>
                        <div className="text-white font-medium capitalize">{harmonyType}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-white/60 mb-1">Color Count</div>
                        <div className="text-white font-medium">{palette.colors.length}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-white/60 mb-1">Hue Range</div>
                        <div className="text-white font-medium">
                            {colorPoints.length > 0 && (
                                <>
                                    {Math.round(Math.min(...colorPoints.map(p => p.hue)))}° -
                                    {Math.round(Math.max(...colorPoints.map(p => p.hue)))}°
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3 w-full">
                    <h5 className="text-sm font-medium text-indigo-400 mb-2">🎯 Harmony Guide</h5>
                    <div className="text-xs text-indigo-300/80 space-y-1">
                        <div>• <strong>Complementary:</strong> Colors opposite on the wheel (high contrast)</div>
                        <div>• <strong>Triadic:</strong> Three colors evenly spaced (balanced)</div>
                        <div>• <strong>Analogous:</strong> Adjacent colors (harmonious)</div>
                        <div>• <strong>Monochromatic:</strong> Same hue, different shades</div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default ColorWheel;
