import React, { useState, useMemo, useCallback } from 'react';
import { Tooltip } from 'react-tooltip';
import { getAccessibilityInfo } from '../utils/accessibilityUtils';
import ColorSelector from './ColorSelector';
import { useDispatch, useSelector } from 'react-redux';
import { updateElementColor } from '../store/colorSlice';

const ElementColorList = React.memo(({ elements }) => {
  const dispatch = useDispatch();
  const colors = useSelector((state) => state.color.colors);
  const palette = useSelector((state) => state.color.palette);
  const [selectedElement, setSelectedElement] = useState(null);

  const calculateAccessibilityScore = (colors, palette) => {
    const relevantChecks = [
      { text: colors.paragraphText, background: colors.background },
      { text: colors.headerText, background: colors.headerBackground },
      { text: colors.navText, background: colors.navBackground },
      { text: colors.heading1, background: colors.background },
      { text: colors.heading2, background: colors.background },
      { text: colors.linkText, background: colors.background },
      { text: colors.blockquoteText, background: colors.background },
      { text: colors.listText, background: colors.background },
      { text: colors.buttonText, background: colors.buttonBackground },
      { text: colors.footerText, background: colors.footerBackground },
    ];
    const totalChecks = relevantChecks.length;
    let passedChecks = 0;

    relevantChecks.forEach(({ text, background }) => {
      const { aa } = getAccessibilityInfo(text, background);
      if (aa) passedChecks++;
    });

    return (passedChecks / totalChecks) * 100;
  };

  const accessibilityScore = useMemo(
    () => calculateAccessibilityScore(colors, palette),
    [colors, palette],
  );

  const handleElementClick = useCallback((event, element) => {
    event.stopPropagation();
    setSelectedElement(element);
  }, []);

  const onColorUpdate = (element, color) => {
    console.log('onColorUpdate called with:', element, color);

    dispatch(updateElementColor({ element, color }));
  };

  return (
    <div className="glass-card">
      <h3 className="section-title mb-4">Detailed Color List</h3>

      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white/80">Accessibility Score</span>
          <span className={`text-lg font-bold ${accessibilityScore >= 90 ? 'text-green-400' :
              accessibilityScore >= 70 ? 'text-yellow-400' :
                accessibilityScore >= 50 ? 'text-orange-400' :
                  'text-red-400'
            }`}>
            {accessibilityScore.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${accessibilityScore >= 90 ? 'bg-green-400' :
                accessibilityScore >= 70 ? 'bg-yellow-400' :
                  accessibilityScore >= 50 ? 'bg-orange-400' :
                    'bg-red-400'
              }`}
            style={{ width: `${accessibilityScore}%` }}
          />
        </div>
        <p className="text-xs text-white/60 mt-2">
          {accessibilityScore >= 90
            ? 'Excellent accessibility'
            : accessibilityScore >= 70
              ? 'Good accessibility'
              : accessibilityScore >= 50
                ? 'Fair accessibility'
                : 'Poor accessibility'}
        </p>
      </div>

      <div className="space-y-2">
        {Object.entries(elements).map(([key, label]) => {
          const color = colors[key];
          let contrastColor;

          if (key === 'background') {
            contrastColor = colors.paragraphText;
          } else if (key === 'headerText') {
            contrastColor = colors.headerBackground;
          } else if (key === 'navText') {
            contrastColor = colors.navBackground;
          } else if (key === 'heading1Text') {
            contrastColor = colors.background;
          } else if (key === 'heading2Text') {
            contrastColor = colors.background;
          } else if (key === 'linkText') {
            contrastColor = colors.background;
          } else if (key === 'blockquoteText') {
            contrastColor = colors.background;
          } else if (key === 'listText') {
            contrastColor = colors.background;
          } else if (key === 'buttonText') {
            contrastColor = colors.buttonBackground;
          } else if (key === 'footerText') {
            contrastColor = colors.footerBackground;
          } else if (key === 'inputBackground') {
            contrastColor = colors.inputText;
          } else {
            contrastColor = colors.background;
          }
          const accessibilityInfo = getAccessibilityInfo(color, contrastColor);

          return (
            <div key={key} className="flex items-center p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-white/90 truncate block">{label}</span>
                <span className="text-xs text-white/60 font-mono">{colors[key] || 'Not set'}</span>
              </div>

              <div className="flex items-center gap-3 ml-4">
                <div
                  className="w-8 h-8 rounded-lg border-2 border-white/20 cursor-pointer hover:border-white/40 hover:scale-105 transition-all shadow-lg"
                  style={{ backgroundColor: colors[key] || '#ccc' }}
                  onClick={(event) => handleElementClick(event, key)}
                  title={`Click to change ${label} color`}
                />

                <div
                  className="cursor-help text-lg hover:scale-110 transition-transform"
                  data-tooltip-id={`tooltip-${key}`}
                  data-tooltip-content={`Contrast: ${accessibilityInfo.contrast.toFixed(2)} | AA: ${accessibilityInfo.aa ? '✅' : '❌'} `}
                >
                  {accessibilityInfo.aa ? '✅' : '❌'}
                </div>
              </div>

              <Tooltip id={`tooltip-${key}`} />
            </div>
          );
        })}
      </div>

      {selectedElement && (
        <ColorSelector
          palette={palette}
          onSelect={(color) => {
            onColorUpdate(selectedElement, color);
            setSelectedElement(null);
          }}
          onClose={() => setSelectedElement(null)}
          selectedElement={selectedElement}
        />
      )}
    </div>
  );
});

export default ElementColorList;
