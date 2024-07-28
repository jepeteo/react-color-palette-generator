// src/components/HarmonySelector.js
import React from "react"

function HarmonySelector({ currentHarmony, setHarmony }) {
  const harmonies = [
    "Default",
    "Complementary",
    "Triadic",
    "Analogous",
    "Split Complementary",
    "Tetradic",
    "Monochromatic",
  ]

  return (
    <div className="mt-4">
      <h3 className="mb-2 text-lg font-semibold">Color Harmony</h3>
      <div className="flex flex-wrap gap-2">
        {harmonies.map((harmony) => (
          <button
            key={harmony}
            onClick={() => setHarmony(harmony.toLowerCase().replace(" ", "-"))}
            className={`rounded px-3 py-1 ${
              currentHarmony === harmony.toLowerCase().replace(" ", "-")
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {harmony}
          </button>
        ))}
      </div>
    </div>
  )
}

export default HarmonySelector
