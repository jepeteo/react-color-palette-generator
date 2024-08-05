import React from 'react';
import { getAccessibilityInfo } from '../utils/accessibilityUtils';

const ElementColorList = ({ elements, colors, palette, onElementClick }) => {
  return (
    <div className="colorListElements">
      <div className="containerTitle mb-4">Detailed Color List</div>
      <ul className="space-y-1.5">
        {Object.entries(elements).map(([key, label]) => {
          const color = colors[key];
          const accessibilityInfo = getAccessibilityInfo(
            color,
            palette.background,
          );
          return (
            <li key={key} className="grid grid-cols-12 items-center">
              <span className="col-span-8 text-sm">{label}</span>
              <span className="col-span-3 ml-auto text-right text-sm uppercase">
                {colors[key] || 'Not set'}
              </span>
              <div
                className="col-span-1 ml-auto h-5 w-5 cursor-pointer rounded-full border"
                style={{ backgroundColor: colors[key] || '#ccc' }}
                onClick={() => onElementClick(key)}
              ></div>
              <div className="col-span-2 ml-2 text-sm">
                {accessibilityInfo.aa ? '✅' : '❌'} AA
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ElementColorList;
