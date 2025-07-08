import React, { useState } from 'react';
import exportPalette from '../utils/exportColors';
import { BsFiletypeCss, BsFiletypeScss, BsFiletypeJson, BsCollection } from 'react-icons/bs';
import PaletteLibraryPopup from './PaletteLibraryPopup';

const handleExport = (currentPalette, format) => {
  try {
    exportPalette(currentPalette, format);
  } catch (error) {
    console.error('Export failed:', error);
  }
};

const Toolbar = ({ palette }) => {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  return (
    <>
      <div className="absolute bottom-8 right-8 flex flex-row items-center gap-2 rounded-md border border-gray-300 bg-gray-100 p-2 shadow-md">
        <button
          onClick={() => setIsLibraryOpen(true)}
          className="rounded"
        >
          <BsCollection
            className="toolbar-icon"
            aria-label="Open Palette Library"
            title="Palette Library"
          />
        </button>
        <div className="h-6 w-px bg-gray-300" />
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

      <PaletteLibraryPopup
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
      />
    </>
  );
};

export default Toolbar;
