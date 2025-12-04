import React, { useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { selectPalette } from '../../../store/slices/paletteSlice';
import { addNotification } from '../../../store/slices/uiSlice';

/**
 * Comprehensive AccessibilityChecker component for WCAG compliance analysis
 */
function AccessibilityChecker() {
  const dispatch = useDispatch();
  const palette = useSelector(selectPalette);

  const [selectedStandard, setSelectedStandard] = useState('WCAG_AA');
  const [colorBlindnessType, setColorBlindnessType] = useState('none');
  const [showColorBlindSimulation, setShowColorBlindSimulation] =
    useState(false);
  const [selectedTextSize, setSelectedTextSize] = useState('normal');

  // WCAG standards
  const wcagStandards = {
    WCAG_A: { name: 'WCAG A', normalRatio: 3.0, largeRatio: 3.0 },
    WCAG_AA: { name: 'WCAG AA', normalRatio: 4.5, largeRatio: 3.0 },
    WCAG_AAA: { name: 'WCAG AAA', normalRatio: 7.0, largeRatio: 4.5 },
  };

  // Color blindness simulation matrices
  const colorBlindnessMatrices = {
    protanopia: [
      [0.567, 0.433, 0],
      [0.558, 0.442, 0],
      [0, 0.242, 0.758],
    ],
    deuteranopia: [
      [0.625, 0.375, 0],
      [0.7, 0.3, 0],
      [0, 0.3, 0.7],
    ],
    tritanopia: [
      [0.95, 0.05, 0],
      [0, 0.433, 0.567],
      [0, 0.475, 0.525],
    ],
    achromatopsia: [
      [0.299, 0.587, 0.114],
      [0.299, 0.587, 0.114],
      [0.299, 0.587, 0.114],
    ],
  };

  // Calculate relative luminance
  const getRelativeLuminance = useCallback((hex) => {
    const rgb = hex.match(/\w\w/g).map((x) => parseInt(x, 16) / 255);
    const [r, g, b] = rgb.map((c) =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
    );
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }, []);

  // Calculate contrast ratio
  const getContrastRatio = useCallback(
    (color1, color2) => {
      const lum1 = getRelativeLuminance(color1);
      const lum2 = getRelativeLuminance(color2);
      const lighter = Math.max(lum1, lum2);
      const darker = Math.min(lum1, lum2);
      return (lighter + 0.05) / (darker + 0.05);
    },
    [getRelativeLuminance],
  );

  // Get contrast level for WCAG
  const getContrastLevel = useCallback(
    (ratio, isLargeText = false) => {
      const standard = wcagStandards[selectedStandard];
      const threshold = isLargeText
        ? standard.largeRatio
        : standard.normalRatio;

      if (ratio >= threshold) {
        return ratio >=
          wcagStandards.WCAG_AAA[isLargeText ? 'largeRatio' : 'normalRatio']
          ? 'excellent'
          : 'good';
      }
      return 'poor';
    },
    [selectedStandard],
  );

  // Apply color blindness simulation
  const simulateColorBlindness = useCallback((hex, type) => {
    if (type === 'none' || !colorBlindnessMatrices[type]) return hex;

    const rgb = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
    const matrix = colorBlindnessMatrices[type];

    const newRgb = [
      Math.round(
        matrix[0][0] * rgb[0] + matrix[0][1] * rgb[1] + matrix[0][2] * rgb[2],
      ),
      Math.round(
        matrix[1][0] * rgb[0] + matrix[1][1] * rgb[1] + matrix[1][2] * rgb[2],
      ),
      Math.round(
        matrix[2][0] * rgb[0] + matrix[2][1] * rgb[1] + matrix[2][2] * rgb[2],
      ),
    ].map((c) => Math.max(0, Math.min(255, c)));

    return `#${newRgb.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
  }, []);

  // Generate accessibility analysis
  const accessibilityAnalysis = useMemo(() => {
    if (!palette.colors || palette.colors.length === 0) {
      return {
        overall: 'No palette to analyze',
        combinations: [],
        issues: [],
        recommendations: [],
        score: 0,
        level: 'poor',
      };
    }

    const combinations = [];
    const issues = [];
    const recommendations = [];
    let totalScore = 0;
    let validCombinations = 0;

    // Analyze all color combinations
    for (let i = 0; i < palette.colors.length; i++) {
      for (let j = i + 1; j < palette.colors.length; j++) {
        const color1 = palette.colors[i];
        const color2 = palette.colors[j];
        const ratio = getContrastRatio(color1, color2);
        const normalLevel = getContrastLevel(ratio, false);
        const largeLevel = getContrastLevel(ratio, true);

        combinations.push({
          foreground: color1,
          background: color2,
          ratio: ratio.toFixed(2),
          normalText: normalLevel,
          largeText: largeLevel,
          isGood: normalLevel !== 'poor',
        });

        combinations.push({
          foreground: color2,
          background: color1,
          ratio: ratio.toFixed(2),
          normalText: normalLevel,
          largeText: largeLevel,
          isGood: normalLevel !== 'poor',
        });

        validCombinations += 2;
        totalScore +=
          normalLevel === 'excellent' ? 100 : normalLevel === 'good' ? 75 : 25;
      }
    }

    // Generate issues and recommendations
    const poorCombinations = combinations.filter(
      (c) => c.normalText === 'poor',
    );
    if (poorCombinations.length > 0) {
      issues.push(
        `${poorCombinations.length} color combinations fail WCAG standards`,
      );
      recommendations.push(
        'Consider adjusting colors to improve contrast ratios',
      );
    }

    const averageScore =
      validCombinations > 0 ? totalScore / validCombinations : 0;
    const level =
      averageScore >= 90 ? 'excellent' : averageScore >= 70 ? 'good' : 'poor';

    return {
      overall: `${combinations.filter((c) => c.isGood).length}/${combinations.length} combinations pass standards`,
      combinations: combinations.sort((a, b) => b.ratio - a.ratio),
      issues,
      recommendations,
      score: Math.round(averageScore),
      level,
    };
  }, [palette.colors, getContrastRatio, getContrastLevel]);

  // Auto-fix accessibility issues
  const autoFixAccessibility = useCallback(() => {
    // This would implement automatic fixes
    dispatch(
      addNotification({
        type: 'info',
        message: 'Auto-fix feature coming soon',
        details:
          'This will automatically adjust colors to meet accessibility standards',
        duration: 3000,
      }),
    );
  }, [dispatch]);

  // Export accessibility report
  const exportReport = useCallback(() => {
    const report = {
      palette: palette.colors,
      standard: selectedStandard,
      analysis: accessibilityAnalysis,
      timestamp: new Date().toISOString(),
      colorBlindnessSimulation: colorBlindnessType,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accessibility-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    dispatch(
      addNotification({
        type: 'success',
        message: 'Accessibility report exported',
        duration: 2000,
      }),
    );
  }, [
    accessibilityAnalysis,
    selectedStandard,
    palette.colors,
    colorBlindnessType,
    dispatch,
  ]);

  return (
    <Card
      title="Accessibility Checker"
      subtitle="Analyze color accessibility and WCAG compliance"
    >
      <div className="space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-white/90">
              WCAG Standard
            </label>
            <select
              value={selectedStandard}
              onChange={(e) => setSelectedStandard(e.target.value)}
              className="w-full rounded border border-white/20 bg-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              {Object.entries(wcagStandards).map(([key, standard]) => (
                <option key={key} value={key} className="bg-gray-800">
                  {standard.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/90">
              Color Blindness Simulation
            </label>
            <select
              value={colorBlindnessType}
              onChange={(e) => setColorBlindnessType(e.target.value)}
              className="w-full rounded border border-white/20 bg-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="none" className="bg-gray-800">
                None
              </option>
              <option value="protanopia" className="bg-gray-800">
                Protanopia (Red-blind)
              </option>
              <option value="deuteranopia" className="bg-gray-800">
                Deuteranopia (Green-blind)
              </option>
              <option value="tritanopia" className="bg-gray-800">
                Tritanopia (Blue-blind)
              </option>
              <option value="achromatopsia" className="bg-gray-800">
                Achromatopsia (Monochromacy)
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/90">
              Text Size
            </label>
            <select
              value={selectedTextSize}
              onChange={(e) => setSelectedTextSize(e.target.value)}
              className="w-full rounded border border-white/20 bg-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="normal" className="bg-gray-800">
                Normal (18px)
              </option>
              <option value="large" className="bg-gray-800">
                Large (24px+)
              </option>
            </select>
          </div>
        </div>

        {/* Overall Analysis */}
        {palette.colors && palette.colors.length > 0 && (
          <div className="rounded-lg border border-white/20 bg-white/5 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Overall Accessibility Score
              </h3>
              <div className="flex gap-2">
                <Button
                  onClick={autoFixAccessibility}
                  variant="outline"
                  size="sm"
                  icon={<span>🔧</span>}
                >
                  Auto-fix
                </Button>
                <Button
                  onClick={exportReport}
                  variant="outline"
                  size="sm"
                  icon={<span>📄</span>}
                >
                  Export Report
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="text-center">
                <div
                  className={`text-3xl font-bold ${
                    accessibilityAnalysis.level === 'excellent'
                      ? 'text-green-400'
                      : accessibilityAnalysis.level === 'good'
                        ? 'text-yellow-400'
                        : 'text-red-400'
                  }`}
                >
                  {accessibilityAnalysis.score}%
                </div>
                <div
                  className={`inline-block rounded-full px-3 py-1 text-sm ${
                    accessibilityAnalysis.level === 'excellent'
                      ? 'bg-green-500/20 text-green-400'
                      : accessibilityAnalysis.level === 'good'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {accessibilityAnalysis.level}
                </div>
              </div>

              <div>
                <div className="mb-1 text-sm text-white/60">Standard</div>
                <div className="font-medium text-white/90">
                  {wcagStandards[selectedStandard].name}
                </div>
                <div className="mt-1 text-xs text-white/60">
                  Normal: {wcagStandards[selectedStandard].normalRatio}:1 •
                  Large: {wcagStandards[selectedStandard].largeRatio}:1
                </div>
              </div>

              <div>
                <div className="mb-1 text-sm text-white/60">Combinations</div>
                <div className="font-medium text-white/90">
                  {accessibilityAnalysis.overall}
                </div>
              </div>
            </div>

            {accessibilityAnalysis.issues.length > 0 && (
              <div className="mt-4 rounded border border-red-500/20 bg-red-500/10 p-3">
                <h4 className="mb-2 font-medium text-red-400">Issues Found</h4>
                <ul className="space-y-1 text-sm text-red-300">
                  {accessibilityAnalysis.issues.map((issue, index) => (
                    <li key={index}>• {issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {accessibilityAnalysis.recommendations.length > 0 && (
              <div className="mt-4 rounded border border-blue-500/20 bg-blue-500/10 p-3">
                <h4 className="mb-2 font-medium text-blue-400">
                  Recommendations
                </h4>
                <ul className="space-y-1 text-sm text-blue-300">
                  {accessibilityAnalysis.recommendations.map((rec, index) => (
                    <li key={index}>• {rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Color Display with Simulation */}
        {palette.colors && palette.colors.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Color Palette{' '}
                {colorBlindnessType !== 'none' &&
                  `(${colorBlindnessType} simulation)`}
              </h3>
              <Button
                onClick={() =>
                  setShowColorBlindSimulation(!showColorBlindSimulation)
                }
                variant="outline"
                size="sm"
              >
                {showColorBlindSimulation ? 'Hide' : 'Show'} Simulation
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Original Colors */}
              <div>
                <h4 className="mb-3 text-sm font-medium text-white/90">
                  Original
                </h4>
                <div className="space-y-2">
                  {palette.colors.map((color, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className="h-12 w-16 rounded border border-white/20"
                        style={{ backgroundColor: color }}
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">
                          {color}
                        </div>
                        <div className="text-xs text-white/60">
                          Luminance: {getRelativeLuminance(color).toFixed(3)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Blind Simulation */}
              {showColorBlindSimulation && colorBlindnessType !== 'none' && (
                <div>
                  <h4 className="mb-3 text-sm font-medium text-white/90">
                    {colorBlindnessType} Simulation
                  </h4>
                  <div className="space-y-2">
                    {palette.colors.map((color, index) => {
                      const simulatedColor = simulateColorBlindness(
                        color,
                        colorBlindnessType,
                      );
                      return (
                        <div key={index} className="flex items-center gap-3">
                          <div
                            className="h-12 w-16 rounded border border-white/20"
                            style={{ backgroundColor: simulatedColor }}
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-white">
                              {simulatedColor}
                            </div>
                            <div className="text-xs text-white/60">
                              Original: {color}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contrast Matrix */}
        {accessibilityAnalysis.combinations.length > 0 && (
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">
              Contrast Analysis ({selectedTextSize} text)
            </h3>
            <div className="overflow-x-auto">
              <div className="grid gap-3">
                {accessibilityAnalysis.combinations
                  .slice(0, 10)
                  .map((combo, index) => (
                    <div
                      key={index}
                      className={`rounded border p-4 ${
                        combo.isGood
                          ? 'border-green-500/20 bg-green-500/5'
                          : 'border-red-500/20 bg-red-500/5'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-8 w-8 rounded border border-white/20"
                            style={{ backgroundColor: combo.foreground }}
                            title={`Foreground: ${combo.foreground}`}
                          />
                          <span className="text-white/60">on</span>
                          <div
                            className="h-8 w-8 rounded border border-white/20"
                            style={{ backgroundColor: combo.background }}
                            title={`Background: ${combo.background}`}
                          />
                        </div>

                        <div className="flex-1">
                          <div
                            className="rounded p-3 text-center font-medium"
                            style={{
                              backgroundColor: combo.background,
                              color: combo.foreground,
                              fontSize:
                                selectedTextSize === 'large' ? '24px' : '18px',
                            }}
                          >
                            Sample Text
                          </div>
                        </div>

                        <div className="text-right">
                          <div
                            className={`font-bold ${
                              combo.isGood ? 'text-green-400' : 'text-red-400'
                            }`}
                          >
                            {combo.ratio}:1
                          </div>
                          <div
                            className={`rounded px-2 py-1 text-xs ${
                              combo.normalText === 'excellent'
                                ? 'bg-green-500/20 text-green-400'
                                : combo.normalText === 'good'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {combo.normalText}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!palette.colors || palette.colors.length === 0) && (
          <div className="py-12 text-center text-white/60">
            <div className="mb-4 text-6xl">♿</div>
            <p className="mb-2 text-lg">No palette to analyze</p>
            <p>Generate a color palette to check its accessibility</p>
          </div>
        )}

        {/* Guidelines */}
        <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
          <h4 className="mb-3 font-medium text-blue-400">
            💡 Accessibility Guidelines
          </h4>
          <div className="grid grid-cols-1 gap-4 text-sm text-blue-300/80 md:grid-cols-2">
            <div>
              <h5 className="mb-2 font-medium text-blue-300">WCAG Standards</h5>
              <ul className="space-y-1">
                <li>• AA: Minimum recommended standard</li>
                <li>• AAA: Enhanced standard for better accessibility</li>
                <li>• Large text: 24px+ or 18px+ bold</li>
              </ul>
            </div>
            <div>
              <h5 className="mb-2 font-medium text-blue-300">
                Color Blindness
              </h5>
              <ul className="space-y-1">
                <li>• Affects ~8% of men, ~0.5% of women</li>
                <li>• Don't rely solely on color for information</li>
                <li>• Test with simulation tools</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default AccessibilityChecker;
