import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { setPalette } from '../../../store/slices/paletteSlice';
import { addNotification } from '../../../store/slices/uiSlice';
import { selectPalette } from '../../../store/slices/paletteSlice';
import { ColorUtils } from '../../../utils/colorUtils';

/**
 * AI-powered Color Assistant with intelligent suggestions and analysis
 */
function AIColorAssistant() {
  const dispatch = useDispatch();
  const palette = useSelector(selectPalette);

  const [activeFeature, setActiveFeature] = useState('analyze');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [colorMoodInput, setColorMoodInput] = useState('');
  const [brandKeywords, setBrandKeywords] = useState('');
  const [industryType, setIndustryType] = useState('technology');

  // AI Features
  const aiFeatures = {
    analyze: {
      name: 'Palette Analysis',
      icon: '🔍',
      description: 'Get intelligent insights about your color palette',
    },
    mood: {
      name: 'Mood-Based Colors',
      icon: '🎭',
      description: 'Generate colors based on emotions and moods',
    },
    brand: {
      name: 'Brand Colors',
      icon: '🏢',
      description: 'Create brand-appropriate color schemes',
    },
    complement: {
      name: 'Smart Complements',
      icon: '🧠',
      description: 'Find perfect complementary colors',
    },
    enhance: {
      name: 'Palette Enhancement',
      icon: '✨',
      description: 'Improve existing palettes with AI suggestions',
    },
  };

  // Industry color associations
  const industryColors = {
    technology: {
      primary: ['#007ACC', '#4A90E2', '#6C5CE7', '#0984e3'],
      secondary: ['#74B9FF', '#81ECEC', '#00B894', '#A29BFE'],
      moods: ['innovative', 'trustworthy', 'modern', 'efficient'],
    },
    healthcare: {
      primary: ['#0088CC', '#28A745', '#17A2B8', '#6C757D'],
      secondary: ['#E8F4F8', '#D4EDDA', '#CCE5F0', '#F8F9FA'],
      moods: ['caring', 'clean', 'trustworthy', 'calm'],
    },
    finance: {
      primary: ['#004080', '#228B22', '#1E3A8A', '#065F46'],
      secondary: ['#3B82F6', '#10B981', '#1F2937', '#374151'],
      moods: ['trustworthy', 'stable', 'professional', 'secure'],
    },
    education: {
      primary: ['#E74C3C', '#F39C12', '#3498DB', '#9B59B6'],
      secondary: ['#FDE2E4', '#FCF4DD', '#DBEAFE', '#EDE9FE'],
      moods: ['energetic', 'inspiring', 'creative', 'approachable'],
    },
    retail: {
      primary: ['#E91E63', '#FF5722', '#FF9800', '#795548'],
      secondary: ['#FCE4EC', '#FFF3E0', '#FFF8E1', '#EFEBE9'],
      moods: ['exciting', 'attractive', 'friendly', 'inviting'],
    },
    food: {
      primary: ['#FF6B35', '#F7931E', '#DC143C', '#8B4513'],
      secondary: ['#FFE5D9', '#FFF4E6', '#FFE4E1', '#F5DEB3'],
      moods: ['appetizing', 'warm', 'natural', 'comfort'],
    },
  };

  // Mood color mappings
  const moodColors = {
    energetic: ['#FF6B35', '#E74C3C', '#F39C12', '#E67E22'],
    calm: ['#3498DB', '#5DADE2', '#85C1E9', '#AED6F1'],
    professional: ['#2C3E50', '#34495E', '#5D6D7E', '#85929E'],
    creative: ['#9B59B6', '#8E44AD', '#AF7AC5', '#D2B4DE'],
    trustworthy: ['#2980B9', '#3498DB', '#5DADE2', '#85C1E9'],
    luxury: ['#7D3C98', '#6C3483', '#5B2C6F', '#512E5F'],
    natural: ['#27AE60', '#58D68D', '#82E0AA', '#ABEBC6'],
    playful: ['#E91E63', '#F8BBD9', '#F48FB1', '#F06292'],
    elegant: ['#2C2C2C', '#4F4F4F', '#7A7A7A', '#A5A5A5'],
    warm: ['#D35400', '#E67E22', '#F39C12', '#F7DC6F'],
  };

  // Analyze current palette
  const analyzePalette = useCallback(async () => {
    if (!palette.colors || palette.colors.length === 0) {
      dispatch(
        addNotification({
          type: 'error',
          message: 'No palette to analyze',
          details: 'Generate some colors first',
        }),
      );
      return;
    }

    setIsAnalyzing(true);

    // Simulate AI analysis with realistic delay
    setTimeout(() => {
      try {
        const analysis = performPaletteAnalysis(palette.colors);
        setAnalysisResults(analysis);
        setIsAnalyzing(false);

        dispatch(
          addNotification({
            type: 'success',
            message: 'Analysis complete',
            details: 'AI insights generated',
          }),
        );
      } catch (error) {
        setIsAnalyzing(false);
        dispatch(
          addNotification({
            type: 'error',
            message: 'Analysis failed',
            details: error.message,
          }),
        );
      }
    }, 1500);
  }, [palette.colors, dispatch]);

  // Perform palette analysis
  const performPaletteAnalysis = (colors) => {
    const analysis = {
      colorCount: colors.length,
      dominantHues: [],
      averageSaturation: 0,
      averageLightness: 0,
      contrast: 'medium',
      mood: 'balanced',
      suitability: [],
      suggestions: [],
      harmony: 'custom',
      accessibility: 'good',
      temperature: 'neutral',
    };

    // Analyze each color
    const hues = [];
    const saturations = [];
    const lightnesses = [];

    colors.forEach((color) => {
      try {
        const hsl = ColorUtils.hexToHsl(color);
        hues.push(hsl.h);
        saturations.push(hsl.s);
        lightnesses.push(hsl.l);
      } catch {
        // Skip invalid colors
      }
    });

    // Calculate averages
    analysis.averageSaturation =
      Math.round(saturations.reduce((a, b) => a + b, 0) / saturations.length) ||
      0;
    analysis.averageLightness =
      Math.round(lightnesses.reduce((a, b) => a + b, 0) / lightnesses.length) ||
      0;

    // Determine dominant hues
    const hueRanges = {
      red: hues.filter((h) => h >= 350 || h < 20).length,
      orange: hues.filter((h) => h >= 20 && h < 50).length,
      yellow: hues.filter((h) => h >= 50 && h < 70).length,
      green: hues.filter((h) => h >= 70 && h < 170).length,
      blue: hues.filter((h) => h >= 170 && h < 250).length,
      purple: hues.filter((h) => h >= 250 && h < 350).length,
    };

    analysis.dominantHues = Object.entries(hueRanges)
      .filter(([, count]) => count > 0)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([hue]) => hue);

    // Determine mood
    if (analysis.averageSaturation > 70 && analysis.averageLightness > 60) {
      analysis.mood = 'energetic';
    } else if (analysis.averageSaturation < 30) {
      analysis.mood = 'calm';
    } else if (analysis.averageLightness < 30) {
      analysis.mood = 'dramatic';
    } else if (
      analysis.dominantHues.includes('blue') ||
      analysis.dominantHues.includes('green')
    ) {
      analysis.mood = 'trustworthy';
    } else {
      analysis.mood = 'balanced';
    }

    // Temperature analysis
    const warmHues = hues.filter((h) => (h >= 0 && h < 120) || h >= 300).length;
    const coolHues = hues.filter((h) => h >= 120 && h < 300).length;

    if (warmHues > coolHues) {
      analysis.temperature = 'warm';
    } else if (coolHues > warmHues) {
      analysis.temperature = 'cool';
    }

    // Generate suggestions
    analysis.suggestions = [
      'Consider adding a neutral color for balance',
      'Try adjusting saturation for better harmony',
      'Add an accent color for visual interest',
      'Test accessibility with contrast checking',
    ];

    // Suitability analysis
    analysis.suitability = ['web design', 'branding', 'print design'];

    return analysis;
  };

  // Generate mood-based colors
  const generateMoodColors = useCallback(() => {
    const mood = colorMoodInput.toLowerCase().trim();

    if (!mood) {
      dispatch(
        addNotification({
          type: 'error',
          message: 'Enter a mood',
          details: 'Describe the feeling you want to evoke',
        }),
      );
      return;
    }

    // Find closest mood match
    let selectedColors = [];
    const moodKey = Object.keys(moodColors).find(
      (key) =>
        key.toLowerCase().includes(mood) || mood.includes(key.toLowerCase()),
    );

    if (moodKey) {
      selectedColors = moodColors[moodKey];
    } else {
      // Generate based on mood keywords
      if (
        mood.includes('bright') ||
        mood.includes('happy') ||
        mood.includes('energetic')
      ) {
        selectedColors = moodColors.energetic;
      } else if (
        mood.includes('calm') ||
        mood.includes('peaceful') ||
        mood.includes('relaxing')
      ) {
        selectedColors = moodColors.calm;
      } else if (
        mood.includes('professional') ||
        mood.includes('business') ||
        mood.includes('corporate')
      ) {
        selectedColors = moodColors.professional;
      } else {
        // Default to balanced colors
        selectedColors = [
          '#3498DB',
          '#E74C3C',
          '#F39C12',
          '#27AE60',
          '#9B59B6',
        ];
      }
    }

    dispatch(
      setPalette({
        colors: selectedColors,
        name: `${mood.charAt(0).toUpperCase() + mood.slice(1)} Mood`,
        type: 'mood-based',
      }),
    );

    dispatch(
      addNotification({
        type: 'success',
        message: 'Mood palette generated',
        details: `Colors for "${mood}" feeling`,
      }),
    );
  }, [colorMoodInput, dispatch]);

  // Generate brand colors
  const generateBrandColors = useCallback(() => {
    if (!brandKeywords.trim()) {
      dispatch(
        addNotification({
          type: 'error',
          message: 'Enter brand keywords',
          details: 'Describe your brand values or personality',
        }),
      );
      return;
    }

    const industryData = industryColors[industryType];
    const keywords = brandKeywords
      .toLowerCase()
      .split(/[,\s]+/)
      .filter(Boolean);

    // Select colors based on industry and keywords
    let selectedColors = [...industryData.primary.slice(0, 2)];

    // Add colors based on keywords
    keywords.forEach((keyword) => {
      if (keyword.includes('trust') || keyword.includes('reliable')) {
        selectedColors.push('#2980B9');
      } else if (keyword.includes('innovative') || keyword.includes('modern')) {
        selectedColors.push('#6C5CE7');
      } else if (
        keyword.includes('eco') ||
        keyword.includes('green') ||
        keyword.includes('natural')
      ) {
        selectedColors.push('#27AE60');
      } else if (keyword.includes('luxury') || keyword.includes('premium')) {
        selectedColors.push('#7D3C98');
      } else if (keyword.includes('energy') || keyword.includes('dynamic')) {
        selectedColors.push('#E74C3C');
      }
    });

    // Add secondary colors
    selectedColors.push(...industryData.secondary.slice(0, 2));

    // Remove duplicates and limit to 6 colors
    selectedColors = [...new Set(selectedColors)].slice(0, 6);

    dispatch(
      setPalette({
        colors: selectedColors,
        name: `${industryType.charAt(0).toUpperCase() + industryType.slice(1)} Brand`,
        type: 'brand',
      }),
    );

    dispatch(
      addNotification({
        type: 'success',
        message: 'Brand palette generated',
        details: `${selectedColors.length} brand-appropriate colors`,
      }),
    );
  }, [brandKeywords, industryType, dispatch]);

  // Find smart complements
  const findSmartComplements = useCallback(() => {
    if (!palette.colors || palette.colors.length === 0) {
      dispatch(
        addNotification({
          type: 'error',
          message: 'No colors to complement',
          details: 'Add some colors first',
        }),
      );
      return;
    }

    const complements = [];

    palette.colors.forEach((color) => {
      try {
        const hsl = ColorUtils.hexToHsl(color);

        // Generate complementary color
        const complementHue = (hsl.h + 180) % 360;
        const complement = ColorUtils.hslToHex({
          h: complementHue,
          s: Math.max(20, hsl.s - 10),
          l: hsl.l > 50 ? hsl.l - 20 : hsl.l + 20,
        });

        complements.push(complement);
      } catch {
        // Skip invalid colors
      }
    });

    if (complements.length > 0) {
      dispatch(
        setPalette({
          colors: [...palette.colors, ...complements],
          name: 'Complemented Palette',
          type: 'complementary',
        }),
      );

      dispatch(
        addNotification({
          type: 'success',
          message: 'Complements added',
          details: `${complements.length} complementary colors added`,
        }),
      );
    }
  }, [palette.colors, dispatch]);

  // Enhance palette
  const enhancePalette = useCallback(() => {
    if (!palette.colors || palette.colors.length === 0) {
      dispatch(
        addNotification({
          type: 'error',
          message: 'No palette to enhance',
          details: 'Generate some colors first',
        }),
      );
      return;
    }

    const enhanced = [...palette.colors];

    // Add neutral if missing
    const hasNeutral = palette.colors.some((color) => {
      try {
        const hsl = ColorUtils.hexToHsl(color);
        return hsl.s < 20;
      } catch {
        return false;
      }
    });

    if (!hasNeutral) {
      enhanced.push('#6C757D'); // Add neutral gray
    }

    // Add accent color
    const mainHues = palette.colors.map((color) => {
      try {
        return ColorUtils.hexToHsl(color).h;
      } catch {
        return 0;
      }
    });

    const avgHue = mainHues.reduce((a, b) => a + b, 0) / mainHues.length;
    const accentHue = (avgHue + 120) % 360;
    const accent = ColorUtils.hslToHex({ h: accentHue, s: 70, l: 60 });
    enhanced.push(accent);

    dispatch(
      setPalette({
        colors: enhanced,
        name: 'Enhanced Palette',
        type: 'enhanced',
      }),
    );

    dispatch(
      addNotification({
        type: 'success',
        message: 'Palette enhanced',
        details: 'AI improvements applied',
      }),
    );
  }, [palette.colors, dispatch]);

  return (
    <Card
      title="AI Color Assistant"
      subtitle="Get intelligent color suggestions and analysis"
    >
      <div className="space-y-6">
        {/* Feature Selection */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          {Object.entries(aiFeatures).map(([key, feature]) => (
            <button
              key={key}
              onClick={() => setActiveFeature(key)}
              className={`rounded-lg border p-3 text-left transition-all duration-200 ${
                activeFeature === key
                  ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                  : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40'
              }`}
            >
              <div className="mb-1 flex items-center gap-2">
                <span className="text-lg">{feature.icon}</span>
                <span className="text-sm font-medium">{feature.name}</span>
              </div>
              <p className="text-xs opacity-80">{feature.description}</p>
            </button>
          ))}
        </div>

        {/* Feature Content */}
        <div className="space-y-4">
          {/* Palette Analysis */}
          {activeFeature === 'analyze' && (
            <div className="space-y-4">
              <Button
                onClick={analyzePalette}
                disabled={
                  isAnalyzing || !palette.colors || palette.colors.length === 0
                }
                className="w-full"
              >
                {isAnalyzing ? '🔄 Analyzing...' : '🔍 Analyze Current Palette'}
              </Button>

              {analysisResults && (
                <div className="space-y-3 rounded-lg bg-white/5 p-4">
                  <h4 className="font-medium text-white">Analysis Results</h4>

                  <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                    <div>
                      <span className="text-white/60">Colors</span>
                      <div className="font-medium text-white">
                        {analysisResults.colorCount}
                      </div>
                    </div>
                    <div>
                      <span className="text-white/60">Mood</span>
                      <div className="font-medium capitalize text-white">
                        {analysisResults.mood}
                      </div>
                    </div>
                    <div>
                      <span className="text-white/60">Temperature</span>
                      <div className="font-medium capitalize text-white">
                        {analysisResults.temperature}
                      </div>
                    </div>
                    <div>
                      <span className="text-white/60">Saturation</span>
                      <div className="font-medium text-white">
                        {analysisResults.averageSaturation}%
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="mb-2 font-medium text-white/80">
                      Dominant Hues
                    </h5>
                    <div className="flex gap-2">
                      {analysisResults.dominantHues.map((hue, index) => (
                        <span
                          key={index}
                          className="rounded bg-blue-500/20 px-2 py-1 text-xs capitalize text-blue-300"
                        >
                          {hue}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="mb-2 font-medium text-white/80">
                      AI Suggestions
                    </h5>
                    <ul className="space-y-1">
                      {analysisResults.suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-white/70"
                        >
                          <span className="mt-0.5 text-yellow-400">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mood-Based Colors */}
          {activeFeature === 'mood' && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Describe the mood or feeling
                </label>
                <input
                  type="text"
                  value={colorMoodInput}
                  onChange={(e) => setColorMoodInput(e.target.value)}
                  placeholder="e.g., energetic, calm, professional, creative..."
                  className="w-full rounded border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>

              <Button onClick={generateMoodColors} className="w-full">
                🎭 Generate Mood Colors
              </Button>

              <div>
                <h5 className="mb-2 font-medium text-white/80">
                  Popular Moods
                </h5>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(moodColors).map((mood) => (
                    <button
                      key={mood}
                      onClick={() => {
                        setColorMoodInput(mood);
                        setTimeout(generateMoodColors, 100);
                      }}
                      className="rounded bg-white/10 px-3 py-1 text-sm capitalize text-white/80 transition-colors duration-200 hover:bg-white/20"
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Brand Colors */}
          {activeFeature === 'brand' && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Industry Type
                </label>
                <select
                  value={industryType}
                  onChange={(e) => setIndustryType(e.target.value)}
                  className="w-full rounded border border-white/20 bg-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  {Object.keys(industryColors).map((industry) => (
                    <option
                      key={industry}
                      value={industry}
                      className="bg-gray-800 capitalize"
                    >
                      {industry}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Brand Keywords
                </label>
                <input
                  type="text"
                  value={brandKeywords}
                  onChange={(e) => setBrandKeywords(e.target.value)}
                  placeholder="e.g., trustworthy, innovative, eco-friendly, luxury..."
                  className="w-full rounded border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>

              <Button onClick={generateBrandColors} className="w-full">
                🏢 Generate Brand Colors
              </Button>
            </div>
          )}

          {/* Smart Complements */}
          {activeFeature === 'complement' && (
            <div className="space-y-4">
              <p className="text-sm text-white/70">
                Add intelligent complementary colors to your existing palette
                for better balance and visual interest.
              </p>

              <Button
                onClick={findSmartComplements}
                disabled={!palette.colors || palette.colors.length === 0}
                className="w-full"
              >
                🧠 Find Smart Complements
              </Button>
            </div>
          )}

          {/* Palette Enhancement */}
          {activeFeature === 'enhance' && (
            <div className="space-y-4">
              <p className="text-sm text-white/70">
                Let AI analyze your palette and suggest improvements like adding
                neutral colors, accent colors, or adjusting harmony.
              </p>

              <Button
                onClick={enhancePalette}
                disabled={!palette.colors || palette.colors.length === 0}
                className="w-full"
              >
                ✨ Enhance Palette
              </Button>
            </div>
          )}
        </div>

        {/* AI Tips */}
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-4">
          <h5 className="mb-2 flex items-center font-medium text-indigo-300">
            <span className="mr-2">🤖</span>
            AI Color Tips
          </h5>
          <ul className="space-y-1 text-sm text-indigo-200/80">
            <li>• Be specific with mood descriptions for better results</li>
            <li>• Combine multiple AI features for comprehensive palettes</li>
            <li>
              • Use brand keywords that reflect your values and personality
            </li>
            <li>• Test AI suggestions with accessibility checking</li>
            <li>• Save successful AI-generated palettes to your library</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}

export default AIColorAssistant;
