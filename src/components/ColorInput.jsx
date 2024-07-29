// src/components/ColorInput.js
import React from 'react';

const ColorInput = ({ setPrimaryColor }) => {
  const handleColorChange = (e) => {
    setPrimaryColor(e.target.value);
  };

  return (
    <div className="colorInput">
      <label
        htmlFor="colorInput"
        className="col-span-2 "
      >
        Primary Color:
      </label>
      <input
        type="color"
        id="colorInput"
        onChange={handleColorChange}
        className="h-8 w-10 bg-white m-0 p-0"
      />
    </div>
  );
};

export default ColorInput;
