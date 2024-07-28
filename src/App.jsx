// src/App.js
import React, { useState, useEffect } from "react"
import ColorInput from "./components/ColorInput"
import PaletteGenerator from "./components/PaletteGenerator"
import Preview from "./components/Preview"
import PaletteCustomizer from "./components/PaletteCustomizer"
import HarmonySelector from "./components/HarmonySelector"
import ThemeToggle from "./components/ThemeToggle"
import {
  generatePalette,
  generateComplementaryPalette,
  generateTriadicPalette,
  generateAnalogousPalette,
  generateSplitComplementaryPalette,
  generateTetradicPalette,
  generateMonochromaticPalette,
} from "./utils/colorUtils"

function App() {
  const [primaryColor, setPrimaryColor] = useState("#3490dc")
  const [palette, setPalette] = useState(null)
  const [harmony, setHarmony] = useState("default")
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    let newPalette
    switch (harmony) {
      case "complementary":
        newPalette = generateComplementaryPalette(primaryColor, isDarkMode)
        break
      case "triadic":
        newPalette = generateTriadicPalette(primaryColor)
        break
      case "analogous":
        newPalette = generateAnalogousPalette(primaryColor)
        break
      case "split-complementary":
        newPalette = generateSplitComplementaryPalette(primaryColor)
        break
      case "tetradic":
        newPalette = generateTetradicPalette(primaryColor)
        break
      case "monochromatic":
        newPalette = generateMonochromaticPalette(primaryColor)
        break
      default:
        newPalette = generatePalette(primaryColor, isDarkMode)
    }
    setPalette(newPalette)
  }, [primaryColor, harmony, isDarkMode])

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-4xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-3xl font-semibold mb-5">Color Palette Generator</h1>
          <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <ColorInput setPrimaryColor={setPrimaryColor} />
              <HarmonySelector
                currentHarmony={harmony}
                setHarmony={setHarmony}
              />
              {palette && (
                <PaletteCustomizer
                  palette={palette}
                  updatePalette={setPalette}
                />
              )}
            </div>
            <div>{palette && <Preview palette={palette} />}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
