import React from 'react';

function ColorSelector({ palette, onSelect, onClose, selectedElement }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card max-w-md w-full">
        {selectedElement && (
          <div className="mb-4 pb-4 border-b border-white/10">
            <p className="text-sm text-white/70">Selected Element:</p>
            <p className="font-semibold text-white">{selectedElement}</p>
          </div>
        )}

        <h3 className="text-lg font-semibold mb-4">Choose a Color</h3>

        <div className="grid grid-cols-5 gap-3 mb-6">
          {Object.entries(palette).map(([key, color]) => (
            <button
              key={key}
              className="aspect-square rounded-lg border-2 border-white/20 hover:border-white/40 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl group relative overflow-hidden"
              style={{ backgroundColor: color }}
              onClick={() => onSelect(color)}
              title={`${key}: ${color}`}
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-1 left-1 right-1 text-xs text-white/80 bg-black/30 rounded px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                {key}
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            className="btn-secondary flex-1"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ColorSelector;
