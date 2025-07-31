import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * EmbedView component for displaying palettes in embedded format
 */
function EmbedView() {
  const [searchParams] = useSearchParams();
  const [palette, setPalette] = useState({ colors: [] });

  useEffect(() => {
    const colors = searchParams.get('colors');
    const harmony = searchParams.get('harmony');

    if (colors) {
      const colorArray = colors
        .split(',')
        .map((color) => (color.startsWith('#') ? color : `#${color}`));

      const validColors = colorArray.filter((color) =>
        /^#[0-9A-Fa-f]{6}$/.test(color),
      );

      if (validColors.length > 0) {
        setPalette({
          colors: validColors,
          harmony: harmony || 'custom',
        });
      }
    }
  }, [searchParams]);

  if (!palette.colors || palette.colors.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-100">
        <div className="text-center text-gray-600">
          <div className="mb-2 text-2xl">🎨</div>
          <div>No palette to display</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Color Bars */}
      <div className="flex flex-1">
        {palette.colors.map((color, index) => (
          <div
            key={index}
            className="flex flex-1 items-end justify-center pb-2 transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: color }}
          >
            <div className="rounded bg-black/30 px-2 py-1 font-mono text-xs text-white opacity-0 transition-opacity hover:opacity-100">
              {color}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between bg-white/90 px-4 py-2 text-sm backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-gradient-to-r from-blue-500 to-purple-500" />
          <span className="font-medium text-gray-700">
            {palette.harmony || 'Custom'} Palette
          </span>
        </div>
        <div className="text-gray-500">{palette.colors.length} colors</div>
      </div>
    </div>
  );
}

export default EmbedView;
