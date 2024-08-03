import React from 'react';

function ColorSelector({ palette, onSelect, onClose, selectedElement }) {
  return (
    <div className="absolute right-8 z-10 flex max-w-[400px] flex-wrap items-center gap-4 rounded bg-white p-4 shadow-lg">
      {selectedElement && (
        <p className="w-full border-b pb-2">
          Selected Element: <span className="font-bold">{selectedElement}</span>
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {Object.entries(palette).map(([key, color]) => (
          <button
            key={key}
            className="h-8 w-8 rounded-full border"
            style={{ backgroundColor: color }}
            onClick={() => onSelect(color)}
          />
        ))}
      </div>
      <button
        className="rounded border border-slate-800 bg-gray-200 px-3 py-1"
        onClick={onClose}
      >
        X
      </button>
    </div>
  );
}

export default ColorSelector;
