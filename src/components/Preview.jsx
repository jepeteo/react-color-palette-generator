// src/components/Preview.js
import React from 'react';

const  Preview = ({ palette }) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-3">Preview</h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(palette).map(([name, color]) => (
          <div key={name} className="flex items-center">
            <div
              className="w-8 h-8 rounded-full mr-2"
              style={{ backgroundColor: color }}
            ></div>
            <span>{name}: {color}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Preview;
