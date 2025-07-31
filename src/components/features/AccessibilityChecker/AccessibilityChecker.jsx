import React, { useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { useAccessibility } from '../../../hooks/useAccessibility';
import { ColorUtils } from '../../../utils/colorUtils';
import {
    selectPalette,
    selectPrimaryColor
} from '../../../store/slices/paletteSlice';
import {
    addNotification,
    setError
} from '../../../store/slices/uiSlice';

/**
 * Comprehensive AccessibilityChecker component with WCAG compliance
 */
const AccessibilityChecker = () => {
    const dispatch = useDispatch();
    const palette = useSelector(selectPalette);
    const primaryColor = useSelector(selectPrimaryColor);

    const {
        checkContrast,
        getWcagLevel,
        analyzeColorPalette,
        getLuminanceRatio,
        checkColorBlindnessCompliance
    } = useAccessibility();

    const [selectedStandard, setSelectedStandard] = useState('AA'); // AA, AAA
    const [showDetails, setShowDetails] = useState(false);
    const [simulationMode, setSimulationMode] = useState('none'); // none, protanopia, deuteranopia, tritanopia, monochromacy

    // WCAG Standards
    const wcagStandards = {
        AA: {
            normalText: 4.5,
            largeText: 3.0,
            graphical: 3.0
        },
        AAA: {
            normalText: 7.0,
            largeText: 4.5,
            graphical: 4.5
        }
    };

    // Comprehensive accessibility analysis
    const accessibilityAnalysis = useMemo(() => {
        if (!palette.colors || palette.colors.length < 2) {
            return {
                overallScore: 0,
                level: 'poor',
                issues: ['Insufficient colors for analysis'],
                recommendations: ['Generate a palette with at least 2 colors'],
                contrastPairs: [],
                colorBlindnessIssues: []
            };
        }

        const contrastPairs = [];
        const issues = [];
        const recommendations = [];
        const colorBlindnessIssues = [];

        // Analyze all color combinations
        for (let i = 0; i < palette.colors.length; i++) {
            for (let j = i + 1; j < palette.colors.length; j++) {
                const color1 = palette.colors[i];
                const color2 = palette.colors[j];
                const contrast = checkContrast(color1, color2);
                const wcagLevel = getWcagLevel(color1, color2);

                const pair = {
                    color1,
                    color2,
                    contrast,
                    wcagLevel,
                    passesAA: contrast >= wcagStandards.AA.normalText,
                    passesAAA: contrast >= wcagStandards.AAA.normalText,
                    passesAALarge: contrast >= wcagStandards.AA.largeText,
                    passesAAALarge: contrast >= wcagStandards.AAA.largeText
                };

                contrastPairs.push(pair);

                // Check for issues
                if (selectedStandard === 'AA' && !pair.passesAA) {
                    issues.push(`Low contrast between ${color1} and ${color2} (${contrast.toFixed(2)}:1)`);
                    recommendations.push(`Increase contrast between ${color1} and ${color2} to at least 4.5:1`);
                } else if (selectedStandard === 'AAA' && !pair.passesAAA) {
                    issues.push(`Low contrast for AAA between ${color1} and ${color2} (${contrast.toFixed(2)}:1)`);
                    recommendations.push(`Increase contrast between ${color1} and ${color2} to at least 7:1`);
                }
            }
        }

        // Color blindness analysis
        const colorBlindnessResults = checkColorBlindnessCompliance(palette.colors);
        if (colorBlindnessResults.hasIssues) {
            colorBlindnessIssues.push(...colorBlindnessResults.issues);
            recommendations.push(...colorBlindnessResults.recommendations);
        }

        // Calculate overall score
        const passingPairs = contrastPairs.filter(pair =>
            selectedStandard === 'AA' ? pair.passesAA : pair.passesAAA
        ).length;
        const totalPairs = contrastPairs.length;
        const overallScore = totalPairs > 0 ? (passingPairs / totalPairs) * 100 : 0;

        // Determine level
        let level = 'excellent';
        if (overallScore < 50) level = 'poor';
        else if (overallScore < 70) level = 'fair';
        else if (overallScore < 90) level = 'good';

        return {
            overallScore,
            level,
            issues,
            recommendations,
            contrastPairs,
            colorBlindnessIssues,
            colorBlindnessResults
        };
    }, [palette.colors, selectedStandard, checkContrast, getWcagLevel, checkColorBlindnessCompliance]);

    // Simulate color blindness
    const simulateColorBlindness = useCallback((color, type) => {
        if (type === 'none') return color;

        try {
            const rgb = ColorUtils.hexToRgb(color);

            switch (type) {
                case 'protanopia': // Red-blind
                    return ColorUtils.rgbToHex({
                        r: Math.round(0.567 * rgb.r + 0.433 * rgb.g),
                        g: Math.round(0.558 * rgb.r + 0.442 * rgb.g),
                        b: rgb.b
                    });
                case 'deuteranopia': // Green-blind
                    return ColorUtils.rgbToHex({
                        r: Math.round(0.625 * rgb.r + 0.375 * rgb.g),
                        g: Math.round(0.7 * rgb.r + 0.3 * rgb.g),
                        b: rgb.b
                    });
                case 'tritanopia': // Blue-blind
                    return ColorUtils.rgbToHex({
                        r: Math.round(0.95 * rgb.r + 0.05 * rgb.g),
                        g: Math.round(0.433 * rgb.g + 0.567 * rgb.b),
                        b: Math.round(0.475 * rgb.g + 0.525 * rgb.b)
                    });
                case 'monochromacy': // Total color blindness
                    const gray = Math.round(0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b);
                    return ColorUtils.rgbToHex({ r: gray, g: gray, b: gray });
                default:
                    return color;
            }
        } catch (error) {
            console.error('Error simulating color blindness:', error);
            return color;
        }
    }, []);

    // Get color for display (with simulation)
    const getDisplayColor = useCallback((color) => {
        return simulateColorBlindness(color, simulationMode);
    }, [simulateColorBlindness, simulationMode]);

    // Fix accessibility issues automatically
    const autoFixIssues = useCallback(() => {
        // This would implement automatic fixes
        dispatch(addNotification({
            type: 'info',
            message: 'Auto-fix feature coming soon',
            details: 'This will automatically adjust colors to meet accessibility standards',
            duration: 3000
        }));
    }, [dispatch]);

    // Export accessibility report
    const exportReport = useCallback(() => {
        const report = {
            palette: palette.colors,
            standard: selectedStandard,
            analysis: accessibilityAnalysis,
            timestamp: new Date().toISOString(),
            summary: {
                overallScore: accessibilityAnalysis.overallScore,
                level: accessibilityAnalysis.level,
                totalIssues: accessibilityAnalysis.issues.length,
                passedTests: accessibilityAnalysis.contrastPairs.filter(p =>
                    selectedStandard === 'AA' ? p.passesAA : p.passesAAA
                ).length,
                totalTests: accessibilityAnalysis.contrastPairs.length
            }
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `accessibility-report-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        dispatch(addNotification({
            type: 'success',
            message: 'Accessibility report exported',
            duration: 2000
        }));
    }, [accessibilityAnalysis, selectedStandard, palette.colors, dispatch]);

    if (!palette.colors || palette.colors.length === 0) {
        return (
            <Card title="Accessibility Checker" subtitle="Generate a palette to check accessibility">
                <div className="text-center py-8 text-white/60">
                    <div className="text-4xl mb-4">♿</div>
                    <p>No palette to analyze</p>
                    <p className="text-sm mt-2">Generate or upload colors to check accessibility compliance</p>
                </div>
            </Card>
        );
    }

    return (
        <Card title="Accessibility Checker" subtitle="WCAG compliance and color blindness analysis">
            <div className="space-y-6">
                {/* Controls */}
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setSelectedStandard('AA')}
                            variant={selectedStandard === 'AA' ? 'primary' : 'outline'}
                            size="sm"
                        >
                            WCAG AA
                        </Button>
                        <Button
                            onClick={() => setSelectedStandard('AAA')}
                            variant={selectedStandard === 'AAA' ? 'primary' : 'outline'}
                            size="sm"
                        >
                            WCAG AAA
                        </Button>
                    </div>

                    <select
                        value={simulationMode}
                        onChange={(e) => setSimulationMode(e.target.value)}
                        className="bg-white/10 border border-white/20 rounded px-3 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                        <option value="none">Normal Vision</option>
                        <option value="protanopia">Protanopia (Red-blind)</option>
                        <option value="deuteranopia">Deuteranopia (Green-blind)</option>
                        <option value="tritanopia">Tritanopia (Blue-blind)</option>
                        <option value="monochromacy">Monochromacy</option>
                    </select>

                    <Button
                        onClick={() => setShowDetails(!showDetails)}
                        variant="outline"
                        size="sm"
                        icon={<span>{showDetails ? '📊' : '📋'}</span>}
                    >
                        {showDetails ? 'Summary' : 'Details'}
                    </Button>
                </div>

                {/* Overall Score */}
                <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-white">
                            Overall Accessibility Score
                        </h3>
                        <div className="flex items-center gap-2">
                            <div className={`text-2xl font-bold ${accessibilityAnalysis.level === 'excellent' ? 'text-green-400' :
                                    accessibilityAnalysis.level === 'good' ? 'text-yellow-400' :
                                        accessibilityAnalysis.level === 'fair' ? 'text-orange-400' :
                                            'text-red-400'
                                }`}>
                                {accessibilityAnalysis.overallScore.toFixed(0)}%
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${accessibilityAnalysis.level === 'excellent' ? 'bg-green-500/20 text-green-400' :
                                    accessibilityAnalysis.level === 'good' ? 'bg-yellow-500/20 text-yellow-400' :
                                        accessibilityAnalysis.level === 'fair' ? 'bg-orange-500/20 text-orange-400' :
                                            'bg-red-500/20 text-red-400'
                                }`}>
                                {accessibilityAnalysis.level.toUpperCase()}
                            </div>
                        </div>
                    </div>

                    <div className="w-full bg-white/10 rounded-full h-3">
                        <div
                            className={`h-3 rounded-full transition-all duration-500 ${accessibilityAnalysis.level === 'excellent' ? 'bg-green-500' :
                                    accessibilityAnalysis.level === 'good' ? 'bg-yellow-500' :
                                        accessibilityAnalysis.level === 'fair' ? 'bg-orange-500' :
                                            'bg-red-500'
                                }`}
                            style={{ width: `${accessibilityAnalysis.overallScore}%` }}
                        />
                    </div>
                </div>

                {/* Color Display with Simulation */}
                <div className="space-y-3">
                    <h4 className="text-white/90 font-medium">
                        Color Palette {simulationMode !== 'none' && `(${simulationMode} simulation)`}
                    </h4>
                    <div className="grid grid-cols-6 gap-2">
                        {palette.colors.map((color, index) => (
                            <div key={index} className="text-center">
                                <div
                                    className="w-full h-12 rounded border border-white/20"
                                    style={{ backgroundColor: getDisplayColor(color) }}
                                />
                                <p className="text-xs text-white/60 mt-1 font-mono">
                                    {color}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contrast Analysis */}
                {showDetails ? (
                    <div className="space-y-4">
                        <h4 className="text-white/90 font-medium">Detailed Contrast Analysis</h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {accessibilityAnalysis.contrastPairs.map((pair, index) => (
                                <div key={index} className="bg-white/5 rounded p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-4 h-4 rounded border border-white/20"
                                                style={{ backgroundColor: getDisplayColor(pair.color1) }}
                                            />
                                            <span className="text-xs font-mono">{pair.color1}</span>
                                            <span className="text-white/40">vs</span>
                                            <div
                                                className="w-4 h-4 rounded border border-white/20"
                                                style={{ backgroundColor: getDisplayColor(pair.color2) }}
                                            />
                                            <span className="text-xs font-mono">{pair.color2}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-mono">{pair.contrast.toFixed(2)}:1</span>
                                            <span className={`text-xs px-2 py-1 rounded ${(selectedStandard === 'AA' ? pair.passesAA : pair.passesAAA)
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-red-500/20 text-red-400'
                                                }`}>
                                                {(selectedStandard === 'AA' ? pair.passesAA : pair.passesAAA) ? 'PASS' : 'FAIL'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-xs text-white/60">
                                        AA: {pair.passesAA ? '✓' : '✗'} Normal, {pair.passesAALarge ? '✓' : '✗'} Large |
                                        AAA: {pair.passesAAA ? '✓' : '✗'} Normal, {pair.passesAAALarge ? '✓' : '✗'} Large
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Issues */}
                        {accessibilityAnalysis.issues.length > 0 && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                <h4 className="text-red-400 font-medium mb-2 flex items-center gap-2">
                                    <span>⚠️</span>
                                    Issues Found ({accessibilityAnalysis.issues.length})
                                </h4>
                                <ul className="text-red-300 text-sm space-y-1">
                                    {accessibilityAnalysis.issues.slice(0, 3).map((issue, index) => (
                                        <li key={index}>• {issue}</li>
                                    ))}
                                    {accessibilityAnalysis.issues.length > 3 && (
                                        <li className="text-red-400">+ {accessibilityAnalysis.issues.length - 3} more...</li>
                                    )}
                                </ul>
                            </div>
                        )}

                        {/* Recommendations */}
                        {accessibilityAnalysis.recommendations.length > 0 && (
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                                <h4 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
                                    <span>💡</span>
                                    Recommendations
                                </h4>
                                <ul className="text-blue-300 text-sm space-y-1">
                                    {accessibilityAnalysis.recommendations.slice(0, 3).map((rec, index) => (
                                        <li key={index}>• {rec}</li>
                                    ))}
                                    {accessibilityAnalysis.recommendations.length > 3 && (
                                        <li className="text-blue-400">+ {accessibilityAnalysis.recommendations.length - 3} more...</li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                    <Button
                        onClick={autoFixIssues}
                        variant="primary"
                        size="sm"
                        icon={<span>🔧</span>}
                        disabled={accessibilityAnalysis.issues.length === 0}
                    >
                        Auto Fix Issues
                    </Button>
                    <Button
                        onClick={exportReport}
                        variant="outline"
                        size="sm"
                        icon={<span>📄</span>}
                    >
                        Export Report
                    </Button>
                    <Button
                        onClick={() => setShowDetails(!showDetails)}
                        variant="outline"
                        size="sm"
                        icon={<span>🔍</span>}
                    >
                        {showDetails ? 'Hide' : 'Show'} Details
                    </Button>
                </div>

                {/* WCAG Guidelines */}
                <div className="bg-gray-500/10 border border-gray-500/20 rounded-lg p-4">
                    <h5 className="text-gray-300 font-medium mb-2">WCAG {selectedStandard} Requirements</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
                        <div>
                            <strong>Normal Text:</strong> {wcagStandards[selectedStandard].normalText}:1
                        </div>
                        <div>
                            <strong>Large Text:</strong> {wcagStandards[selectedStandard].largeText}:1
                        </div>
                        <div>
                            <strong>Graphics:</strong> {wcagStandards[selectedStandard].graphical}:1
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default AccessibilityChecker;
