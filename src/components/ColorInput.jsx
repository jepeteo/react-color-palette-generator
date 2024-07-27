// src/components/ColorInput.js
import React from 'react';

const ColorInput = ({ setPrimaryColor }) => {
    const handleColorChange = (e) => {
        setPrimaryColor(e.target.value);
      };
    
      return (
        <div className="mb-5">
          <label htmlFor="colorInput" className="block text-sm font-medium text-gray-700">
            Primary Color
          </label>
          <input
            type="color"
            id="colorInput"
            onChange={handleColorChange}
            className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      );
    }
   
export default ColorInput;