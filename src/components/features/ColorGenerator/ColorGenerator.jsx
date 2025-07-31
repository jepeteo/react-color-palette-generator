import React, { useState, useCallback } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import ColorPicker from '../../ui/ColorPicker';
import { useColorPalette } from '../../../hooks/useColorPalette';
import { HARMONY_TYPES, HARMONY_LABELS } from '../../../utils/constants';
import { ColorUtils } from '../../../utils/colorUtils';

/**
 * Enhanced ColorGenerator component with advanced controls
 */
function ColorGenerator() {
  const {
        palette,
        baseColor,
        harmony,
        generatePalette,
    randomize,
    canUndo,
        canRedo,
        undoChange,
        redoChange,
        reset,
        isGenerating,
    } = useColorPalette();

  const [advancedMode, setAdvancedMode] = useState(false);
    const [customHueRange, setCustomHueRange] = useState([0, 360]);
    const [saturationRange, setSaturationRange] = useState([0.3, 0.8]);
    const [lightnessRange, setLightnessRange] = useState([0.3, 0.7]);

  // Generate random color within specified ranges
  const generateRandomColor = useCallback(() => {
    const randomColor = ColorUtils.generateRandomColor(
      customHueRange,
      saturationRange,
            lightnessRange,
        );
        generatePalette(randomColor, harmony);
    }, [customHueRange, saturationRange, lightnessRange, harmony, generatePalette]);

  // Handle harmony change
  const handleHarmonyChange = useCallback(
    (newHarmony) => {
    generatePalette(baseColor, newHarmony);
    },
    [baseColor, generatePalette],
  );

  // Handle base color change
  const handleBaseColorChange = useCallback(
    (newColor) => {
    generatePalette(newColor, harmony);
    },
    [harmony, generatePalette],
  );

  // Generate complementary suggestions
  const generateSuggestions = useCallback(() => {
    const suggestions = [];
    const harmonies = [
      HARMONY_TYPES.COMPLEMENTARY,
            HARMONY_TYPES.TRIADIC,
            HARMONY_TYPES.ANALOGOUS,
            HARMONY_TYPES.SPLIT_COMPLEMENTARY,
        ];

    harmonies.forEach((harmonyType) => {
      if (harmonyType !== harmony) {
        const suggestedPalette = ColorUtils.generateHarmony(baseColor, harmonyType, false);
        );
        suggestions.push({
          harmony: harmonyType,
                    label: HARMONY_LABELS[harmonyType],
                    palette: suggestedPalette,
                    primaryColor: suggestedPalette.primary,
                });
            }
        });

    return suggestions;
    }, [baseColor, harmony]);

  const suggestions = generateSuggestions();

  const ActionButtons = () => (
        <div className="flex flex-wrap gap-2">
            <Button
                onClick={() => randomize(true)}
                variant="accent"
                size="sm"
        loading={isGenerating}
              icon={<span>🎲</span>}
            >
                Randomize
            </Button>

          <Button
                onClick={generateRandomColor}
                variant="secondary"
                size="sm"
                loading={isGenerating}
                icon={<span>🔀</span>}
            >
                Random Base
            </Button>

          <Button
                onClick={undoChange}
                disabled={!canUndo}
        variant="ghost"
              size="sm"
                icon={<span>↶</span>}
            >
                Undo
            </Button>

          <Button
                onClick={redoChange}
                disabled={!canRedo}
                variant="ghost"
                size="sm"
                icon={<span>↷</span>}
            >
                Redo
            </Button>

          <Button
                onClick={reset}
                variant="outline"
                size="sm"
                icon={<span>🔄</span>}
            >
                Reset
            </Button>
        </div>
    );

  return (
        <Card
            title="Color Generator"
            subtitle="Create harmonious color palettes"
            headerAction={(
                <Button
                    onClick={() => setAdvancedMode(!advancedMode)}
                    variant="ghost"
                    size="sm"
                >
                    {advancedMode ? 'Simple' : 'Advanced'}
                </Button>
              )}
        >
            <div className="space-y-6">
                {/* Base Color Selection */}
                <div>
                    <ColorPicker
            label="Base Color"
                      value={baseColor}
                        onChange={handleBaseColorChange}
                        showLockButton={false}
                        disabled={isGenerating}
                    />
                    <p className="text-xs text-white/60 mt-1">
                        This will be used as the foundation for generating harmonious colors
                    </p>
                </div>

              {/* Harmony Type Selection */}
                <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                        Color Harmony Type
                    </label>
                    <select
                        value={harmony}
                        onChange={(e) => handleHarmonyChange(e.target.value)}
                        disabled={isGenerating}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                    >
                        {Object.entries(HARMONY_TYPES).map(([key, value]) => (
              <option key={key} value={value} className="bg-gray-800">
                              {HARMONY_LABELS[value]}
                            </option>
            ))}
          </select>
                  <p className="text-xs text-white/60 mt-1">
                        Different harmony types create different color relationships
                    </p>
                </div>

              {/* Advanced Controls */}
                {advancedMode && (
                    <div className="space-y-4 p-4 bg-white/5 rounded-lg border border-white/10">
                        <h4 className="text-sm font-medium text-white/90">Advanced Settings</h4>

            </h4>

            {/* Hue Range */}
                      <div>
                            <label className="block text-xs font-medium text-white/80 mb-2">
                                Hue Range (
{customHueRange[0]}° - 
{' '}
{customHueRange[1]}°)
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="range"
                  min="0"
                                  max="360"
                                    value={customHueRange[0]}
                  onChange={(e) =>
                    setCustomHueRange([
                      parseInt(e.target.value),
                      customHueRange[1],
                    ])
                                  className="flex-1"
                                />
                                <input
                                    type="range"
                                    min="0"
                                    max="360"
                                    value={customHueRange[1]}
                  onChange={(e) =>
                    setCustomHueRange([
                      customHueRange[0],
                      parseInt(e.target.value),
                    ])
                                  className="flex-1"
                                />
                            </div>
                        </div>

            {/* Saturation Range */}
                      <div>
                            <label className="block text-xs font-medium text-white/80 mb-2">
                                Saturation Range (
{Math.round(saturationRange[0] * 100)}% - 
{' '}
{Math.round(saturationRange[1] * 100)}%)
                            </label>
              <div className="flex gap-2">
                              <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={saturationRange[0]}
                  onChange={(e) =>
                    setSaturationRange([
                      parseFloat(e.target.value),
                      saturationRange[1],
                    ])
                                  className="flex-1"
                                />
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={saturationRange[1]}
                  onChange={(e) =>
                    setSaturationRange([
                      saturationRange[0],
                      parseFloat(e.target.value),
                    ])
                                  className="flex-1"
                                />
                            </div>
                        </div>

            {/* Lightness Range */}
                      <div>
                            <label className="block text-xs font-medium text-white/80 mb-2">
                                Lightness Range (
{Math.round(lightnessRange[0] * 100)}% - 
{' '}
{Math.round(lightnessRange[1] * 100)}%)
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="range"
                                    min="0"
                  max="1"
                                  step="0.1"
                                    value={lightnessRange[0]}
                  onChange={(e) =>
                    setLightnessRange([
                      parseFloat(e.target.value),
                      lightnessRange[1],
                    ])
                                  className="flex-1"
                                />
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={lightnessRange[1]}
                  onChange={(e) =>
                    setLightnessRange([
                      lightnessRange[0],
                      parseFloat(e.target.value),
                    ])
                                  className="flex-1"
                                />
                            </div>
                        </div>
                    </div>
                )}

              {/* Action Buttons */}
                <ActionButtons />

              {/* Harmony Suggestions */}
                {suggestions.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-white/90">Try Different Harmonies</h4>
            </h4>
            <div className="grid grid-cols-2 gap-2">
                          {suggestions.map((suggestion) => (
                                <button
                                    key={suggestion.harmony}
                                    onClick={() => handleHarmonyChange(suggestion.harmony)}
                                    className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-200 text-left"
                                    disabled={isGenerating}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <div
                                            className="w-4 h-4 rounded"
                                            style={{ backgroundColor: suggestion.primaryColor }}
                                        />
                                        <span className="text-xs font-medium text-white/90">
                                            {suggestion.label}
                                        </span>
                                    </div>
                                    <div className="flex gap-1">
                                        {Object.values(suggestion.palette).slice(0, 4).map((color, index) => (
                                            <div
                        <div
                          key={index}
                                              className="w-3 h-3 rounded-sm"
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}

export default ColorGenerator;
