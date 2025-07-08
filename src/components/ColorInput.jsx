import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPrimaryColor } from '../store/colorSlice';

const ColorInput = () => {
  const dispatch = useDispatch();
  const primaryColor = useSelector((state) => state.color.primaryColor);

  const handleColorChange = (e) => {
    dispatch(setPrimaryColor(e.target.value));
  };

  return (
    <div className="space-y-3">
      <label htmlFor="colorInput" className="block text-sm font-medium text-gray-300">
        Primary Color
      </label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          id="colorInput"
          value={primaryColor}
          onChange={handleColorChange}
          className="w-16 h-16 rounded-xl border-2 border-white border-opacity-20 cursor-pointer transition-all duration-300 hover:scale-105"
        />
        <div className="flex-1">
          <input
            type="text"
            value={primaryColor}
            onChange={handleColorChange}
            className="modern-input font-mono text-sm"
            placeholder="#000000"
          />
        </div>
      </div>
    </div>
  );
};

export default ColorInput;
