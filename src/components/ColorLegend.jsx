import React from 'react';

const ColorLegend = ({ palette }) => {
  return (
    <div className="colorLegend">
      <h2 className="containerTitle">Palette Information</h2>
      {Object.entries(palette).map(([name, color]) => (
        <div key={name} className="flex items-center">
          <div
            className="mr-2 h-8 w-8 rounded-full border"
            style={{ backgroundColor: color }}
          ></div>
          <span>
            {name}: {color}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ColorLegend;
