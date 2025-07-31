import React, { useState } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store } from './store';
import Card from './components/ui/Card';
import Button from './components/ui/Button';
import ColorPicker from './components/ui/ColorPicker';
import ColorGenerator from './components/features/ColorGenerator/ColorGenerator';
import ImageUpload from './components/features/ImageUpload/ImageUpload';
import PalettePreview from './components/features/PalettePreview/PalettePreview';
import PaletteManager from './components/features/PaletteManager/PaletteManager';
import AccessibilityChecker from './components/features/AccessibilityChecker/AccessibilityChecker';
import ExportTools from './components/features/ExportTools/ExportTools';
import PaletteLibrary from './components/features/PaletteLibrary/PaletteLibrary';
import PaletteSharing from './components/features/PaletteSharing/PaletteSharing';
import { useColorPalette } from './hooks/useColorPalette';
import { useAccessibility } from './hooks/useAccessibility';
import { useUrlSharing } from './hooks/useUrlSharing';
import { selectPalette, selectPrimaryColor } from './store/slices/paletteSlice';
import { selectTheme } from './store/slices/settingsSlice';
import {
  selectNotifications,
  dismissNotification,
} from './store/slices/uiSlice';

// Main Palette Generator Component
function PaletteGeneratorApp() {
  const dispatch = useDispatch();
    const palette = useSelector(selectPalette);
  const primaryColor = useSelector(selectPrimaryColor);
  const theme = useSelector(selectTheme);
  const notifications = useSelector(selectNotifications);

  const { generatePalette, isGenerating } = useColorPalette();
    const { checkContrast } = useAccessibility();
    useUrlSharing(); // Initialize URL sharing functionality

  const [activeTab, setActiveTab] = useState('generate'); // generate, upload, preview, manage

  // Tab configuration
    const tabs = [
    {
      id: 'generate',
      label: 'Generate',
      icon: '🎨',
      component: ColorGenerator,
    {
 id: 'upload', label: 'Extract', icon: '📁', component: ImageUpload 
},
        {
 id: 'preview', label: 'Preview', icon: '👁️', component: PalettePreview 
},
        {
 id: 'manage', label: 'Manage', icon: '⚙️', component: PaletteManager 
},
      id: 'accessibility',
      label: 'A11y',
      icon: '♿',
      component: AccessibilityChecker,
    {
 id: 'export', label: 'Export', icon: '📦', component: ExportTools 
},
        {
 id: 'library', label: 'Library', icon: '📚', component: PaletteLibrary 
},
    { id: 'share', label: 'Share', icon: '🔗', component: PaletteSharing },
  ];

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component;

  return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Notifications */}
          {notifications.length > 0 && (
                <div className="fixed top-4 right-4 z-50 space-y-2">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`max-w-sm p-4 rounded-lg shadow-lg backdrop-blur-sm border transition-all duration-300 ${notification.type === 'success'
                                ? 'bg-green-500/20 border-green-500/40 text-green-100'
                                : notification.type === 'error'
                                    ? 'bg-red-500/20 border-red-500/40 text-red-100'
                                    : notification.type === 'warning'
                                        ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-100'
                                        : 'bg-blue-500/20 border-blue-500/40 text-blue-100'
                                }`}
                        >
              <div className="flex items-center justify-between">
                              <div className="flex-1">
                                    <p className="text-sm font-medium">{notification.message}</p>
                                    {notification.details && (
                                        <p className="text-xs opacity-80 mt-1">{notification.details}</p>
                    </p>
                  )}
                </div>
                              <button
                  onClick={() => dispatch(dismissNotification(notification.id))}
                                  className="ml-3 text-current opacity-60 hover:opacity-100 transition-opacity"
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
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Color Palette Generator
                    </h1>
                    <p className="text-white/70">
                        Create beautiful, accessible color palettes with AI-powered suggestions
                    </p>
                </header>

              {/* Quick Palette Overview */}
                {palette.colors && palette.colors.length > 0 && (
          <div className="mb-6">
                      <Card title="Current Palette" className="overflow-hidden">
                            <div className="flex h-16 -m-4">
                {palette.colors.map((color, index) => (
                                  <div
                                        key={index}
                                        className="flex-1 relative group cursor-pointer transition-all duration-200 hover:scale-105 hover:z-10"
                                        style={{ backgroundColor: color }}
                                        onClick={() => navigator.clipboard.writeText(color)}
                                        title={`${color} - Click to copy`}
                                    >
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
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
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20 flex flex-wrap gap-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === tab.id
                                        ? 'bg-white/20 text-white shadow-lg'
                                        : 'text-white/70 hover:text-white hover:bg-white/10'
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
                <div className="max-w-7xl mx-auto">
                    {activeTab === 'generate' || activeTab === 'upload' ? (
                        // Generator Layout: Settings on Left, Preview on Right
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                        <div className="max-w-4xl mx-auto">
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
                                    <span className="font-medium text-white">{palette.colors.length}</span>
{' '}
colors
</div>
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
                                          {checkContrast(palette.colors[0], palette.colors[1]).toFixed(1)}
:1
</span>
                                    </div>
                                )}
                                <div className="text-white/70">
                  Generated:{' '}
                  <span className="font-medium text-white">
                                      {new Date(palette.timestamp || Date.now()).toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </footer>
                )}
            </div>
        </div>
    );
}

// Main App component with Provider
function App() {
  return (
        <Provider store={store}>
            <PaletteGeneratorApp />
        </Provider>
    );
}

export default App;
