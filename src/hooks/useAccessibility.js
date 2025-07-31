import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectPalette } from '../store/slices/paletteSlice';
import { selectAccessibilitySettings } from '../store/slices/settingsSlice';
import { AccessibilityUtils } from '../utils/accessibilityUtils';
import { UI_ELEMENTS } from '../utils/constants';

/**
 * Custom hook for accessibility checking and analysis
 * Provides comprehensive WCAG compliance checking
 */
export const useAccessibility = (customColorCombinations = null) => {
    const palette = useSelector(selectPalette);
    const accessibilitySettings = useSelector(selectAccessibilitySettings);
    const [accessibilityData, setAccessibilityData] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Define default color combinations for UI elements
    const defaultColorCombinations = useMemo(() => {
        if (!palette) return [];

        return [
            {
                name: 'Body Text',
                fg: palette.text,
                bg: palette.background,
                element: UI_ELEMENTS.PARAGRAPH_TEXT,
                isLargeText: false,
                priority: 'high'
            },
            {
                name: 'Primary Button',
                fg: palette.text,
                bg: palette.primary,
                element: UI_ELEMENTS.BUTTON_BACKGROUND,
                isLargeText: false,
                priority: 'high'
            },
            {
                name: 'Secondary Button',
                fg: palette.text,
                bg: palette.secondary,
                element: UI_ELEMENTS.BUTTON_BACKGROUND,
                isLargeText: false,
                priority: 'medium'
            },
            {
                name: 'Link Text',
                fg: palette.accent,
                bg: palette.background,
                element: UI_ELEMENTS.LINK_TEXT,
                isLargeText: false,
                priority: 'high'
            },
            {
                name: 'Header Text',
                fg: palette.text,
                bg: palette.surface || palette.background,
                element: UI_ELEMENTS.HEADER_TEXT,
                isLargeText: true,
                priority: 'medium'
            },
            {
                name: 'Surface Text',
                fg: palette.text,
                bg: palette.surface || palette.background,
                element: UI_ELEMENTS.PARAGRAPH_TEXT,
                isLargeText: false,
                priority: 'medium'
            }
        ].filter(combo => combo.fg && combo.bg); // Filter out undefined colors
    }, [palette]);

    // Use custom combinations if provided, otherwise use defaults
    const colorCombinations = customColorCombinations || defaultColorCombinations;

    // Analyze accessibility whenever palette or combinations change
    useEffect(() => {
        if (!accessibilitySettings.checkContrast || !colorCombinations.length) {
            setAccessibilityData(null);
            return;
        }

        setIsAnalyzing(true);

        // Use setTimeout to avoid blocking the UI
        const timeoutId = setTimeout(() => {
            try {
                const analysis = AccessibilityUtils.analyzePaletteAccessibility(colorCombinations);
                setAccessibilityData(analysis);
            } catch (error) {
                console.error('Error analyzing accessibility:', error);
                setAccessibilityData(null);
            } finally {
                setIsAnalyzing(false);
            }
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [palette, colorCombinations, accessibilitySettings.checkContrast]);

    // Check a specific color combination
    const checkColorCombination = useCallback((foreground, background, isLargeText = false) => {
        if (!foreground || !background) return null;

        try {
            const contrast = AccessibilityUtils.getContrastRatio(foreground, background);
            const wcagLevel = AccessibilityUtils.getWCAGLevel(foreground, background, isLargeText);
            const meetsAA = AccessibilityUtils.meetsWCAG_AA(foreground, background, isLargeText);
            const meetsAAA = AccessibilityUtils.meetsWCAG_AAA(foreground, background, isLargeText);

            return {
                contrast,
                wcagLevel,
                meetsAA,
                meetsAAA,
                passed: meetsAA,
                foreground,
                background,
                isLargeText
            };
        } catch (error) {
            console.error('Error checking color combination:', error);
            return null;
        }
    }, []);

    // Get accessibility recommendations for a color combination
    const getRecommendations = useCallback((foreground, background, isLargeText = false) => {
        if (!foreground || !background) return null;

        try {
            return AccessibilityUtils.getAccessibilityRecommendations(
                foreground,
                background,
                isLargeText
            );
        } catch (error) {
            console.error('Error getting recommendations:', error);
            return null;
        }
    }, []);

    // Generate accessible variations of a color
    const generateAccessibleVariations = useCallback((color, backgroundColor) => {
        if (!color || !backgroundColor) return [];

        try {
            return AccessibilityUtils.generateAccessibleVariations(color, backgroundColor);
        } catch (error) {
            console.error('Error generating accessible variations:', error);
            return [];
        }
    }, []);

    // Check color blindness compatibility
    const checkColorBlindness = useCallback((color1, color2) => {
        if (!color1 || !color2) return null;

        try {
            return AccessibilityUtils.checkColorBlindnessCompatibility(color1, color2);
        } catch (error) {
            console.error('Error checking color blindness compatibility:', error);
            return null;
        }
    }, []);

    // Get overall accessibility status
    const accessibilityStatus = useMemo(() => {
        if (!accessibilityData) {
            return {
                level: 'unknown',
                score: 0,
                message: 'Accessibility not analyzed'
            };
        }

        const { score, passed, total } = accessibilityData;

        if (score >= 90) {
            return {
                level: 'excellent',
                score,
                message: `Excellent accessibility (${passed}/${total} checks passed)`,
                color: 'green'
            };
        } else if (score >= 70) {
            return {
                level: 'good',
                score,
                message: `Good accessibility (${passed}/${total} checks passed)`,
                color: 'yellow'
            };
        } else if (score >= 50) {
            return {
                level: 'fair',
                score,
                message: `Fair accessibility (${passed}/${total} checks passed)`,
                color: 'orange'
            };
        } else {
            return {
                level: 'poor',
                score,
                message: `Poor accessibility (${passed}/${total} checks passed)`,
                color: 'red'
            };
        }
    }, [accessibilityData]);

    // Get high priority issues
    const criticalIssues = useMemo(() => {
        if (!accessibilityData) return [];

        return accessibilityData.combinations
            .filter(combo => !combo.passed && combo.priority === 'high')
            .map(combo => ({
                ...combo,
                issue: `${combo.name} has insufficient contrast (${combo.contrast.toFixed(2)}:1)`,
                severity: 'critical'
            }));
    }, [accessibilityData]);

    // Get warnings (medium priority issues)
    const warnings = useMemo(() => {
        if (!accessibilityData) return [];

        return accessibilityData.combinations
            .filter(combo => !combo.passed && combo.priority === 'medium')
            .map(combo => ({
                ...combo,
                issue: `${combo.name} has insufficient contrast (${combo.contrast.toFixed(2)}:1)`,
                severity: 'warning'
            }));
    }, [accessibilityData]);

    // Check if palette meets minimum standards
    const meetsMinimumStandards = useMemo(() => {
        if (!accessibilityData) return false;

        const highPriorityCombinations = accessibilityData.combinations.filter(
            combo => combo.priority === 'high'
        );

        return highPriorityCombinations.every(combo => combo.passed);
    }, [accessibilityData]);

    // Get detailed breakdown by WCAG level
    const wcagBreakdown = useMemo(() => {
        if (!accessibilityData) return { AA: 0, AAA: 0, fail: 0 };

        const breakdown = { AA: 0, AAA: 0, fail: 0 };

        accessibilityData.combinations.forEach(combo => {
            if (combo.meetsAAA) {
                breakdown.AAA++;
            } else if (combo.meetsAA) {
                breakdown.AA++;
            } else {
                breakdown.fail++;
            }
        });

        return breakdown;
    }, [accessibilityData]);

    // Helper functions for direct use in components
    const checkContrast = useCallback((color1, color2) => {
        return AccessibilityUtils.getContrastRatio(color1, color2);
    }, []);

    const getWcagLevel = useCallback((color1, color2, isLargeText = false) => {
        return AccessibilityUtils.getWCAGLevel(color1, color2, isLargeText);
    }, []);

    const analyzeColorPalette = useCallback((colors) => {
        if (!colors || colors.length < 2) {
            return {
                score: 0,
                level: 'insufficient',
                issues: ['Need at least 2 colors for analysis'],
                recommendations: []
            };
        }

        const issues = [];
        const recommendations = [];
        let totalPairs = 0;
        let passingPairs = 0;

        for (let i = 0; i < colors.length; i++) {
            for (let j = i + 1; j < colors.length; j++) {
                totalPairs++;
                const contrast = AccessibilityUtils.getContrastRatio(colors[i], colors[j]);

                if (contrast >= 4.5) {
                    passingPairs++;
                } else {
                    issues.push(`Low contrast between ${colors[i]} and ${colors[j]} (${contrast.toFixed(2)}:1)`);
                    recommendations.push(`Adjust ${colors[i]} or ${colors[j]} to achieve at least 4.5:1 contrast`);
                }
            }
        }

        const score = totalPairs > 0 ? (passingPairs / totalPairs) * 100 : 0;

        let level = 'excellent';
        if (score < 50) level = 'poor';
        else if (score < 70) level = 'fair';
        else if (score < 90) level = 'good';

        return { score, level, issues, recommendations, totalPairs, passingPairs };
    }, []);

    const getLuminanceRatio = useCallback((color1, color2) => {
        return AccessibilityUtils.getContrastRatio(color1, color2);
    }, []);

    const checkColorBlindnessCompliance = useCallback((colors) => {
        const issues = [];
        const recommendations = [];

        for (let i = 0; i < colors.length; i++) {
            for (let j = i + 1; j < colors.length; j++) {
                const contrast = AccessibilityUtils.getContrastRatio(colors[i], colors[j]);
                if (contrast < 3.0) {
                    issues.push(`Colors ${colors[i]} and ${colors[j]} may be hard to distinguish`);
                    recommendations.push(`Increase contrast between ${colors[i]} and ${colors[j]}`);
                }
            }
        }

        return {
            hasIssues: issues.length > 0,
            issues,
            recommendations,
            compliance: issues.length === 0 ? 'excellent' : 'poor'
        };
    }, []);

    return {
        // Analysis results
        accessibilityData,
        accessibilityStatus,
        criticalIssues,
        warnings,
        wcagBreakdown,
        meetsMinimumStandards,

        // State
        isAnalyzing,

        // Utility functions
        checkColorCombination,
        getRecommendations,
        generateAccessibleVariations,
        checkColorBlindness,
        checkContrast,
        getWcagLevel,
        analyzeColorPalette,
        getLuminanceRatio,
        checkColorBlindnessCompliance,

        // Settings
        isEnabled: accessibilitySettings.checkContrast
    };
};
