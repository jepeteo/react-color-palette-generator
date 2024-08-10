import React, { useState, useMemo, useCallback } from 'react';
import { Tooltip } from 'react-tooltip';
import { getAccessibilityInfo } from '../utils/accessibilityUtils';
import ColorSelector from './ColorSelector';
import { useDispatch, useSelector } from 'react-redux';
import { elements } from './Preview';
import { updateElementColor } from '../store/colorSlice';
import { shallowEqual } from 'react-redux';

const ElementColorList = React.memo(({ elements }) => {
  const dispatch = useDispatch();
  const colors = useSelector((state) => state.color.colors);
  const palette = useSelector((state) => state.color.palette);
  const [selectedElement, setSelectedElement] = useState(null);

  const calculateAccessibilityScore = (colors, palette) => {
    const relevantChecks = [
      { text: colors.paragraphText, background: palette.background },
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
    <div className="colorListElements">
      <div className="containerTitle mb-4">Detailed Color List</div>
      <div className="mb-4 rounded bg-gray-100 p-2">
        <p className="font-bold">
          Accessibility Score: {accessibilityScore.toFixed(2)}%
        </p>
        <p className="text-sm">
          {accessibilityScore >= 90
            ? 'Excellent'
            : accessibilityScore >= 70
              ? 'Good'
              : accessibilityScore >= 50
                ? 'Fair'
                : 'Poor'}{' '}
          accessibility
        </p>
      </div>
      <ul className="space-y-1.5">
        {Object.entries(elements).map(([key, label]) => {
          const color = colors[key];
          let contrastColor;

          if (key === 'background') {
            contrastColor = colors.paragraphText;
          } else if (key === 'buttonText') {
            contrastColor = colors.buttonBackground;
          } else if (key === 'inputBackground') {
            contrastColor = colors.inputText;
          } else if (key === 'navText') {
            contrastColor = colors.navBackground;
          } else {
            contrastColor = colors.background;
          }
          const accessibilityInfo = getAccessibilityInfo(color, contrastColor);

          console.log(
            'Rendering ElementColorList, selectedElement:',
            selectedElement,
          );

          return (
            <li key={key} className="grid grid-cols-12 items-center">
              <span className="col-span-7 text-sm">{label}</span>
              <span className="col-span-3 ml-auto text-right text-sm uppercase">
                {colors[key] || 'Not set'}
              </span>
              <div
                className="col-span-1 ml-auto h-5 w-5 cursor-pointer rounded-full border"
                style={{ backgroundColor: colors[key] || '#ccc' }}
                onClick={(event) => handleElementClick(event, key)}
              ></div>
              <div
                className="col-span-1 ml-2 cursor-help text-sm"
                data-tooltip-id={`tooltip-${key}`}
                data-tooltip-content={`Contrast: ${accessibilityInfo.contrast.toFixed(2)} | AA: ${accessibilityInfo.aa ? '✅' : '❌'} `}
              >
                {accessibilityInfo.aa ? '✅' : '❌'}
              </div>

              <Tooltip id={`tooltip-${key}`} />
            </li>
          );
        })}
      </ul>
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
