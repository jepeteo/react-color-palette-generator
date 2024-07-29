// src/App.js
import { useState, useEffect } from 'react';
import ColorInput from './components/ColorInput';
import ColorLegend from './components/ColorLegend';
import Preview from './components/Preview';
import PaletteCustomizer from './components/PaletteCustomizer';
import HarmonySelector from './components/HarmonySelector';
import ThemeToggle from './components/ThemeToggle';
import AccessibilityChecker from './components/AccessibilityChecker';
import {
  generatePalette,
  generateComplementaryPalette,
  generateTriadicPalette,
  generateAnalogousPalette,
  generateSplitComplementaryPalette,
  generateTetradicPalette,
  generateMonochromaticPalette,
} from './utils/colorUtils';
import './index.css';

function App() {
  const [primaryColor, setPrimaryColor] = useState('#3490dc');
  const [palette, setPalette] = useState(null);
  const [harmony, setHarmony] = useState('default');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(
    () => {
      let newPalette;
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
        default:
          newPalette = generatePalette(primaryColor, isDarkMode, isDarkMode);
      }
      setPalette(newPalette);
    },
    [primaryColor, harmony, isDarkMode],
    isDarkMode,
  );

  return (
    <div className="App">
      <h1 className="title">Color Palette Generator for Web Designers</h1>
      <div className="containerGenerator">
        <div className="containerColorPalette">
          <h2>Color Palette</h2>
          <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          <ColorInput setPrimaryColor={setPrimaryColor} />
        </div>
        <HarmonySelector currentHarmony={harmony} setHarmony={setHarmony} />
        {palette && (
          <PaletteCustomizer palette={palette} updatePalette={setPalette} />
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
      <div className='containerPreview'>{palette && <Preview palette={palette} />}</div>
    </div>
  );
}

export default App;
