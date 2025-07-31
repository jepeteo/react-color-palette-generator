import { createSlice } from '@reduxjs/toolkit';
import { ColorUtils } from '../../utils/colorUtils';
import { HARMONY_TYPES, PALETTE_ROLES } from '../../utils/constants';

const initialState = {
  palette: ColorUtils.getFallbackPalette(false),
    baseColor: '#336699',
  harmony: HARMONY_TYPES.TRIADIC,
  lockedColors: new Set(),
    history: [],
    historyIndex: -1,
    maxHistorySize: 50,
    isGenerating: false,
};

const paletteSlice = createSlice({
  name: 'palette',
    initialState,
    reducers: {
    setPalette: (state, action) => {
      state.palette = action.payload;

      // Add to history if it's different from current
      if (
        state.history.length === 0 ||
        JSON.stringify(state.palette) !==
          JSON.stringify(state.history[state.historyIndex])
        // Remove any future history if we're not at the end
                if (state.historyIndex < state.history.length - 1) {
                    state.history = state.history.slice(0, state.historyIndex + 1);
                }

        // Add new state to history
                state.history.push({ ...state.palette });
        state.historyIndex = state.history.length - 1;

        // Limit history size
                if (state.history.length > state.maxHistorySize) {
                    state.history = state.history.slice(-state.maxHistorySize);
                    state.historyIndex = state.history.length - 1;
                }
            }
        },

    setBaseColor: (state, action) => {
            state.baseColor = action.payload;
            // Regenerate palette with new base color
            state.palette = ColorUtils.generateHarmony(
                action.payload,
                state.harmony,
                false, // TODO: Get isDarkMode from settings
            );
        },

    setHarmony: (state, action) => {
            state.harmony = action.payload;
            // Regenerate palette with new harmony
            state.palette = ColorUtils.generateHarmony(
                state.baseColor,
                action.payload,
                false, // TODO: Get isDarkMode from settings
            );
        },

    updatePaletteColor: (state, action) => {
            const { role, color } = action.payload;

      // Only update if color is not locked
            if (!state.lockedColors.has(role)) {
                state.palette[role] = color;
            }
    },

    toggleColorLock: (state, action) => {
            const role = action.payload;
            const newLockedColors = new Set(state.lockedColors);

      if (newLockedColors.has(role)) {
                newLockedColors.delete(role);
            } else {
                newLockedColors.add(role);
            }

      state.lockedColors = newLockedColors;
        },

    randomizePalette: (state, action) => {
            const { preserveLocked = true } = action.payload || {};

      // Generate random base color if not locked
            if (!preserveLocked || !state.lockedColors.has(PALETTE_ROLES.PRIMARY)) {
                state.baseColor = ColorUtils.generateRandomColor();
            }

      // Generate new palette
            const newPalette = ColorUtils.generateHarmony(
                state.baseColor,
                state.harmony,
                false, // TODO: Get isDarkMode from settings
            );

      // Preserve locked colors
            if (preserveLocked) {
                Object.keys(newPalette).forEach((role) => {
                    if (state.lockedColors.has(role)) {
                        newPalette[role] = state.palette[role];
                    }
                });
            }

      state.palette = newPalette;
        },

    undo: (state) => {
            if (state.historyIndex > 0) {
                state.historyIndex -= 1;
                state.palette = { ...state.history[state.historyIndex] };
            }
        },

    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex += 1;
                state.palette = { ...state.history[state.historyIndex] };
            }
        },

    clearHistory: (state) => {
            state.history = [{ ...state.palette }];
            state.historyIndex = 0;
        },

    setIsGenerating: (state, action) => {
            state.isGenerating = action.payload;
        },

    resetPalette: (state) => {
            const defaultPalette = ColorUtils.getFallbackPalette(false);
            state.palette = defaultPalette;
            state.baseColor = defaultPalette[PALETTE_ROLES.PRIMARY];
            state.harmony = HARMONY_TYPES.TRIADIC;
            state.lockedColors = new Set();
            state.history = [defaultPalette];
            state.historyIndex = 0;
        },

    updateColorInPalette: (state, action) => {
      const { index, color, role } = action.payload;

      if (state.palette.colors && Array.isArray(state.palette.colors)) {
                // Array-based palette
                if (index >= 0 && index < state.palette.colors.length) {
                    state.palette.colors[index] = color;
                }
            } else if (role && state.palette[role]) {
                // Object-based palette
                state.palette[role] = color;
            }
        },

    removeColorFromPalette: (state, action) => {
            const { index, role } = action.payload;

      if (state.palette.colors && Array.isArray(state.palette.colors)) {
                // Array-based palette
                if (index >= 0 && index < state.palette.colors.length) {
                    state.palette.colors.splice(index, 1);
                }
            } else if (role && state.palette[role]) {
        // Object-based palette - set to empty or remove
        delete state.palette[role];
            }
        },

    reorderColors: (state, action) => {
            const { fromIndex, toIndex } = action.payload;

      if (state.palette.colors && Array.isArray(state.palette.colors)) {
                const colors = [...state.palette.colors];
                const [removed] = colors.splice(fromIndex, 1);
                colors.splice(toIndex, 0, removed);
                state.palette.colors = colors;
            }
        },

    duplicateColor: (state, action) => {
            const { index, color, role } = action.payload;

      if (state.palette.colors && Array.isArray(state.palette.colors)) {
                // Array-based palette
                if (index >= 0 && index < state.palette.colors.length) {
                    const colorToDuplicate = color || state.palette.colors[index];
                    state.palette.colors.splice(index + 1, 0, colorToDuplicate);
                }
            } else if (role && color) {
        // Object-based palette - find available role or create new entry
        const newRole = `${role}_copy`;
                state.palette[newRole] = color;
            }
        },
    }
});

// Selectors
export const selectPalette = (state) => state.palette.palette;
export const selectBaseColor = (state) => state.palette.baseColor;
export const selectPrimaryColor = (state) => state.palette.baseColor; // Alias for baseColor
export const selectHarmony = (state) => state.palette.harmony;
export const selectHarmonyType = (state) => state.palette.harmony; // Alias for harmony
export const selectLockedColors = (state) => state.palette.lockedColors;
export const selectCanUndo = (state) => state.palette.historyIndex > 0;
export const selectCanRedo = (state) =>
  state.palette.historyIndex < state.palette.history.length - 1;
export const selectIsGenerating = (state) => state.palette.isGenerating;
export const selectColorCount = (state) => {
  const {palette} = state.palette;
  if (!palette) return 0;
  if (palette.colors && Array.isArray(palette.colors)) {
    return palette.colors.length;
  }
    // Count non-empty color properties for object-based palettes
    return Object.values(palette).filter((color) => color && typeof color === 'string').length;
};

export const {
  setPalette,
  setBaseColor,
  setHarmony,
    updatePaletteColor,
    toggleColorLock,
    randomizePalette,
    undo,
    redo,
  clearHistory,
  setIsGenerating,
    resetPalette,
    updateColorInPalette,
    removeColorFromPalette,
  reorderColors,
  duplicateColor
} = paletteSlice.actions;

export default paletteSlice.reducer;
