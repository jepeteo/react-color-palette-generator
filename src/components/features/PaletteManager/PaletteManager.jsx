import React, { useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import ColorPicker from '../../ui/ColorPicker';
import { ColorUtils } from '../../../utils/colorUtils';
import { useColorPalette } from '../../../hooks/useColorPalette';
import {
  selectPalette,
  selectPrimaryColor,
  selectLockedColors,
  updateColorInPalette,
  toggleColorLock,
  removeColorFromPalette,
  reorderColors,
  duplicateColor,
  undo,
  redo,
  selectCanUndo,
  selectCanRedo,
} from '../../../store/slices/paletteSlice';
import {
  addNotification,
  setSelectedColor,
  selectSelectedColor,
  setShowColorPicker,
} from '../../../store/slices/uiSlice';

/**
 * Advanced PaletteManager component with locking, reordering, and editing
 */
function PaletteManager() {
  const dispatch = useDispatch();

  const palette = useSelector(selectPalette);
    const primaryColor = useSelector(selectPrimaryColor);
    const lockedColors = useSelector(selectLockedColors);
    const selectedColor = useSelector(selectSelectedColor);
    const canUndo = useSelector(selectCanUndo);
    const canRedo = useSelector(selectCanRedo);

  const { generatePalette } = useColorPalette();

  const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [showAdvanced, setShowAdvanced] = useState(false);

  // Get color information
    const getColorInfo = useCallback((color) => {
        try {
            const hsl = ColorUtils.hexToHsl(color);
            const rgb = ColorUtils.hexToRgb(color);
            const luminance = ColorUtils.getLuminance(color);

      return {
        hex: color,
        hsl: `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`,
                rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
                luminance: luminance.toFixed(3),
                isLight: ColorUtils.isLightColor(color),
                textColor: ColorUtils.getContrastColor(color),
            };
        } catch (error) {
            console.error('Error getting color info:', error);
            return {
                hex: color,
                hsl: 'Invalid',
                rgb: 'Invalid',
                luminance: '0',
                isLight: false,
        textColor: '#ffffff',
      };
        }
    }, []);

  // Handle color edit
  const handleColorEdit = useCallback(
    (index, newColor) => {
    dispatch(updateColorInPalette({ index, color: newColor }));
        dispatch(addNotification({
          type: 'success',
      message: `Updated color ${index + 1}`,
          duration: 2000,
    }),
    setEditingIndex(null);
    },
    [dispatch],
  );

  // Handle color lock toggle
  const handleLockToggle = useCallback(
    (index) => {
    dispatch(toggleColorLock(index));
      const isLocked = lockedColors.includes(index);
    dispatch(addNotification({
            type: 'info',
            message: `Color ${index + 1} ${isLocked ? 'unlocked' : 'locked'}`,
            duration: 2000,
        }),
      );
  },
    [dispatch, lockedColors],
  );

  // Handle color removal
    const handleColorRemove = useCallback((index) => {
        if (palette.colors.length <= 2) {
            dispatch(addNotification({
                type: 'warning',
                message: 'Cannot remove color - minimum 2 colors required',
                duration: 3000,
            }));
        );
        return;
    }

    dispatch(removeColorFromPalette(index));
        dispatch(addNotification({
            type: 'success',
          message: `Removed color ${index + 1}`,
      duration: 2000,
        }),
      );
  },
    [dispatch, palette.colors.length],
  );

  // Handle color duplication
    const handleColorDuplicate = useCallback((index) => {
        const color = palette.colors[index];
      dispatch(duplicateColor({ index, color }));
    dispatch(addNotification({
            type: 'success',
            message: `Duplicated color ${index + 1}`,
            duration: 2000,
        }),
      );
  },
    [dispatch, palette.colors],
  );

  // Handle drag start
    const handleDragStart = useCallback((e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
    }, []);

  // Handle drag over
    const handleDragOver = useCallback((e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  }, []);

  // Handle drop
  const handleDrop = useCallback(
    (e, dropIndex) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            setDragOverIndex(null);
            return;
        }

    dispatch(reorderColors({ fromIndex: draggedIndex, toIndex: dropIndex }));
        dispatch(addNotification({
            type: 'success',
            message: `Moved color ${draggedIndex + 1} to position ${dropIndex + 1}`,
            duration: 2000,
        }),
      );

    setDraggedIndex(null);
        setDragOverIndex(null);
    },
    [dispatch, draggedIndex],
  );

  // Copy color to clipboard
    const copyColor = useCallback(async (color, format = 'hex') => {
        try {
            const colorInfo = getColorInfo(color);
            const colorValue = colorInfo[format] || color;

      await navigator.clipboard.writeText(colorValue);
            dispatch(addNotification({
            type: 'success',
        message: `Copied ${colorValue}`,
                duration: 2000,
            }));
        } catch (error) {
            console.error('Failed to copy color:', error);
        }
    },
    [dispatch, getColorInfo],
  );

  // Generate similar shades
    const generateShades = useCallback((baseColor) => {
        try {
            const shades = ColorUtils.generateShades(baseColor, 5);
            return shades;
    } catch (error) {
      console.error('Error generating shades:', error);
            return [baseColor];
        }
    }, []);

  // Bulk operations
    const handleBulkOperation = useCallback((operation) => {
        switch (operation) {
            case 'shuffle':
                // Shuffle unlocked colors only
                const unlockedIndices = palette.colors
                    .map((_, index) => index)
                    .filter((index) => !lockedColors.includes(index));

        if (unlockedIndices.length > 1) {
                    // Simple shuffle implementation
                    for (let i = unlockedIndices.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        const fromIndex = unlockedIndices[i];
                        const toIndex = unlockedIndices[j];
                        dispatch(reorderColors({ fromIndex, toIndex }));
                    }

          dispatch(addNotification({
                        type: 'success',
                        message: 'Shuffled unlocked colors',
                        duration: 2000,
                    }));
            );
          }
          break;

      case 'sort-hue':
          // Sort by hue
        const sortedByHue = palette.colors
                    .map((color, index) => ({ color, index, hue: ColorUtils.hexToHsl(color).h }))
            }))
            .filter((item) => !lockedColors.includes(item.index))
          .sort((a, b) => a.hue - b.hue);

        sortedByHue.forEach((item, newIndex) => {
                    if (item.index !== newIndex) {
              dispatch(
                reorderColors({ fromIndex: item.index, toIndex: newIndex }),
          }
                });

        dispatch(addNotification({
                    type: 'success',
                    message: 'Sorted colors by hue',
                    duration: 2000,
                }));
                break;

      case 'sort-lightness':
                // Sort by lightness
                const sortedByLightness = palette.colors
                    .map((color, index) => ({ color, index, lightness: ColorUtils.hexToHsl(color).l }))
            }))
            .filter((item) => !lockedColors.includes(item.index))
          .sort((a, b) => a.lightness - b.lightness);

        sortedByLightness.forEach((item, newIndex) => {
                    if (item.index !== newIndex) {
              dispatch(
                reorderColors({ fromIndex: item.index, toIndex: newIndex }),
          }
                });

        dispatch(addNotification({
                    type: 'success',
                    message: 'Sorted colors by lightness',
                    duration: 2000,
                }));
                break;

      default:
                break;
      }
  },
    [dispatch, palette.colors, lockedColors],
  );

  return (
        <Card
            title="Palette Manager"
            subtitle="Edit, lock, and organize your color palette"
        >
            <div className="space-y-4">
                {/* Palette History Controls */}
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        <Button
                            onClick={() => dispatch(undo())}
                            disabled={!canUndo}
                            size="sm"
                            variant="outline"
              icon={<span>↶</span>}
            >
              Undo
            </Button>
                      <Button
                            onClick={() => dispatch(redo())}
                            disabled={!canRedo}
                            size="sm"
              variant="outline"
                          icon={<span>↷</span>}
                        >
                            Redo
                        </Button>
                    </div>

                  <Button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        size="sm"
                        variant="outline"
                        icon={<span>⚙️</span>}
                    >
                        {showAdvanced ? 'Basic' : 'Advanced'}
                    </Button>
                </div>

              {/* Color Grid */}
                <div className="grid grid-cols-1 gap-3">
                    {palette.colors?.map((color, index) => {
                        const colorInfo = getColorInfo(color);
                        const isLocked = lockedColors.includes(index);
                        const isDragging = draggedIndex === index;
                        const isDragTarget = dragOverIndex === index;
                        const isEditing = editingIndex === index;

                      return (
                            <div
                                key={`${color}-${index}`}
                                className={`relative group border border-white/20 rounded-lg overflow-hidden transition-all duration-200 ${isDragging ? 'opacity-50 scale-95' : ''
                                    } ${isDragTarget ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                                    }`}
                                draggable={!isLocked}
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDrop={(e) => handleDrop(e, index)}
                            >
                                <div
                                    className="h-16 cursor-move flex items-center justify-center relative"
                                    style={{ backgroundColor: color }}
                                >
                                    {/* Lock Indicator */}
                                    {isLocked && (
                                        <div className="absolute top-2 left-2 text-white/80 text-sm">
                                            🔒
                                        </div>
                  )}

                                  {/* Primary Indicator */}
                                    {index === 0 && (
                                        <div className="absolute top-2 right-2 bg-black/30 backdrop-blur-sm rounded px-2 py-1">
                                            <span className="text-xs text-white font-medium">Primary</span>
                        Primary
                      </span>
                    </div>
                                  {/* Color Value */}
                                    <div className="text-center">
                                        <div
                                            className="font-mono text-sm font-medium"
                                            style={{ color: colorInfo.textColor }}
                                        >
                      {color.toUpperCase()}
                    </div>
                                      {showAdvanced && (
                                            <div
                                                className="text-xs opacity-80"
                                                style={{ color: colorInfo.textColor }}
                                            >
                                                L: 
{' '}
{Math.round(ColorUtils.hexToHsl(color).l)}%
                                            </div>
                                        )}
                                    </div>
                                </div>

                              {/* Controls */}
                                <div className="p-2 bg-white/5 backdrop-blur-sm">
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-1">
                                            {/* Edit Button */}
                                            <button
                        onClick={() =>
                          setEditingIndex(isEditing ? null : index)
                                              className="p-1 rounded hover:bg-white/10 transition-colors text-white/60 hover:text-white/90"
                                                title="Edit color"
                                            >
                                                ✏️
                                            </button>

                                          {/* Lock Button */}
                                            <button
                                                onClick={() => handleLockToggle(index)}
                                                className="p-1 rounded hover:bg-white/10 transition-colors text-white/60 hover:text-white/90"
                                                title={isLocked ? 'Unlock color' : 'Lock color'}
                                            >
                                                {isLocked ? '🔒' : '🔓'}
                                            </button>

                                          {/* Copy Button */}
                                            <button
                                                onClick={() => copyColor(color)}
                                                className="p-1 rounded hover:bg-white/10 transition-colors text-white/60 hover:text-white/90"
                                                title="Copy hex value"
                                            >
                                                📋
                                            </button>
                    </div>

                                      <div className="flex gap-1">
                                            {/* Duplicate Button */}
                                            <button
                                                onClick={() => handleColorDuplicate(index)}
                                                className="p-1 rounded hover:bg-white/10 transition-colors text-white/60 hover:text-white/90"
                                                title="Duplicate color"
                                            >
                                                📄
                                            </button>

                                          {/* Remove Button */}
                                            <button
                                                onClick={() => handleColorRemove(index)}
                                                className="p-1 rounded hover:bg-red-500/20 transition-colors text-white/60 hover:text-red-400"
                                                title="Remove color"
                                                disabled={palette.colors.length <= 2}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>

                                  {/* Color Picker */}
                                    {isEditing && (
                                        <div className="mt-2 p-2 bg-white/10 rounded">
                                            <ColorPicker
                                                color={color}
                        onChange={(newColor) =>
                          handleColorEdit(index, newColor)
                                              showPresets={false}
                                            />
                                        </div>
                                    )}

                                  {/* Advanced Info */}
                                    {showAdvanced && (
                                        <div className="mt-2 text-xs text-white/60 space-y-1">
                                            <div>
RGB:{colorInfo.rgb}</div>
                                            <div>
HSL:{colorInfo.hsl}</div>
                                            <div>
Luminance:{colorInfo.luminance}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
          })}
        </div>

              {/* Bulk Operations */}
                {showAdvanced && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-white/90">Bulk Operations</h4>
            </h4>
            <div className="grid grid-cols-3 gap-2">
                          <Button
                                onClick={() => handleBulkOperation('shuffle')}
                                size="sm"
                                variant="outline"
                                icon={<span>🔀</span>}
                            >
                                Shuffle
                            </Button>
                            <Button
                                onClick={() => handleBulkOperation('sort-hue')}
                                size="sm"
                                variant="outline"
                                icon={<span>🌈</span>}
                            >
                                Sort by Hue
                            </Button>
                            <Button
                                onClick={() => handleBulkOperation('sort-lightness')}
                                size="sm"
                                variant="outline"
                                icon={<span>💡</span>}
                            >
                                Sort by Light
                            </Button>
            </div>
          </div>
        )}

              {/* Quick Actions */}
                <div className="flex gap-2 flex-wrap">
                    <Button
                        onClick={() => generatePalette(primaryColor)}
                        size="sm"
                        variant="primary"
            icon={<span>🎲</span>}
          >
            Regenerate
          </Button>
                  <Button
                        onClick={() => copyColor(palette.colors.join(', '), 'hex')}
                        size="sm"
                        variant="outline"
                        icon={<span>📋</span>}
                    >
                        Copy All
                    </Button>
                </div>

              {/* Usage Tips */}
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <h5 className="text-sm font-medium text-green-400 mb-1">💡 Manager Tips</h5>
          </h5>
          <ul className="space-y-1 text-xs text-green-300/80">
                      <li>• Drag colors to reorder (unlock first if locked)</li>
                        <li>• Lock colors to prevent changes during regeneration</li>
                        <li>• Use advanced mode for detailed color information</li>
                        <li>• Minimum 2 colors required for a valid palette</li>
                    </ul>
                </div>
            </div>
        </Card>
    );
}

export default PaletteManager;
