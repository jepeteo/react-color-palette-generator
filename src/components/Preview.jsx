import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateElementColor } from '../store/colorSlice';
import ColorSelector from './ColorSelector';

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
  if (!palette) return '#336699';
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

function Preview() {
  const palette = useSelector((state) => state.color.palette);
  const colors = useSelector((state) => state.color.colors);
  const [selectedElement, setSelectedElement] = useState(null);
  const [customColors, setCustomColors] = useState({});

  useEffect(() => {
    setCustomColors({});
  }, [palette]);

  const dispatch = useDispatch();
  const handleColorSelect = (color) => {
    if (selectedElement) {
      dispatch(updateElementColor({ element: selectedElement, color }));
      setSelectedElement(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <h2 className="containerTitle">Real-time Preview</h2>
      <div
        className="overflow-hidden rounded-lg border"
        onClick={() => handleElementClick('background', setSelectedElement)}
        style={{ backgroundColor: colors.background }}
      >
        <header
          className="p-4"
          onClick={(e) => {
            e.stopPropagation();
            handleElementClick('headerBackground', setSelectedElement);
          }}
          style={{ backgroundColor: colors.headerBackground }}
        >
          <h1
            className="text-2xl font-bold"
            onClick={(e) => {
              e.stopPropagation();
              handleElementClick('headerText', setSelectedElement);
            }}
            style={{ color: colors.headerText }}
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
            backgroundColor: getElementColor('navBackground', palette, colors),
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
                  style={{ color: colors.navText }}
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
            style={{ color: colors.heading1 }}
          >
            Welcome to our website
          </h1>
          <h2
            className="mb-3 text-2xl font-semibold"
            onClick={(e) => {
              e.stopPropagation();
              handleElementClick('heading2', setSelectedElement);
            }}
            style={{ color: colors.heading2 }}
          >
            Subheading
          </h2>
          <p
            className="mb-4 text-base"
            onClick={(e) => {
              e.stopPropagation();
              handleElementClick('paragraphText', setSelectedElement);
            }}
            style={{ color: colors.paragraphText }}
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
            style={{ color: colors.linkText }}
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
              borderColor: colors.blockquoteBorder,
              color: colors.blockquoteText,
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
            style={{ color: colors.listText }}
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
              backgroundColor: colors.footerBackground,
              color: colors.buttonText,
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
                backgroundColor: colors.inputBackground,
                color: colors.inputText,
                border: `1px solid ${colors.inputBorder}`,
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
                backgroundColor: colors.buttonBackground,
                color: colors.buttonText,
              }}
            >
              Subscribe
            </button>
          </form>
        </main>

        <footer
          className="p-4 text-sm"
          onClick={(e) => {
            e.stopPropagation();
            handleElementClick('footerBackground', setSelectedElement);
          }}
          style={{ backgroundColor: colors.footerBackground }}
        >
          <div
            className="mb"
            onClick={(e) => {
              e.stopPropagation();
              handleElementClick('footerText', setSelectedElement);
            }}
            style={{ color: colors.footerText }}
          >
            © 2024 Color Palette Generator. All rights reserved.
          </div>
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
