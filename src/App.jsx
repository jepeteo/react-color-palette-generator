// src/App.js
import { useState, useEffect } from 'react';
import ColorInput from './components/ColorInput';
import ColorLegend from './components/ColorLegend';
import Preview from './components/Preview';
import PaletteCustomizer from './components/PaletteCustomizer';
import HarmonySelector from './components/HarmonySelector';
import ThemeToggle from './components/ThemeToggle';
import AccessibilityChecker from './components/AccessibilityChecker';
import ImageUpload from './components/ImageUpload';
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

function App() {
  const [primaryColor, setPrimaryColor] = useState('#3490dc');
  const [palette, setPalette] = useState(null);
  const [harmony, setHarmony] = useState('default');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageColors, setImageColors] = useState(null);

  const handleImageUpload = async (imageData) => {
    setUploadedImage(imageData);
    try {
      const colors = await extractColors(imageData);
      const primaryColor = colors[0].hex;
      setPrimaryColor(primaryColor);
    } catch (error) {
      console.error('Error extracting colors:', error);
    }
  };

  useEffect(() => {
    console.log('Primary Color:', primaryColor);
    console.log('Harmony:', harmony);
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
          console.log('Double Split Complementary Palette:', newPalette);
          break;

        default:
          newPalette = generatePalette(primaryColor, isDarkMode);
          console.log('Default Palette:', newPalette);
      }
    }
    setPalette(newPalette);
  }, [primaryColor, harmony, isDarkMode]);

  return (
    <div className="App">
      <h1 className="title">Color Palette Generator for Web Designers</h1>
      <div className="containerGenerator">
        <div className="containerColorPalette">
          <h2>Color Palette</h2>
          <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          <ColorInput
            setPrimaryColor={setPrimaryColor}
            primaryColor={primaryColor}
          />
          <ImageUpload onImageUpload={handleImageUpload} />
        </div>
        <HarmonySelector currentHarmony={harmony} setHarmony={setHarmony} />
        {palette && (
          <PaletteCustomizer
            palette={palette}
            updatePalette={setPalette}
            setPrimaryColor={setPrimaryColor}
          />
        )}
      </div>
      <div className="containerInfo">
        {palette && (
          <>
            <ColorLegend palette={palette} />
            <AccessibilityChecker palette={palette} />
          </>
        )}
      </div>
      <div className="containerPreview">
        {palette && <Preview palette={palette} />}
      </div>
      <Footer />
    </div>
  );
}

export default App;
