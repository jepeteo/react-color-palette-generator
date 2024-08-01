// src/components/ColorInput.js
import React from 'react';

const ColorInput = ({ setPrimaryColor, primaryColor }) => {
  const handleColorChange = (e) => {
    setPrimaryColor(e.target.value);
  };

  return (
    <div className="colorInput">
      <label htmlFor="colorInput" className="col-span-2">
        Primary Color:
      </label>
      <input
        type="color"
        id="colorInput"
        value={primaryColor}
        onChange={handleColorChange}
        className="m-0 h-8 w-10 bg-white p-0"
      />
    </div>
  );
};

export default ColorInput;
