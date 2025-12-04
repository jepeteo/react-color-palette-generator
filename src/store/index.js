import { configureStore } from '@reduxjs/toolkit';
import { enableMapSet } from 'immer';
import paletteReducer from './slices/paletteSlice';
import settingsReducer from './slices/settingsSlice';
import uiReducer from './slices/uiSlice';

// Enable MapSet plugin for Immer to handle Set objects
enableMapSet();

// Load persisted state from localStorage
const loadPersistedState = () => {
  try {
    const serializedState = localStorage.getItem('colorPaletteGenerator');
    if (serializedState === null) {
      return undefined;
    }
    const persistedState = JSON.parse(serializedState);

    // Convert lockedColors back to Set
    if (persistedState.palette && persistedState.palette.lockedColors) {
      persistedState.palette.lockedColors = new Set(
        persistedState.palette.lockedColors,
      );
    }

    return persistedState;
  } catch (err) {
    console.warn('Error loading persisted state:', err);
    return undefined;
  }
};

// Save state to localStorage
const saveState = (state) => {
  try {
    const stateToSave = {
      ...state,
      palette: {
        ...state.palette,
        // Convert Set to Array for JSON serialization
        lockedColors: Array.from(state.palette.lockedColors),
      },
    };

    const serializedState = JSON.stringify(stateToSave);
    localStorage.setItem('colorPaletteGenerator', serializedState);
  } catch (err) {
    console.warn('Error saving state:', err);
  }
};

// Middleware to persist state changes
const persistenceMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // Only persist certain actions to avoid excessive localStorage writes
  const persistedActions = [
    'palette/setPalette',
    'palette/setBaseColor',
    'palette/setHarmony',
    'palette/updatePaletteColor',
    'palette/toggleColorLock',
    'settings/setDarkMode',
    'settings/setTheme',
    'settings/updateAccessibilitySettings',
    'settings/updateExportSettings',
    'settings/updateUISettings',
    'settings/updateKeyboardSettings',
  ];

  if (
    persistedActions.some((actionType) =>
      action.type.includes(actionType.split('/')[1]),
    )
  ) {
    saveState(store.getState());
  }

  return result;
};

// Error handling middleware
const errorHandlingMiddleware = (store) => (next) => (action) => {
  try {
    return next(action);
  } catch (error) {
    console.error('Redux action error:', error);

    // Dispatch error to UI state
    store.dispatch({
      type: 'ui/setError',
      payload: {
        message: 'An unexpected error occurred',
        details: error.message,
      },
    });

    return { type: 'ERROR', error };
  }
};

// Development middleware for logging
const loggerMiddleware = (store) => (next) => (action) => {
  if (process.env.NODE_ENV === 'development') {
    const prevState = store.getState();
    const result = next(action);
    const nextState = store.getState();

    console.group(`Action: ${action.type}`);
    console.log('Previous State:', prevState);
    console.log('Action:', action);
    console.log('Next State:', nextState);
    console.groupEnd();

    return result;
  }

  return next(action);
};

// Configure the store
export const store = configureStore({
  reducer: {
    palette: paletteReducer,
    settings: settingsReducer,
    ui: uiReducer,
  },

  preloadedState: loadPersistedState(),

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for Set serialization
        ignoredActions: ['palette/toggleColorLock'],
        // Ignore these field paths in the state
        ignoredPaths: ['palette.lockedColors'],
      },
    }).concat(
      persistenceMiddleware,
      errorHandlingMiddleware,
      ...(process.env.NODE_ENV === 'development' ? [loggerMiddleware] : []),
    ),

  devTools: process.env.NODE_ENV !== 'production' && {
    name: 'Color Palette Generator',
    trace: true,
    traceLimit: 25,
  },
});

// Export helper functions for type inference (for future TypeScript migration)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// Helper function to get the current state
export const getCurrentState = () => store.getState();

// Helper function to subscribe to store changes
export const subscribeToStore = (callback) => store.subscribe(callback);

// Action to initialize the app
export const initializeApp = () => (dispatch, getState) => {
  const state = getState();

  // Initialize with default palette if none exists
  if (
    !state.palette.palette ||
    Object.keys(state.palette.palette).length === 0
  ) {
    dispatch({ type: 'palette/resetPalette' });
  }

  // Set up any initial configurations
  dispatch({
    type: 'ui/addNotification',
    payload: {
      type: 'success',
      message: 'Color Palette Generator loaded successfully!',
      duration: 2000,
    },
  });
};

export default store;
