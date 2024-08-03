import React, { useState, useEffect } from 'react';
// import chroma from 'chroma-js';
import ColorSelector from './ColorSelector';
import ElementColorList from './ElementColorList';

export const elements = {
  background: 'Background',
  headerBackground: 'Header Background',
  headerText: 'Header Text',
  navBackground: 'Navigation Background',
  navText: 'Navigation Text',
  heading1: 'Heading 1',
  heading2: 'Heading 2',
  paragraphText: 'Paragraph Text',
  linkText: 'Link Text',
  blockquoteBorder: 'Blockquote Border',
  blockquoteText: 'Blockquote Text',
  listText: 'List Text',
  buttonBackground: 'Button Background',
  buttonText: 'Button Text',
  inputBackground: 'Input Background',
  inputText: 'Input Text',
  inputBorder: 'Input Border',
  footerBackground: 'Footer Background',
  footerText: 'Footer Text',
};

export const getElementColor = (element, palette, customColors) => {
  if (!palette) return '#369';
  const defaultColors = {
    background: palette.background,
    headerBackground: palette.primary,
    headerText: palette.text,
    navBackground: palette.secondary,
    navText: palette.background,
    heading1: palette.primary,
    heading2: palette.secondary,
    paragraphText: palette.text,
    linkText: palette.accent,
    blockquoteBorder: palette.secondary,
    blockquoteText: palette.text,
    listText: palette.text,
    buttonBackground: palette.accent,
    buttonText: palette.background,
    inputBackground: palette.background,
    inputText: palette.text,
    inputBorder: palette.secondary,
    footerBackground: palette.primary,
    footerText: palette.text,
  };

  return customColors[element] || defaultColors[element] || palette.primary;
};

export const handleElementClick = (element, callback) => {
  if (callback) callback(element);
};

