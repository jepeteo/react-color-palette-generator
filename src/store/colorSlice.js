import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  primaryColor: '#369',
  harmony: 'default',
  palette: null,
  isDarkMode: false,
  uploadedImage: null,
  imageColors: null,
};

export const colorSlice = createSlice({
  name: 'color',
  initialState,
  reducers: {
    setPrimaryColor: (state, action) => {
      state.primaryColor = action.payload;
    },
    setHarmony: (state, action) => {
      state.harmony = action.payload;
    },
    setPalette: (state, action) => {
      state.palette = action.payload;
    },
    setIsDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
    },
    setUploadedImage: (state, action) => {
      state.uploadedImage = action.payload;
    },
    setImageColors: (state, action) => {
      state.imageColors = action.payload;
    },
  },
});

export const {
  setPrimaryColor,
  setHarmony,
  setPalette,
  setIsDarkMode,
  setUploadedImage,
  setImageColors,
} = colorSlice.actions;

export default colorSlice.reducer;
