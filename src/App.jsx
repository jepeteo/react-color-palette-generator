// src/App.js
import React, { useState } from "react"
import ColorInput from "./components/ColorInput"
import PaletteGenerator from "./components/PaletteGenerator"
import Preview from "./components/Preview"

const App = () => {
  const [primaryColor, setPrimaryColor] = useState("#000000")
  const [palette, setPalette] = useState(null)

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-100 py-6 sm:py-12">
      <div className="relative py-3 sm:mx-auto sm:max-w-xl">
        <div className="to-light-blue-500 absolute inset-0 -skew-y-6 transform bg-gradient-to-r from-cyan-400 shadow-lg sm:-rotate-6 sm:skew-y-0 sm:rounded-3xl"></div>
        <div className="relative bg-white px-4 py-10 shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="mb-5 text-2xl font-semibold">
            Color Palette Generator
          </h1>
          <ColorInput setPrimaryColor={setPrimaryColor} />
          <PaletteGenerator
            primaryColor={primaryColor}
            setPalette={setPalette}
          />
          {palette && <Preview palette={palette} />}
        </div>
      </div>
    </div>
  )
}

export default App
