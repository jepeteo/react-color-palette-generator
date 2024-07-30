// src/components/Preview.js
import React from 'react';
import chroma from 'chroma-js';

function Preview({ palette }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <h2 className="containerTitle">Real-time Preview</h2>
      <div
        className="overflow-hidden rounded-lg border"
        style={{ backgroundColor: palette.background }}
      >
        <header className="p-4" style={{ backgroundColor: palette.primary }}>
          <h1 className="text-2xl font-bold" style={{ color: palette.text }}>
            Website Header
          </h1>
        </header>

        <nav className="p-2" style={{ backgroundColor: palette.secondary }}>
          <ul className="flex space-x-4">
            {['Home', 'About', 'Services', 'Contact'].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="hover:underline"
                  style={{ color: palette.background }}
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
            style={{ color: palette.primary }}
          >
            Welcome to our website
          </h1>
          <h2
            className="mb-3 text-2xl font-semibold"
            style={{ color: palette.secondary }}
          >
            Subheading
          </h2>
          <p className="mb-4 text-base" style={{ color: palette.text }}>
            This is a paragraph of text demonstrating the body copy style. It's
            important to ensure good readability and contrast with the
            background color.
          </p>
          <a
            href="#"
            className="text-lg font-medium"
            style={{ color: palette.accent }}
          >
            This is a link
          </a>
          <blockquote
            className="my-4 border-l-4 pl-4 italic"
            style={{ borderColor: palette.secondary, color: palette.text }}
          >
            "This is a blockquote to demonstrate how quoted text might appear
            with the selected color palette."
          </blockquote>
          <ul
            className="mb-4 list-inside list-disc"
            style={{ color: palette.text }}
          >
            <li>First list item</li>
            <li>Second list item</li>
            <li>Third list item</li>
          </ul>

          <button
            className="rounded px-4 py-2 transition-colors duration-200 ease-in-out"
            style={{
              backgroundColor: palette.accent,
              color: palette.background,
              ':hover': {
                backgroundColor: chroma(palette.accent).darken(0.2).hex(),
              },
            }}
          >
            Call to Action
          </button>

          <form className="mt-4">
            <input
              type="text"
              placeholder="Enter your email"
              className="mr-2 rounded px-3 py-2"
              style={{
                backgroundColor: palette.background,
                color: palette.text,
                border: `1px solid ${palette.secondary}`,
              }}
            />
            <button
              type="submit"
              className="rounded px-4 py-2 transition-colors duration-200 ease-in-out"
              style={{
                backgroundColor: palette.secondary,
                color: palette.background,
                ':hover': {
                  backgroundColor: chroma(palette.secondary).darken(0.2).hex(),
                },
              }}
            >
              Subscribe
            </button>
          </form>
        </main>

        <footer
          className="p-2 text-sm"
          style={{ backgroundColor: palette.primary, color: palette.text }}
        >
          © 2023 Color Palette Generator. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default Preview;
