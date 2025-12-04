import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Modal states
  isLibraryOpen: false,
  isExportModalOpen: false,
  isSettingsModalOpen: false,
  isImageUploadModalOpen: false,
  isAccessibilityPanelOpen: true,
  showModal: false,

  // Selection states
  selectedElement: null,
  selectedPaletteRole: null,
  selectedColor: null,

  // Color picker states
  showColorPicker: false,

  // Upload states
  uploadedImage: null,
  imageExtractionProgress: 0,
  isExtractingColors: false,

  // Loading states
  isLoading: false,
  loadingMessage: '',

  // Error states
  error: null,
  errorDetails: null,

  // Toast/notification states
  notifications: [],

  // UI layout states
  sidebarCollapsed: false,
  previewMode: 'website', // 'website', 'cards', 'minimal'
  activeTab: 'generator', // 'generator', 'library', 'settings'

  // Search and filter states
  librarySearchQuery: '',
  libraryFilter: 'all', // 'all', 'recent', 'favorites'

  // Drag and drop states
  isDragging: false,
  draggedItem: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Modal actions
    openLibrary: (state) => {
      state.isLibraryOpen = true;
    },

    closeLibrary: (state) => {
      state.isLibraryOpen = false;
    },

    openExportModal: (state) => {
      state.isExportModalOpen = true;
    },

    closeExportModal: (state) => {
      state.isExportModalOpen = false;
    },

    openSettingsModal: (state) => {
      state.isSettingsModalOpen = true;
    },

    closeSettingsModal: (state) => {
      state.isSettingsModalOpen = false;
    },

    openImageUploadModal: (state) => {
      state.isImageUploadModalOpen = true;
    },

    closeImageUploadModal: (state) => {
      state.isImageUploadModalOpen = false;
    },

    toggleAccessibilityPanel: (state) => {
      state.isAccessibilityPanelOpen = !state.isAccessibilityPanelOpen;
    },

    setShowModal: (state, action) => {
      state.showModal = action.payload;
    },

    closeAllModals: (state) => {
      state.isLibraryOpen = false;
      state.isExportModalOpen = false;
      state.isSettingsModalOpen = false;
      state.isImageUploadModalOpen = false;
      state.showModal = false;
    },

    // Selection actions
    setSelectedElement: (state, action) => {
      state.selectedElement = action.payload;
    },

    setSelectedPaletteRole: (state, action) => {
      state.selectedPaletteRole = action.payload;
    },

    setSelectedColor: (state, action) => {
      state.selectedColor = action.payload;
    },

    setShowColorPicker: (state, action) => {
      state.showColorPicker = action.payload;
    },

    clearSelections: (state) => {
      state.selectedElement = null;
      state.selectedPaletteRole = null;
      state.selectedColor = null;
    },

    // Image upload actions
    setUploadedImage: (state, action) => {
      state.uploadedImage = action.payload;
    },

    setImageExtractionProgress: (state, action) => {
      state.imageExtractionProgress = action.payload;
    },

    setIsExtractingColors: (state, action) => {
      state.isExtractingColors = action.payload;
    },

    clearUploadedImage: (state) => {
      state.uploadedImage = null;
      state.imageExtractionProgress = 0;
      state.isExtractingColors = false;
    },

    // Loading actions
    setLoading: (state, action) => {
      state.isLoading = action.payload.isLoading;
      state.loadingMessage = action.payload.message || '';
    },

    // Error actions
    setError: (state, action) => {
      state.error = action.payload.message;
      state.errorDetails = action.payload.details || null;
    },

    clearError: (state) => {
      state.error = null;
      state.errorDetails = null;
    },

    // Notification actions
    addNotification: (state, action) => {
      const notification = {
        id: Date.now() + Math.random(),
        type: action.payload.type || 'info', // 'info', 'success', 'warning', 'error'
        message: action.payload.message,
        duration: action.payload.duration || 3000,
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },

    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload,
      );
    },

    clearAllNotifications: (state) => {
      state.notifications = [];
    },

    // Layout actions
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },

    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },

    setPreviewMode: (state, action) => {
      state.previewMode = action.payload;
    },

    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },

    // Search and filter actions
    setLibrarySearchQuery: (state, action) => {
      state.librarySearchQuery = action.payload;
    },

    setLibraryFilter: (state, action) => {
      state.libraryFilter = action.payload;
    },

    // Drag and drop actions
    setIsDragging: (state, action) => {
      state.isDragging = action.payload;
    },

    setDraggedItem: (state, action) => {
      state.draggedItem = action.payload;
    },

    clearDragState: (state) => {
      state.isDragging = false;
      state.draggedItem = null;
    },

    // Bulk actions
    resetUI: (state) => ({
      ...initialState,
      // Preserve some user preferences
      sidebarCollapsed: state.sidebarCollapsed,
      previewMode: state.previewMode,
      isAccessibilityPanelOpen: state.isAccessibilityPanelOpen,
    }),
  },
});

