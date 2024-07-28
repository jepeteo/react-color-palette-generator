// src/components/Preview.js
import React from "react"

const Preview = ({ palette }) => {
  return (
    <div className="mt-8">
      <h2 className="mb-3 text-xl font-semibold">Preview</h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(palette).map(([name, color]) => (
          <div key={name} className="flex items-center">
            <div
              className="mr-2 h-8 w-8 rounded-full"
              style={{ backgroundColor: color }}
            ></div>
            <span>
              {name}: {color}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Preview
