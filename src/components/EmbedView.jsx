import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * EmbedView component for displaying palettes in embedded format
 */
const EmbedView = () => {
    const [searchParams] = useSearchParams();
    const [palette, setPalette] = useState({ colors: [] });

    useEffect(() => {
        const colors = searchParams.get('colors');
        const harmony = searchParams.get('harmony');

        if (colors) {
            const colorArray = colors.split(',').map(color =>
                color.startsWith('#') ? color : `#${color}`
            );

            const validColors = colorArray.filter(color =>
                /^#[0-9A-Fa-f]{6}$/.test(color)
            );

            if (validColors.length > 0) {
                setPalette({
                    colors: validColors,
                    harmony: harmony || 'custom'
                });
            }
        }
    }, [searchParams]);

    if (!palette.colors || palette.colors.length === 0) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-100">
                <div className="text-gray-600 text-center">
                    <div className="text-2xl mb-2">🎨</div>
                    <div>No palette to display</div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Color Bars */}
            <div className="flex-1 flex">
                {palette.colors.map((color, index) => (
                    <div
                        key={index}
                        className="flex-1 flex items-end justify-center pb-2 transition-all duration-300 hover:scale-105"
                        style={{ backgroundColor: color }}
                    >
                        <div className="bg-black/30 text-white px-2 py-1 rounded text-xs font-mono opacity-0 hover:opacity-100 transition-opacity">
                            {color}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
                    <span className="font-medium text-gray-700">
                        {palette.harmony || 'Custom'} Palette
                    </span>
                </div>
                <div className="text-gray-500">
                    {palette.colors.length} colors
                </div>
            </div>
        </div>
    );
};

export default EmbedView;
