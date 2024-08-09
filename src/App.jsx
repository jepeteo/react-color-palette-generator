// src/App.js
import { useState, useEffect, Suspense, lazy } from 'react';
import ColorInput from './components/ColorInput';
import ColorLegend from './components/ColorLegend';
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

const PaletteCustomizer = lazy(() => import('./components/PaletteCustomizer'));
const ImageUpload = lazy(() => import('./components/ImageUpload'));
const ElementColorList = lazy(() => import('./components/ElementColorList'));

function App() {
  const [initialPrimaryColor] = useState('#3490dc');
  const [primaryColor, setPrimaryColor] = useState('#3490dc');
  const [palette, setPalette] = useState(null);
  const [harmony, setHarmony] = useState('default');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageColors, setImageColors] = useState(null);

  const handleReset = () => {
    setPrimaryColor(initialPrimaryColor);
    setHarmony('default');
    setUploadedImage(null);
  };

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
        {harmony !== 'default' && (
          <button onClick={handleReset} className="buttonReset">
            Reset
          </button>
        )}
        <HarmonySelector currentHarmony={harmony} setHarmony={setHarmony} />
        <Suspense fallback={<div>Customize Palette is Loading...</div>}>
          {palette && (
            <PaletteCustomizer
              palette={palette}
              updatePalette={setPalette}
              setPrimaryColor={setPrimaryColor}
            />
          )}
        </Suspense>
      </div>

      <div className="containerInfo">
        {palette && (
          <>
            <ColorLegend palette={palette} />
            <Suspense fallback={<div>Elements Color List is Loading...</div>}>
              <ElementColorList
                elements={elements}
                palette={palette}
                colors={Object.fromEntries(
                  Object.keys(elements).map((key) => [
                    key,
                    getElementColor(key, palette, {}), // Pass an empty object for customColors
                  ]),
                )}
                onElementClick={(element) =>
                  handleElementClick(element, setSelectedElement)
                }
              />
            </Suspense>
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
