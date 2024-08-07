import React from 'react';
import { Tooltip } from 'react-tooltip';
import { getAccessibilityInfo } from '../utils/accessibilityUtils';

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

  const totalChecks = relevantChecks.length * 2; // AA and AAA for each combination
  let passedChecks = 0;

  relevantChecks.forEach(({ text, background }) => {
    const { aa, aaa } = getAccessibilityInfo(text, background);
    if (aa) passedChecks++;
    if (aaa) passedChecks++;
  });

  return (passedChecks / totalChecks) * 100;
};
const ElementColorList = ({ elements, colors, palette, onElementClick }) => {
  const accessibilityScore = calculateAccessibilityScore(colors, palette);

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
            contrastColor = palette.background;
          }

          const accessibilityInfo = getAccessibilityInfo(color, contrastColor);

          return (
            <li key={key} className="grid grid-cols-12 items-center">
              <span className="col-span-7 text-sm">{label}</span>
              <span className="col-span-3 ml-auto text-right text-sm uppercase">
                {colors[key] || 'Not set'}
              </span>
              <div
                className="col-span-1 ml-auto h-5 w-5 cursor-pointer rounded-full border"
                style={{ backgroundColor: colors[key] || '#ccc' }}
                onClick={() => onElementClick(key)}
              ></div>
              <div
                className="col-span-1 ml-2 cursor-help text-sm"
                data-tooltip-id={`tooltip-${key}`}
                data-tooltip-content={`Contrast: ${accessibilityInfo.contrast.toFixed(2)} | AA: ${accessibilityInfo.aa ? '✅' : '❌'} | AAA: ${accessibilityInfo.aaa ? '✅' : '❌'}`}
              >
                {accessibilityInfo.aa ? '✅' : '❌'}
              </div>
              <Tooltip id={`tooltip-${key}`} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ElementColorList;