function Preview({ palette }) {
  const [selectedElement, setSelectedElement] = useState(null);
  const [customColors, setCustomColors] = useState({});

  useEffect(() => {
    setCustomColors({});
  }, [palette]);

  const handleColorSelect = (color) => {
    if (selectedElement) {
      setCustomColors((prevColors) => ({
        ...prevColors,
        [selectedElement]: color,
      }));
      setSelectedElement(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <h2 className="containerTitle">Real-time Preview</h2>
      <div
        className="overflow-hidden rounded-lg border"
        onClick={() => handleElementClick('background', setSelectedElement)}
        style={{
          backgroundColor: getElementColor('background', palette, customColors),
        }}
      >
        <header
          className="p-4"
          onClick={(e) => {
            e.stopPropagation();
            handleElementClick('headerBackground', setSelectedElement);
          }}
          style={{
            backgroundColor: getElementColor(
              'headerBackground',
              palette,
              customColors,
            ),
          }}
        >
          <h1
            className="text-2xl font-bold"
            onClick={(e) => {
              e.stopPropagation();
              handleElementClick('headerText', setSelectedElement);
            }}
            style={{
              color: getElementColor('headerText', palette, customColors),
            }}
          >
            Website Header
          </h1>
        </header>

        <nav
          className="p-2"
          onClick={(e) => {
            e.stopPropagation();
            handleElementClick('navBackground', setSelectedElement);
          }}
          style={{
            backgroundColor: getElementColor(
              'navBackground',
              palette,
              customColors,
            ),
          }}
        >
          <ul className="flex space-x-4">
            {['Home', 'About', 'Services', 'Contact'].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleElementClick('navText', setSelectedElement);
                  }}
                  style={{
                    color: getElementColor('navText', palette, customColors),
                  }}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <main className="p-4">
          <h1
            className="mb-4 text-4xl font-bold"
            onClick={(e) => {
              e.stopPropagation();
              handleElementClick('heading1', setSelectedElement);
            }}
            style={{
              color: getElementColor('heading1', palette, customColors),
            }}
          >
            Welcome to our website
          </h1>
          <h2
            className="mb-3 text-2xl font-semibold"
            onClick={(e) => {
              e.stopPropagation();
              handleElementClick('heading2', setSelectedElement);
            }}
            style={{
              color: getElementColor('heading2', palette, customColors),
            }}
          >
            Subheading
          </h2>
          <p
            className="mb-4 text-base"
            onClick={(e) => {
              e.stopPropagation();
              handleElementClick('paragraphText', setSelectedElement);
            }}
            style={{
              color: getElementColor('paragraphText', palette, customColors),
            }}
          >
            This is a paragraph of text demonstrating the body copy style. It's
            important to ensure good readability and contrast with the
            background color.
          </p>
          <a
            href="#"
            className="text-lg font-medium"
            onClick={(e) => {
              e.stopPropagation();
              handleElementClick('linkText', setSelectedElement);
            }}
            style={{
              color: getElementColor('linkText', palette, customColors),
            }}
          >
            This is a link
          </a>
          <blockquote
            className="my-4 border-l-4 pl-4 italic"
            onClick={(e) => {
              e.stopPropagation();
              handleElementClick('blockquoteText', setSelectedElement);
            }}
            style={{
              borderColor: getElementColor(
                'blockquoteBorder',
                palette,
                customColors,
              ),
              color: getElementColor('blockquoteText', palette, customColors),
            }}
          >
            "This is a blockquote to demonstrate how quoted text might appear
            with the selected color palette."
          </blockquote>
          <ul
            className="mb-4 list-inside list-disc"
            onClick={(e) => {
              e.stopPropagation();
              handleElementClick('listText', setSelectedElement);
            }}
            style={{
              color: getElementColor('listText', palette, customColors),
            }}
          >
            <li>First list item</li>
            <li>Second list item</li>
            <li>Third list item</li>
          </ul>

          <button
            className="rounded px-4 py-2 transition-colors duration-200 ease-in-out"
            onClick={(e) => {
              e.stopPropagation();
              handleElementClick('buttonBackground', setSelectedElement);
            }}
            style={{
              backgroundColor: getElementColor(
                'buttonBackground',
                palette,
                customColors,
              ),
              color: getElementColor('buttonText', palette, customColors),
            }}
          >
            Call to Action
          </button>

          <form className="mt-4">
            <input
              type="text"
              placeholder="Enter your email"
              className="mr-2 rounded px-3 py-2"
              onClick={(e) => {
                e.stopPropagation();
                handleElementClick('inputBackground', setSelectedElement);
              }}
              style={{
                backgroundColor: getElementColor(
                  'inputBackground',
                  palette,
                  customColors,
                ),
                color: getElementColor('inputText', palette, customColors),
                border: `1px solid ${getElementColor('inputBorder', palette, customColors)}})}`,
              }}
            />
            <button
              type="submit"
              className="rounded px-4 py-2 transition-colors duration-200 ease-in-out"
              onClick={(e) => {
                e.stopPropagation();
                handleElementClick('buttonBackground', setSelectedElement);
              }}
              style={{
                backgroundColor: getElementColor(
                  'buttonBackground',
                  palette,
                  customColors,
                ),
                color: getElementColor('buttonText', palette, customColors),
              }}
            >
              Subscribe
            </button>
          </form>
        </main>

        <footer
          className="p-2 text-sm"
          onClick={(e) => {
            e.stopPropagation();
            handleElementClick('footerBackground', setSelectedElement);
          }}
          style={{
            backgroundColor: getElementColor('footerBackground'),
            color: getElementColor('footerText'),
          }}
        >
          © 2024 Color Palette Generator. All rights reserved.
        </footer>
      </div>
      {selectedElement && (
        <ColorSelector
          palette={palette}
          onSelect={handleColorSelect}
          onClose={() => setSelectedElement(null)}
          selectedElement={selectedElement}
        />
      )}
    </div>
  );
  elements, getElementColor;
}

export default Preview;
