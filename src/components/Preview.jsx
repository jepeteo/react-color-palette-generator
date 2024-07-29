// src/components/Preview.js
import React from 'react';

function Preview({ palette }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <h2 className="containerTitle">Real-time Preview</h2>
      <div
        className="rounded-lg border p-4"
        style={{ backgroundColor: palette.background }}
      >
        <header className="mb-4" style={{ backgroundColor: palette.primary }}>
          <h1
            className="p-2 text-2xl font-bold"
            style={{ color: palette.text }}
          >
            Website Header
          </h1>
        </header>

        <nav className="mb-4">
          <ul className="flex space-x-4">
            {['Home', 'About', 'Services', 'Contact'].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="hover:underline"
                  style={{ color: palette.secondary }}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <main>
          <h2
            className="mb-2 text-xl font-semibold"
            style={{ color: palette.text }}
          >
            Welcome to our website
          </h2>
          <p className="mb-4" style={{ color: palette.text }}>
            This is a sample paragraph to demonstrate how the text looks with
            the selected color palette. It's important to ensure good
            readability and contrast.
          </p>

          <button
            className="rounded px-4 py-2"
            style={{
              backgroundColor: palette.accent,
              color: palette.background,
            }}
          >
            Call to Action
          </button>
        </main>

        <footer
          className="mt-4 border-t pt-2"
          style={{ borderColor: palette.secondary }}
        >
          <p className="text-sm" style={{ color: palette.text }}>
            © 2024 Color Palette Generator. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Preview;
