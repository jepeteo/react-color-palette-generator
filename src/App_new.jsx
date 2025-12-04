import React, { useState } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store } from './store';
import Card from './components/ui/Card';
import ColorGenerator from './components/features/ColorGenerator/ColorGenerator';
import ImageUpload from './components/features/ImageUpload/ImageUpload';
import PalettePreview from './components/features/PalettePreview/PalettePreview';
import PaletteManager from './components/features/PaletteManager/PaletteManager';
import AccessibilityChecker from './components/features/AccessibilityChecker/AccessibilityChecker';
import ExportTools from './components/features/ExportTools/ExportTools';
import PaletteLibrary from './components/features/PaletteLibrary/PaletteLibrary';
import PaletteSharing from './components/features/PaletteSharing/PaletteSharing';
import { useAccessibility } from './hooks/useAccessibility';
import { useUrlSharing } from './hooks/useUrlSharing';
import { selectPalette } from './store/slices/paletteSlice';
import {
  selectNotifications,
  dismissNotification,
} from './store/slices/uiSlice';

// Main Palette Generator Component
const PaletteGeneratorApp = () => {
  const dispatch = useDispatch();
  const palette = useSelector(selectPalette);
  const notifications = useSelector(selectNotifications);

  const { checkContrast } = useAccessibility();
  useUrlSharing(); // Initialize URL sharing functionality

  const [activeTab, setActiveTab] = useState('generate');

  // Tab configuration
  const tabs = [
    {
      id: 'generate',
      label: 'Generate',
      icon: '🎨',
      component: ColorGenerator,
    },
    { id: 'upload', label: 'Extract', icon: '📁', component: ImageUpload },
    { id: 'preview', label: 'Preview', icon: '👁️', component: PalettePreview },
    { id: 'manage', label: 'Manage', icon: '⚙️', component: PaletteManager },
    {
      id: 'accessibility',
      label: 'A11y',
      icon: '♿',
      component: AccessibilityChecker,
    },
    { id: 'export', label: 'Export', icon: '📦', component: ExportTools },
    { id: 'library', label: 'Library', icon: '📚', component: PaletteLibrary },
    { id: 'share', label: 'Share', icon: '🔗', component: PaletteSharing },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed right-4 top-4 z-50 space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`max-w-sm rounded-lg border p-4 shadow-lg backdrop-blur-sm transition-all duration-300 ${
                notification.type === 'success'
                  ? 'border-green-500/40 bg-green-500/20 text-green-100'
                  : notification.type === 'error'
                    ? 'border-red-500/40 bg-red-500/20 text-red-100'
                    : notification.type === 'warning'
                      ? 'border-yellow-500/40 bg-yellow-500/20 text-yellow-100'
                      : 'border-blue-500/40 bg-blue-500/20 text-blue-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium">{notification.message}</p>
                  {notification.details && (
                    <p className="mt-1 text-xs opacity-80">
                      {notification.details}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => dispatch(dismissNotification(notification.id))}
                  className="ml-3 text-current opacity-60 transition-opacity hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-white">
            Color Palette Generator
          </h1>
          <p className="text-white/70">
            Create beautiful, accessible color palettes with AI-powered
            suggestions
          </p>
        </header>

        {/* Quick Palette Overview */}
        {palette.colors && palette.colors.length > 0 && (
          <div className="mb-6">
            <Card title="Current Palette" className="overflow-hidden">
              <div className="-m-4 flex h-16">
                {palette.colors.map((color, index) => (
                  <div
                    key={index}
                    className="group relative flex-1 cursor-pointer transition-all duration-200 hover:z-10 hover:scale-105"
                    style={{ backgroundColor: color }}
                    onClick={() => navigator.clipboard.writeText(color)}
                    title={`${color} - Click to copy`}
                  >
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/10" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <span className="rounded bg-black/50 px-2 py-1 text-xs font-medium text-white">
                        Copy
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex justify-center">
            <div className="flex flex-wrap gap-1 rounded-lg border border-white/20 bg-white/10 p-1 backdrop-blur-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="mx-auto max-w-7xl">
          {activeTab === 'generate' || activeTab === 'upload' ? (
            // Generator Layout: Settings on Left, Preview on Right
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="space-y-6">
                {activeTab === 'generate' && <ColorGenerator />}
                {activeTab === 'upload' && <ImageUpload />}
                <PaletteManager />
              </div>
              <div>
                <PalettePreview />
              </div>
            </div>
          ) : (
            // Other tabs: Full width
            <div className="mx-auto max-w-4xl">
              {activeTab === 'preview' && <PalettePreview />}
              {activeTab === 'manage' && <PaletteManager />}
              {activeTab === 'accessibility' && <AccessibilityChecker />}
              {activeTab === 'export' && <ExportTools />}
              {activeTab === 'library' && <PaletteLibrary />}
              {activeTab === 'share' && <PaletteSharing />}
            </div>
          )}
        </div>

        {/* Footer Stats */}
        {palette.colors && palette.colors.length > 0 && (
          <footer className="mt-8 text-center">
            <Card className="inline-block">
              <div className="flex items-center gap-6 text-sm">
                <div className="text-white/70">
                  <span className="font-medium text-white">
                    {palette.colors.length}
                  </span>{' '}
                  colors
                </div>
                <div className="text-white/70">
                  Harmony:{' '}
                  <span className="font-medium text-white">
                    {palette.harmonyType || 'Complementary'}
                  </span>
                </div>
                {palette.colors.length > 1 && (
                  <div className="text-white/70">
                    Contrast:{' '}
                    <span className="font-medium text-white">
                      {checkContrast(
                        palette.colors[0],
                        palette.colors[1],
                      ).toFixed(1)}
                      :1
                    </span>
                  </div>
                )}
                <div className="text-white/70">
                  Generated:{' '}
                  <span className="font-medium text-white">
                    {new Date(
                      palette.timestamp || Date.now(),
                    ).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </Card>
          </footer>
        )}
      </div>
    </div>
  );
};

// Main App component with Provider
const App = () => {
  return (
    <Provider store={store}>
      <PaletteGeneratorApp />
    </Provider>
  );
};

export default App;
