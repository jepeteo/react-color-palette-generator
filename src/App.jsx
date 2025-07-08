// src/App.js
import { useState, useEffect, Suspense, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setPrimaryColor,
  setHarmony,
  setPalette,
  setIsDarkMode,
  setUploadedImage,
  setImageColors,
} from './store/colorSlice';
import ColorInput from './components/ColorInput';
import Preview, {
  elements,
  getElementColor,
  handleElementClick,
} from './components/Preview';
import HarmonySelector from './components/HarmonySelector';
import ThemeToggle from './components/ThemeToggle';
import Footer from './components/Footer';
import {
  generatePalette,
  generateComplementaryPalette,
  generateTriadicPalette,
  generateAnalogousPalette,
  generateSplitComplementaryPalette,
  generateTetradicPalette,
  generateMonochromaticPalette,
  generateSquarePalette,
  generateDoubleSplitComplementaryPalette,
} from './utils/colorUtils';
import { extractColors } from 'extract-colors';
import './index.css';
import { current } from '@reduxjs/toolkit';

const PaletteManager = lazy(() => import('./components/PaletteManager'));
const ImageUpload = lazy(() => import('./components/ImageUpload'));
const ElementColorList = lazy(() => import('./components/ElementColorList'));
const Toolbar = lazy(() => import('./components/Toolbar'));

function App() {
  const dispatch = useDispatch();
  const primaryColor = useSelector((state) => state.color.primaryColor);
  const palette = useSelector((state) => state.color.palette);
  const harmony = useSelector((state) => state.color.harmony);
  const isDarkMode = useSelector((state) => state.color.isDarkMode);
  const uploadedImage = useSelector((state) => state.color.uploadedImage);
  const imageColors = useSelector((state) => state.color.imageColors);

  const handleReset = () => {
    dispatch(setPrimaryColor('#336699'));
    dispatch(setHarmony('default'));
    dispatch(setUploadedImage(null));
  };

  const handleImageUpload = async (imageData) => {
    dispatch(setUploadedImage(imageData));
    try {
      const colors = await extractColors(imageData);
      const primaryColor = colors[0].hex;
      dispatch(setPrimaryColor(primaryColor));
    } catch (error) {
      console.error('Error extracting colors:', error);
    }
  };

  useEffect(() => {
    let newPalette;
    if (primaryColor) {
      switch (harmony) {
        case 'complementary':
          newPalette = generateComplementaryPalette(primaryColor, isDarkMode);
          break;
        case 'triadic':
          newPalette = generateTriadicPalette(primaryColor, isDarkMode);
          break;
        case 'analogous':
          newPalette = generateAnalogousPalette(primaryColor, isDarkMode);
          break;
        case 'split-complementary':
          newPalette = generateSplitComplementaryPalette(
            primaryColor,
            isDarkMode,
          );
          break;
        case 'tetradic':
          newPalette = generateTetradicPalette(primaryColor, isDarkMode);
          break;
        case 'monochromatic':
          newPalette = generateMonochromaticPalette(primaryColor, isDarkMode);
          break;
        case 'square':
          newPalette = generateSquarePalette(primaryColor, isDarkMode);
          break;
        case 'double-split complementary':
          newPalette = generateDoubleSplitComplementaryPalette(
            primaryColor,
            isDarkMode,
          );
          break;
        default:
          newPalette = generatePalette(primaryColor, isDarkMode);
      }
    }
    dispatch(setPalette(newPalette));
  }, [primaryColor, harmony, isDarkMode, dispatch]);

  return (
    <div className="App">
      {/* Header */}
      <header className="app-header fade-in">
        <h1 className="title">Color Palette Generator</h1>
        <p className="subtitle">
          Create beautiful, accessible color palettes for your design projects
        </p>
      </header>

      {/* Left Sidebar - Controls */}
      <aside className="app-sidebar">
        <div className="glass-card slide-up">
          <h2 className="section-header">Color Controls</h2>
          <div className="space-y-4">
            <ThemeToggle
              isDarkMode={isDarkMode}
              setIsDarkMode={(value) => dispatch(setIsDarkMode(value))}
            />
            <ColorInput
              setPrimaryColor={(value) => dispatch(setPrimaryColor(value))}
              primaryColor={primaryColor}
            />
            <ImageUpload onImageUpload={handleImageUpload} />
          </div>
        </div>

        <div className="glass-card slide-up">
          <HarmonySelector
            currentHarmony={harmony}
            setHarmony={(value) => dispatch(setHarmony(value))}
          />
        </div>

        <Suspense fallback={<div className="glass-card animate-pulse">Loading...</div>}>
          {palette && (
            <div className="glass-card slide-up">
              <PaletteManager
                palette={palette}
                updatePalette={setPalette}
                setPrimaryColor={(value) => dispatch(setPrimaryColor(value))}
              />
            </div>
          )}
        </Suspense>
      </aside>

      {/* Main Preview Area */}
      <main className="app-preview">
        <div className="glass-card slide-up">
          {palette && <Preview palette={palette} />}
        </div>
      </main>

      {/* Right Sidebar - Tools */}
      <aside className="app-tools">
        {palette && (
          <div className="glass-card slide-up">
            <Suspense fallback={<div className="animate-pulse">Loading tools...</div>}>
              <ElementColorList
                elements={elements}
                palette={palette}
                colors={Object.fromEntries(
                  Object.keys(elements).map((key) => [
                    key,
                    getElementColor(key, palette, {}),
                  ]),
                )}
                onElementClick={(element) =>
                  handleElementClick(element, setSelectedElement)
                }
              />
            </Suspense>
          </div>
        )}
      </aside>

      {/* Floating Toolbar */}
      <Suspense fallback={null}>
        <Toolbar palette={palette} />
      </Suspense>

      {/* Footer */}
      <footer className="app-footer">
        <Footer />
      </footer>
    </div>
  );
}

export default App;
