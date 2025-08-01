import { useCallback, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectPalette,
  selectBaseColor,
  selectHarmony,
  selectLockedColors,
  selectCanUndo,
  selectCanRedo,
  selectIsGenerating,
  setPalette,
  setBaseColor,
  setHarmony,
  setIsGenerating,
  updatePaletteColor,
  toggleColorLock,
  randomizePalette,
  undo,
  redo,
  resetPalette,
} from '../store/slices/paletteSlice';
import { selectIsDarkMode } from '../store/slices/settingsSlice';
import { ColorUtils } from '../utils/colorUtils';
import { PALETTE_ROLES } from '../utils/constants';

/**
 * Custom hook for color palette management
 * Provides comprehensive palette operations and state
 */
export const useColorPalette = () => {
  const dispatch = useDispatch();

  // Selectors
  const palette = useSelector(selectPalette);
  const baseColor = useSelector(selectBaseColor);
  const harmony = useSelector(selectHarmony);
  const lockedColors = useSelector(selectLockedColors);
  const canUndo = useSelector(selectCanUndo);
  const canRedo = useSelector(selectCanRedo);
  const isGenerating = useSelector(selectIsGenerating);
  const isDarkMode = useSelector(selectIsDarkMode);

  // Ensure isGenerating is reset on mount
  useEffect(() => {
    if (isGenerating) {
      dispatch(setIsGenerating(false));
    }
  }, []); // Only run on mount

  // Generate new palette with current settings
  const generatePalette = useCallback(
    (newBaseColor, newHarmony) => {
      const colorToUse = newBaseColor || baseColor;
      const harmonyToUse = newHarmony || harmony;

      dispatch(setIsGenerating(true));

      try {
        const newPalette = ColorUtils.generateHarmony(
          colorToUse,
          harmonyToUse,
          isDarkMode,
        );

        // Preserve locked colors
        const finalPalette = { ...newPalette };
        Object.keys(finalPalette).forEach((role) => {
          if (lockedColors.has(role) && palette[role]) {
            finalPalette[role] = palette[role];
          }
        });

        dispatch(setPalette(finalPalette));

        if (newBaseColor && newBaseColor !== baseColor) {
          dispatch(setBaseColor(newBaseColor));
        }

        if (newHarmony && newHarmony !== harmony) {
          dispatch(setHarmony(newHarmony));
        }
      } catch (error) {
        console.error('Error generating palette:', error);
      } finally {
        dispatch(setIsGenerating(false));
      }
    },
    [dispatch, palette, baseColor, harmony, lockedColors, isDarkMode],
  );

  // Update a specific color in the palette
  const updateColor = useCallback(
    (role, color) => {
      if (!ColorUtils.isValidColor(color)) {
        console.warn('Invalid color provided:', color);
        return;
      }

      dispatch(updatePaletteColor({ role, color }));
    },
    [dispatch],
  );

  // Lock/unlock a color
  const toggleLock = useCallback(
    (role) => {
      dispatch(toggleColorLock(role));
    },
    [dispatch],
  );

  // Check if a color is locked
  const isColorLocked = useCallback(
    (role) => lockedColors.has(role),
    [lockedColors],
  );

  // Randomize the palette
  const randomize = useCallback(
    (preserveLocked = true) => {
      dispatch(randomizePalette({ preserveLocked }));
    },
    [dispatch],
  );

  // Undo last change
  const undoChange = useCallback(() => {
    if (canUndo) {
      dispatch(undo());
    }
  }, [dispatch, canUndo]);

  // Redo last undone change
  const redoChange = useCallback(() => {
    if (canRedo) {
      dispatch(redo());
    }
  }, [dispatch, canRedo]);

  // Reset to default palette
  const reset = useCallback(() => {
    dispatch(resetPalette());
  }, [dispatch]);

  // Get color by role with fallback
  const getColor = useCallback(
    (role, fallback = '#000000') => palette[role] || fallback,
    [palette],
  );

  // Get all colors as an array for easy iteration
  const colorsArray = useMemo(
    () => Object.entries(palette).map(([role, color]) => ({
      role,
      color,
      locked: lockedColors.has(role),
      label: role.charAt(0).toUpperCase() + role.slice(1),
    })),
    [palette, lockedColors],
  );

  // Get primary colors only
  const primaryColors = useMemo(() => {
    const primaryRoles = [
      PALETTE_ROLES.PRIMARY,
      PALETTE_ROLES.SECONDARY,
      PALETTE_ROLES.ACCENT,
    ];

    return primaryRoles.map((role) => ({
      role,
      color: palette[role] || '#000000',
      locked: lockedColors.has(role),
      label: role.charAt(0).toUpperCase() + role.slice(1),
    }));
  }, [palette, lockedColors]);

  // Get semantic colors (text, background, etc.)
  const semanticColors = useMemo(() => {
    const semanticRoles = [
      PALETTE_ROLES.TEXT,
      PALETTE_ROLES.BACKGROUND,
      PALETTE_ROLES.SURFACE,
    ];

    return semanticRoles.map((role) => ({
      role,
      color: palette[role] || '#000000',
      locked: lockedColors.has(role),
      label: role.charAt(0).toUpperCase() + role.slice(1),
    }));
  }, [palette, lockedColors]);

  // Generate variations of the current palette
  const generateVariations = useCallback(
    (steps = 3) => {
      const variations = [];

      Object.entries(palette).forEach(([role, color]) => {
        if (!lockedColors.has(role)) {
          const { tints, shades } = ColorUtils.generateTintsAndShades(
            color,
            steps,
          );
          variations.push({
            role,
            baseColor: color,
            tints,
            shades,
          });
        }
      });

      return variations;
    },
    [palette, lockedColors],
  );

  // Export palette in different formats
  const exportPalette = useCallback(
    (format = 'object') => {
      switch (format) {
        case 'css':
          return Object.entries(palette)
            .map(([role, color]) => `--color-${role}: ${color};`)
            .join('\n');

        case 'scss':
          return Object.entries(palette)
            .map(([role, color]) => `$color-${role}: ${color};`)
            .join('\n');

        case 'json':
          return JSON.stringify(palette, null, 2);

        case 'array':
          return Object.values(palette);

        default:
          return palette;
      }
    },
    [palette],
  );

  return {
    // State
    palette,
    baseColor,
    harmony,
    lockedColors,
    canUndo,
    canRedo,
    isGenerating,

    // Computed values
    colorsArray,
    primaryColors,
    semanticColors,

    // Actions
    generatePalette,
    updateColor,
    toggleLock,
    isColorLocked,
    randomize,
    undoChange,
    redoChange,
    reset,

    // Utilities
    getColor,
    generateVariations,
    exportPalette,
  };
};
