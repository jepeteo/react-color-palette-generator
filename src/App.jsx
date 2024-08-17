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

const PaletteManager = lazy(() => import('./components/PaletteManager'));
const ImageUpload = lazy(() => import('./components/ImageUpload'));
const ElementColorList = lazy(() => import('./components/ElementColorList'));

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
      <h1 className="title">Color Palette Generator for Web Designers</h1>
      <div className="containerGenerator">
        <div className="containerColorPalette">
          <h2>Color Palette</h2>
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
        {harmony !== 'default' && (
          <button onClick={handleReset} className="buttonReset">
            Reset
          </button>
        )}
        <HarmonySelector
          currentHarmony={harmony}
          setHarmony={(value) => dispatch(setHarmony(value))}
        />
        <Suspense fallback={<div>Palette Manager is Loading...</div>}>
          {palette && (
            <PaletteManager
              palette={palette}
              updatePalette={setPalette}
              setPrimaryColor={(value) => dispatch(setPrimaryColor(value))}
            />
          )}
        </Suspense>
      </div>

      <div className="containerInfo">
        {palette && (
          <>
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
