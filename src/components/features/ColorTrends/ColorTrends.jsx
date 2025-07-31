import React, { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { setPalette } from '../../../store/slices/paletteSlice';
import { addNotification } from '../../../store/slices/uiSlice';
import { ColorUtils } from '../../../utils/colorUtils';

/**
 * Color trends and inspiration component with curated palettes
 */
function ColorTrends() {
    const dispatch = useDispatch();
    const [selectedCategory, setSelectedCategory] = useState('2024');
    const [hoveredPalette, setHoveredPalette] = useState(null);

    // Curated color palettes and trends
    const trendCategories = {
        '2024': {
            name: '2024 Trends',
            icon: '✨',
            description: 'Latest color trends and predictions for 2024',
            palettes: [
                {
                    name: 'Digital Lime',
                    colors: ['#D0FF14', '#98FB98', '#32CD32', '#228B22', '#006400'],
                    description: 'Bright, electric green that commands attention',
                    trend: 'Pantone Color of the Year inspiration'
                },
                {
                    name: 'Warm Neutrals',
                    colors: ['#F5F5DC', '#DEB887', '#CD853F', '#A0522D', '#8B4513'],
                    description: 'Comforting earth tones with warmth',
                    trend: 'Post-pandemic comfort colors'
                },
                {
                    name: 'Digital Purple',
                    colors: ['#8A2BE2', '#9370DB', '#BA55D3', '#DDA0DD', '#E6E6FA'],
                    description: 'Futuristic purple shades for digital interfaces',
                    trend: 'Tech and AI themes'
                },
                {
                    name: 'Sunset Coral',
                    colors: ['#FF7F50', '#FF6347', '#FF4500', '#FF8C00', '#FFA500'],
                    description: 'Warm coral tones inspired by golden hour',
                    trend: 'Nature-inspired optimism'
                }
            ]
        },
        'nature': {
            name: 'Nature Inspired',
            icon: '🌿',
            description: 'Palettes drawn from natural landscapes and elements',
            palettes: [
                {
                    name: 'Forest Canopy',
                    colors: ['#0D4F3C', '#1E6B4A', '#2E8B57', '#90EE90', '#F0FFF0'],
                    description: 'Deep forest greens with light filtering through leaves',
                    trend: 'Biophilic design'
                },
                {
                    name: 'Ocean Depths',
                    colors: ['#000080', '#191970', '#4169E1', '#6495ED', '#87CEEB'],
                    description: 'From midnight ocean to bright sky blue',
                    trend: 'Water therapy aesthetics'
                },
                {
                    name: 'Desert Sunset',
                    colors: ['#8B4513', '#CD853F', '#F4A460', '#FFE4B5', '#FFF8DC'],
                    description: 'Warm desert sands and dramatic sunsets',
                    trend: 'Minimalist luxury'
                },
                {
                    name: 'Mountain Mist',
                    colors: ['#2F4F4F', '#708090', '#B0C4DE', '#E6E6FA', '#F8F8FF'],
                    description: 'Cool mountain tones with misty atmosphere',
                    trend: 'Scandinavian minimalism'
                }
            ]
        },
        'retro': {
            name: 'Retro Revival',
            icon: '🕺',
            description: 'Nostalgic color schemes from past decades',
            palettes: [
                {
                    name: '80s Neon',
                    colors: ['#FF1493', '#00FFFF', '#FFFF00', '#FF4500', '#8A2BE2'],
                    description: 'Electric neon colors from the radical 80s',
                    trend: 'Synthwave and retrowave'
                },
                {
                    name: '70s Earth',
                    colors: ['#8B4513', '#DAA520', '#CD853F', '#F4A460', '#DEB887'],
                    description: 'Warm, earthy tones from the groovy 70s',
                    trend: 'Vintage interior design'
                },
                {
                    name: '90s Pastels',
                    colors: ['#FFB6C1', '#98FB98', '#87CEEB', '#DDA0DD', '#F0E68C'],
                    description: 'Soft pastel colors from the optimistic 90s',
                    trend: 'Y2K nostalgia'
                },
                {
                    name: '60s Pop',
                    colors: ['#FF69B4', '#00CED1', '#FFD700', '#FF6347', '#32CD32'],
                    description: 'Bold, psychedelic colors from the swinging 60s',
                    trend: 'Pop art revival'
                }
            ]
        },
        'minimal': {
            name: 'Minimal & Clean',
            icon: '⚪',
            description: 'Simple, sophisticated palettes for modern design',
            palettes: [
                {
                    name: 'Monochrome Elite',
                    colors: ['#000000', '#333333', '#666666', '#CCCCCC', '#FFFFFF'],
                    description: 'Classic black to white gradient',
                    trend: 'Timeless elegance'
                },
                {
                    name: 'Soft Whites',
                    colors: ['#FFFAFA', '#F5F5F5', '#DCDCDC', '#C0C0C0', '#A9A9A9'],
                    description: 'Subtle variations of white and gray',
                    trend: 'Scandinavian design'
                },
                {
                    name: 'Blue Minimal',
                    colors: ['#F0F8FF', '#E6F3FF', '#CCE7FF', '#99D6FF', '#66C5FF'],
                    description: 'Clean blue tones for tech and medical',
                    trend: 'Corporate clarity'
                },
                {
                    name: 'Warm Grays',
                    colors: ['#FAF9F6', '#F5F5DC', '#E5E4E2', '#D3D3D3', '#A9A9A9'],
                    description: 'Warm-toned neutral palette',
                    trend: 'Modern comfort'
                }
            ]
        },
        'bold': {
            name: 'Bold & Vibrant',
            icon: '💥',
            description: 'High-energy colors that make a statement',
            palettes: [
                {
                    name: 'Electric Dreams',
                    colors: ['#FF0080', '#00FF80', '#8000FF', '#FF8000', '#0080FF'],
                    description: 'Saturated colors for maximum impact',
                    trend: 'Gaming and esports'
                },
                {
                    name: 'Tropical Punch',
                    colors: ['#FF1493', '#FF8C00', '#32CD32', '#00CED1', '#9932CC'],
                    description: 'Vibrant tropical and fruity colors',
                    trend: 'Festival and events'
                },
                {
                    name: 'Neon Nights',
                    colors: ['#39FF14', '#FF073A', '#00FFFF', '#FFFF00', '#FF1493'],
                    description: 'Glowing neon colors for nightlife',
                    trend: 'Club and entertainment'
                },
                {
                    name: 'Fire & Ice',
                    colors: ['#FF4500', '#FF6347', '#00BFFF', '#87CEEB', '#F0F8FF'],
                    description: 'Contrasting warm and cool extremes',
                    trend: 'High contrast design'
                }
            ]
        }
    };

    // Get current category data
    const currentCategory = trendCategories[selectedCategory];

    // Generate random palette variations
    const generateVariation = (basePalette) => {
        return basePalette.colors.map(color => {
            try {
                const hsl = ColorUtils.hexToHsl(color);
                const variation = {
                    ...hsl,
                    h: (hsl.h + (Math.random() - 0.5) * 30 + 360) % 360,
                    s: Math.max(0, Math.min(100, hsl.s + (Math.random() - 0.5) * 20)),
                    l: Math.max(10, Math.min(90, hsl.l + (Math.random() - 0.5) * 20))
                };
                return ColorUtils.hslToHex(variation);
            } catch (error) {
                return color;
            }
        });
    };

    // Apply palette to current workspace
    const applyPalette = (palette) => {
        try {
            dispatch(setPalette({
                colors: palette.colors,
                name: palette.name,
                description: palette.description
            }));

            dispatch(addNotification({
                type: 'success',
                message: `Applied "${palette.name}" palette`,
                details: `${palette.colors.length} colors loaded`
            }));
        } catch (error) {
            dispatch(addNotification({
                type: 'error',
                message: 'Failed to apply palette',
                details: error.message
            }));
        }
    };

    // Copy palette colors to clipboard
    const copyPalette = async (palette) => {
        try {
            const colorText = palette.colors.join(', ');
            await navigator.clipboard.writeText(colorText);

            dispatch(addNotification({
                type: 'success',
                message: 'Palette copied to clipboard',
                details: colorText
            }));
        } catch (error) {
            dispatch(addNotification({
                type: 'error',
                message: 'Failed to copy palette',
                details: 'Clipboard not available'
            }));
        }
    };

    return (
        <Card
            title="Color Trends & Inspiration"
            subtitle="Discover trending palettes and find your next color story"
        >
            <div className="space-y-6">
                {/* Category Selector */}
                <div className="flex flex-wrap gap-2">
                    {Object.entries(trendCategories).map(([key, category]) => (
                        <button
                            key={key}
                            onClick={() => setSelectedCategory(key)}
                            className={`px-4 py-2 rounded-lg border transition-all duration-200 ${selectedCategory === key
                                    ? 'bg-blue-500 border-blue-400 text-white'
                                    : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10 hover:border-white/30'
                                }`}
                        >
                            <span className="mr-2">{category.icon}</span>
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* Category Info */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="text-lg font-medium text-white mb-2">
                        {currentCategory.icon} {currentCategory.name}
                    </h3>
                    <p className="text-white/70 text-sm">
                        {currentCategory.description}
                    </p>
                </div>

                {/* Palette Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {currentCategory.palettes.map((palette, index) => (
                        <div
                            key={index}
                            className="bg-white/5 rounded-lg border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-200"
                            onMouseEnter={() => setHoveredPalette(index)}
                            onMouseLeave={() => setHoveredPalette(null)}
                        >
                            {/* Color Preview */}
                            <div className="h-24 flex">
                                {palette.colors.map((color, colorIndex) => (
                                    <div
                                        key={colorIndex}
                                        className="flex-1 relative group cursor-pointer"
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    >
                                        {hoveredPalette === index && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <span className="text-white text-xs font-mono">
                                                    {color}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Palette Info */}
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-white font-medium">{palette.name}</h4>
                                    <span className="text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded">
                                        {palette.trend}
                                    </span>
                                </div>

                                <p className="text-white/70 text-sm mb-4">
                                    {palette.description}
                                </p>

                                {/* Action Buttons */}
                                <div className="flex space-x-2">
                                    <Button
                                        onClick={() => applyPalette(palette)}
                                        size="sm"
                                        className="flex-1"
                                    >
                                        Apply Palette
                                    </Button>

                                    <Button
                                        onClick={() => copyPalette(palette)}
                                        variant="outline"
                                        size="sm"
                                    >
                                        📋
                                    </Button>

                                    <Button
                                        onClick={() => applyPalette({
                                            ...palette,
                                            colors: generateVariation(palette),
                                            name: `${palette.name} (Variation)`
                                        })}
                                        variant="outline"
                                        size="sm"
                                        title="Generate variation"
                                    >
                                        🎲
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trend Insights */}
                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-6">
                    <h4 className="text-white font-medium mb-3 flex items-center">
                        <span className="mr-2">📊</span>
                        Color Trend Insights
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <h5 className="text-purple-300 font-medium mb-2">Current Trends</h5>
                            <ul className="text-white/70 space-y-1">
                                <li>• Sustainable, earth-inspired palettes</li>
                                <li>• Digital-first bright accent colors</li>
                                <li>• Nostalgic 90s and Y2K revivals</li>
                                <li>• Accessibility-focused high contrast</li>
                            </ul>
                        </div>

                        <div>
                            <h5 className="text-blue-300 font-medium mb-2">Design Applications</h5>
                            <ul className="text-white/70 space-y-1">
                                <li>• Web and mobile interfaces</li>
                                <li>• Brand identity and marketing</li>
                                <li>• Interior and product design</li>
                                <li>• Social media and content</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Pro Tips */}
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <h5 className="text-yellow-300 font-medium mb-2 flex items-center">
                        <span className="mr-2">💡</span>
                        Pro Tips
                    </h5>
                    <ul className="text-yellow-200/80 text-sm space-y-1">
                        <li>• Use the variation button (🎲) to create unique versions of trending palettes</li>
                        <li>• Test palettes in the Accessibility tab before finalizing your design</li>
                        <li>• Combine trending colors with your brand's core colors for fresh looks</li>
                        <li>• Save successful variations to your library for future projects</li>
                    </ul>
                </div>
            </div>
        </Card>
    );
}

export default ColorTrends;