// Selectors
export const selectIsLibraryOpen = (state) => state.ui.isLibraryOpen;
export const selectIsExportModalOpen = (state) => state.ui.isExportModalOpen;
export const selectIsSettingsModalOpen = (state) =>
  state.ui.isSettingsModalOpen;
export const selectIsImageUploadModalOpen = (state) =>
  state.ui.isImageUploadModalOpen;
export const selectIsAccessibilityPanelOpen = (state) =>
  state.ui.isAccessibilityPanelOpen;
export const selectShowModal = (state) => state.ui.showModal;
export const selectSelectedElement = (state) => state.ui.selectedElement;
export const selectSelectedPaletteRole = (state) =>
  state.ui.selectedPaletteRole;
export const selectSelectedColor = (state) => state.ui.selectedColor;
export const selectShowColorPicker = (state) => state.ui.showColorPicker;
export const selectUploadedImage = (state) => state.ui.uploadedImage;
export const selectImageExtractionProgress = (state) =>
  state.ui.imageExtractionProgress;
export const selectIsExtractingColors = (state) => state.ui.isExtractingColors;
export const selectIsLoading = (state) => state.ui.isLoading;
export const selectLoadingMessage = (state) => state.ui.loadingMessage;
export const selectError = (state) => state.ui.error;
export const selectErrorDetails = (state) => state.ui.errorDetails;
export const selectNotifications = (state) => state.ui.notifications;
export const selectSidebarCollapsed = (state) => state.ui.sidebarCollapsed;
export const selectPreviewMode = (state) => state.ui.previewMode;
export const selectActiveTab = (state) => state.ui.activeTab;
export const selectLibrarySearchQuery = (state) => state.ui.librarySearchQuery;
export const selectLibraryFilter = (state) => state.ui.libraryFilter;
export const selectIsDragging = (state) => state.ui.isDragging;
export const selectDraggedItem = (state) => state.ui.draggedItem;

// Alias selectors for compatibility
export const dismissNotification = (id) => removeNotification(id);

export const {
  openLibrary,
  closeLibrary,
  openExportModal,
  closeExportModal,
  openSettingsModal,
  closeSettingsModal,
  openImageUploadModal,
  closeImageUploadModal,
  toggleAccessibilityPanel,
  setShowModal,
  closeAllModals,
  setSelectedElement,
  setSelectedPaletteRole,
  setSelectedColor,
  setShowColorPicker,
  clearSelections,
  setUploadedImage,
  setImageExtractionProgress,
  setIsExtractingColors,
  clearUploadedImage,
  setLoading,
  setError,
  clearError,
  addNotification,
  removeNotification,
  clearAllNotifications,
  toggleSidebar,
  setSidebarCollapsed,
  setPreviewMode,
  setActiveTab,
  setLibrarySearchQuery,
  setLibraryFilter,
  setIsDragging,
  setDraggedItem,
  clearDragState,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;
