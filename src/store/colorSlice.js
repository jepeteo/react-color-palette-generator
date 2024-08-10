import { createSlice } from '@reduxjs/toolkit';
import { generatePalette } from '../utils/colorUtils';

const initialState = {
  primaryColor: '#336699',
  harmony: 'default',
  palette: null,
  isDarkMode: false,
  uploadedImage: null,
  imageColors: null,
  colors: {
    paragraphText: '#FFFFFF',
    background: '#000000',
    headerText: '#FFFFFF',
    headerBackground: '#000000',
    navText: '#FFFFFF',
    navBackground: '#000000',
    heading1: '#FFFFFF',
    heading2: '#FFFFFF',
    linkText: '#FFFFFF',
    blockquoteText: '#FFFFFF',
    listText: '#FFFFFF',
    buttonText: '#FFFFFF',
    buttonBackground: '#000000',
    footerText: '#FFFFFF',
    footerBackground: '#000000',
    blockquoteBorder: '#000000',
    inputText: '#FFFFFF',
    inputBackground: '#000000',
    inputBorder: '#000000',
  },
};

export const colorSlice = createSlice({
  name: 'color',
  initialState,
  reducers: {
    setPrimaryColor: (state, action) => {
      state.primaryColor = action.payload;
      state.palette = generatePalette(
        action.payload,
        state.harmony,
        state.isDarkMode,
      );
      state.colors = updateColors(state.palette);
    },
    setHarmony: (state, action) => {
      state.harmony = action.payload;
      state.palette = generatePalette(
        state.primaryColor,
        action.payload,
        state.isDarkMode,
      );
      state.colors = updateColors(state.palette);
    },
    setPalette: (state, action) => {
      state.palette = action.payload;
      state.colors = updateColors(action.payload);
    },
    setIsDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
      state.palette = generatePalette(
        state.primaryColor,
        state.harmony,
        action.payload,
      );
      state.colors = updateColors(state.palette);
    },
    setUploadedImage: (state, action) => {
      state.uploadedImage = action.payload;
    },
    setImageColors: (state, action) => {
      state.imageColors = action.payload;
    },
    updatePaletteColor: (state, action) => {
      const { colorName, newValue } = action.payload;
      state.palette[colorName] = newValue;
    },
    updateElementColor: (state, action) => {
      const { element, color } = action.payload;
      state.colors[element] = color;
      console.log(action.payload, state);
    },
  },
});

function updateColors(palette) {
  return {
    paragraphText: palette.text,
    background: palette.background,
    headerText: palette.primary,
    headerBackground: palette.secondary,
    navText: palette.background,
    navBackground: palette.primary,
    heading1: palette.primary,
    heading2: palette.secondary,
    linkText: palette.accent,
    blockquoteText: palette.text,
    listText: palette.text,
    buttonText: palette.background,
    buttonBackground: palette.accent,
    footerText: palette.text,
    footerBackground: palette.primary,
    blockquoteBorder: palette.secondary,
    inputText: palette.text,
    inputBackground: palette.background,
    inputBorder: palette.secondary,
  };
}

export const {
  setPrimaryColor,
  setHarmony,
  setPalette,
  setIsDarkMode,
  setUploadedImage,
  setImageColors,
  updatePaletteColor,
  updateElementColor,
} = colorSlice.actions;

export default colorSlice.reducer;
