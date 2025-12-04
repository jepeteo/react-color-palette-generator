import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDarkMode: false,
  theme: 'default',
  accessibility: {
    checkContrast: true,
    minimumRatio: 4.5,
    enableColorBlindnessCheck: false,
    showAccessibilityWarnings: true,
  },
  export: {
    defaultFormat: 'css',
    includeMetadata: true,
    useVariableNames: true,
    cssPrefix: '--color',
  },
  ui: {
    showAdvancedControls: false,
    enableAnimations: true,
    compactMode: false,
    autoSave: true,
  },
  keyboard: {
    enableShortcuts: true,
    shortcuts: {
      undo: 'ctrl+z',
      redo: 'ctrl+y',
      randomize: 'ctrl+r',
      export: 'ctrl+e',
      save: 'ctrl+s',
    },
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
    },

    setTheme: (state, action) => {
      state.theme = action.payload;
    },

    updateAccessibilitySettings: (state, action) => {
      state.accessibility = {
        ...state.accessibility,
        ...action.payload,
      };
    },

    updateExportSettings: (state, action) => {
      state.export = {
        ...state.export,
        ...action.payload,
      };
    },

    updateUISettings: (state, action) => {
      state.ui = {
        ...state.ui,
        ...action.payload,
      };
    },

    updateKeyboardSettings: (state, action) => {
      state.keyboard = {
        ...state.keyboard,
        ...action.payload,
      };
    },

    updateShortcut: (state, action) => {
      const { action: actionName, shortcut } = action.payload;
      state.keyboard.shortcuts[actionName] = shortcut;
    },

    resetSettings: (_state) => initialState,

    importSettings: (state, action) => {
      const { settings } = action.payload;

      // Validate and merge imported settings
      Object.keys(initialState).forEach((key) => {
        if (
          settings[key] &&
          typeof settings[key] === typeof initialState[key]
        ) {
          state[key] = {
            ...state[key],
            ...settings[key],
          };
        }
      });
    },
  },
});

// Selectors
export const selectIsDarkMode = (state) => state.settings.isDarkMode;
export const selectTheme = (state) => state.settings.theme;
export const selectAccessibilitySettings = (state) =>
  state.settings.accessibility;
export const selectExportSettings = (state) => state.settings.export;
export const selectUISettings = (state) => state.settings.ui;
export const selectKeyboardSettings = (state) => state.settings.keyboard;
export const selectShortcuts = (state) => state.settings.keyboard.shortcuts;
export const selectEnableAnimations = (state) =>
  state.settings.ui.enableAnimations;

export const {
  setDarkMode,
  setTheme,
  updateAccessibilitySettings,
  updateExportSettings,
  updateUISettings,
  updateKeyboardSettings,
  updateShortcut,
  resetSettings,
  importSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
