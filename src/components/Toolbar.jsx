import React from 'react';
import exportPalette from '../utils/exportColors';
import { BsFiletypeCss, BsFiletypeScss, BsFiletypeJson } from 'react-icons/bs';

const handleExport = (currentPalette, format) => {
  try {
    exportPalette(currentPalette, format);
  } catch (error) {
    console.error('Export failed:', error);
  }
};

const Toolbar = ({ palette }) => {
  return (
    <div className="absolute bottom-8 right-8 flex flex-row items-center gap-2 rounded-md border border-gray-300 bg-gray-100 p-2 shadow-md">
      <button onClick={() => handleExport(palette, 'json')}>
        <BsFiletypeJson
          className="toolbar-icon"
          aria-label="Export as JSON"
          title="Export as JSON"
        />
      </button>
      <button onClick={() => handleExport(palette, 'css')}>
        <BsFiletypeCss
          className="toolbar-icon"
          aria-label="Export as CSS"
          title="Export as CSS"
        />
      </button>
      <button onClick={() => handleExport(palette, 'scss')}>
        <BsFiletypeScss
          className="toolbar-icon"
          aria-label="Export as SCSS"
          title="Export as SCSS"
        />
      </button>
    </div>
  );
};

export default Toolbar;
