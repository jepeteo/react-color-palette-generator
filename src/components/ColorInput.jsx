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
    <div className="colorInput">
      <label htmlFor="colorInput" className="col-span-2">
        Primary Color:
      </label>
      <input
        type="color"
        id="colorInput"
        value={primaryColor}
        onChange={handleColorChange}
        aria-label="Input for Primary Color"
        className="m-0 h-8 w-10 bg-white p-0"
      />
    </div>
  );
};

export default ColorInput;
