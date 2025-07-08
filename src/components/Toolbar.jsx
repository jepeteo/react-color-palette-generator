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
      <div className="modern-toolbar">
        <button
          onClick={() => setIsLibraryOpen(true)}
          className="toolbar-btn"
          title="Palette Library"
        >
          <BsCollection className="toolbar-icon" />
        </button>

        <div className="toolbar-divider" />

        <button
          onClick={() => handleExport(palette, 'json')}
          className="toolbar-btn"
          title="Export as JSON"
        >
          <BsFiletypeJson className="toolbar-icon" />
        </button>

        <button
          onClick={() => handleExport(palette, 'css')}
          className="toolbar-btn"
          title="Export as CSS"
        >
          <BsFiletypeCss className="toolbar-icon" />
        </button>

        <button
          onClick={() => handleExport(palette, 'scss')}
          className="toolbar-btn"
          title="Export as SCSS"
        >
          <BsFiletypeScss className="toolbar-icon" />
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
