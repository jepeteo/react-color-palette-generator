import React, { useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ColorUtils } from '../../../utils/colorUtils';
import { useAccessibility } from '../../../hooks/useAccessibility';
import { selectPalette } from '../../../store/slices/paletteSlice';
import {
  selectSelectedElement,
  setSelectedElement,
  addNotification,
} from '../../../store/slices/uiSlice';

/**
 * Interactive PalettePreview component with element selection
 */
function PalettePreview() {
  const dispatch = useDispatch();

  const palette = useSelector(selectPalette);
  const selectedElement = useSelector(selectSelectedElement);

  const { checkContrast, getWcagLevel } = useAccessibility();

  const [previewMode, setPreviewMode] = useState('web'); // web, mobile, print
  const [showAccessibilityInfo, setShowAccessibilityInfo] = useState(false);

  // Generate element styles based on palette
  const elementStyles = useMemo(() => {
    if (!palette.colors || palette.colors.length < 2) {
      return {
        background: '#1a1a1a',
        primary: '#3b82f6',
        text: '#ffffff',
        accent: '#10b981',
        secondary: '#6b7280',
      };
    }

    const { colors } = palette;
    return {
      background: colors[colors.length - 1] || '#1a1a1a',
      primary: colors[0] || '#3b82f6',
      text: ColorUtils.getContrastColor(colors[colors.length - 1] || '#1a1a1a'),
      accent: colors[1] || '#10b981',
      secondary: colors[2] || '#6b7280',
    };
  }, [palette]);

  // Handle element click for color selection
  const handleElementClick = useCallback(
    (elementType, currentColor) => {
      dispatch(setSelectedElement({ type: elementType, color: currentColor }));
      dispatch(
        addNotification({
          type: 'info',
          message: `Selected ${elementType} element`,
          duration: 2000,
        }),
      );
    },
    [dispatch],
  );

  // Copy color to clipboard
  const copyColor = useCallback(
    async (color) => {
      try {
        await navigator.clipboard.writeText(color);
        dispatch(
          addNotification({
            type: 'success',
            message: `Copied ${color}`,
            duration: 2000,
          }),
        );
      } catch (error) {
        console.error('Failed to copy color:', error);
      }
    },
    [dispatch],
  );

  // Preview components based on mode
  const renderWebPreview = () => (
    <div
      className="mx-auto w-80 overflow-hidden rounded-lg border border-white/20"
      style={{ backgroundColor: elementStyles.background }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between border-b border-white/10 p-4"
        style={{ backgroundColor: elementStyles.primary }}
      >
        <h3
          className="cursor-pointer font-semibold"
          style={{ color: ColorUtils.getContrastColor(elementStyles.primary) }}
          onClick={() => handleElementClick('primary', elementStyles.primary)}
        >
          Website Header
        </h3>
        <button
          className="cursor-pointer rounded px-3 py-1 text-sm"
          style={{
            backgroundColor: elementStyles.accent,
            color: ColorUtils.getContrastColor(elementStyles.accent),
          }}
          onClick={() => handleElementClick('accent', elementStyles.accent)}
        >
          CTA Button
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3 p-4">
        <h4
          className="cursor-pointer text-lg font-medium"
          style={{ color: elementStyles.text }}
          onClick={() => handleElementClick('text', elementStyles.text)}
        >
          Main Content Area
        </h4>
        <p
          className="cursor-pointer text-sm opacity-80"
          style={{ color: elementStyles.secondary }}
          onClick={() =>
            handleElementClick('secondary', elementStyles.secondary)
          }
        >
          This is a sample paragraph to demonstrate how your colors look in a
          real website layout.
        </p>
        <div className="flex gap-2">
          <button
            className="cursor-pointer rounded px-3 py-2 text-sm"
            style={{
              backgroundColor: elementStyles.accent,
              color: ColorUtils.getContrastColor(elementStyles.accent),
            }}
            onClick={() => handleElementClick('accent', elementStyles.accent)}
          >
            Primary Button
          </button>
          <button
            className="cursor-pointer rounded border px-3 py-2 text-sm"
            style={{
              color: elementStyles.accent,
              borderColor: elementStyles.accent,
            }}
            onClick={() => handleElementClick('accent', elementStyles.accent)}
          >
            Secondary Button
          </button>
        </div>
      </div>
    </div>
  );

  const renderMobilePreview = () => (
    <div
      className="mx-auto w-64 overflow-hidden rounded-3xl border-2 border-white/20"
      style={{ backgroundColor: elementStyles.background }}
    >
      {/* Status Bar */}
      <div className="flex h-6 items-center justify-center bg-black/20">
        <div className="text-xs" style={{ color: elementStyles.text }}>
          9:41 AM
        </div>
      </div>

      {/* Header */}
      <div
        className="flex items-center justify-between p-4"
        style={{ backgroundColor: elementStyles.primary }}
      >
        <h3
          className="cursor-pointer font-semibold"
          style={{ color: ColorUtils.getContrastColor(elementStyles.primary) }}
          onClick={() => handleElementClick('primary', elementStyles.primary)}
        >
          App Name
        </h3>
        <div
          className="h-8 w-8 cursor-pointer rounded-full"
          style={{ backgroundColor: elementStyles.accent }}
          onClick={() => handleElementClick('accent', elementStyles.accent)}
        />
      </div>

      {/* Content */}
      <div className="space-y-4 p-4">
        <div
          className="cursor-pointer rounded-lg p-3"
          style={{ backgroundColor: `${elementStyles.accent}20` }}
          onClick={() => handleElementClick('accent', elementStyles.accent)}
        >
          <h4 className="font-medium" style={{ color: elementStyles.accent }}>
            Feature Card
          </h4>
          <p className="mt-1 text-sm" style={{ color: elementStyles.text }}>
            Mobile app interface preview
          </p>
        </div>
        <button
          className="w-full cursor-pointer rounded-lg py-3 font-medium"
          style={{
            backgroundColor: elementStyles.accent,
            color: ColorUtils.getContrastColor(elementStyles.accent),
          }}
          onClick={() => handleElementClick('accent', elementStyles.accent)}
        >
          Action Button
        </button>
      </div>
    </div>
  );

  const renderPrintPreview = () => (
    <div
      className="mx-auto aspect-[8.5/11] w-80 overflow-hidden border border-white/20 p-6"
      style={{ backgroundColor: elementStyles.background }}
    >
      <div className="flex h-full flex-col">
        <h1
          className="mb-4 cursor-pointer text-2xl font-bold"
          style={{ color: elementStyles.primary }}
          onClick={() => handleElementClick('primary', elementStyles.primary)}
        >
          Document Title
        </h1>
        <div className="flex-1 space-y-3">
          <p
            className="cursor-pointer text-sm"
            style={{ color: elementStyles.text }}
            onClick={() => handleElementClick('text', elementStyles.text)}
          >
            This is how your color palette would look in print materials like
            brochures, flyers, or business cards.
          </p>
          <div
            className="cursor-pointer border-l-4 p-3"
            style={{
              borderColor: elementStyles.accent,
              backgroundColor: `${elementStyles.accent}10`,
            }}
            onClick={() => handleElementClick('accent', elementStyles.accent)}
          >
            <p className="text-sm" style={{ color: elementStyles.text }}>
              Highlighted content or callout box
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card
      title="Interactive Preview"
      subtitle="Click elements to select colors for your palette"
    >
      <div className="space-y-4">
        {/* Preview Mode Selector */}
        <div className="flex gap-2">
          {[
            { id: 'web', label: '🌐 Web', icon: '🌐' },
            { id: 'mobile', label: '📱 Mobile', icon: '📱' },
            { id: 'print', label: '🖨️ Print', icon: '🖨️' },
          ].map((mode) => (
            <Button
              key={mode.id}
              onClick={() => setPreviewMode(mode.id)}
              variant={previewMode === mode.id ? 'primary' : 'ghost'}
              size="sm"
            >
              {mode.label}
            </Button>
          ))}
        </div>

        {/* Preview Area */}
        <div className="flex min-h-[300px] items-center justify-center rounded-lg bg-white/5 p-6">
          {previewMode === 'web' && renderWebPreview()}
          {previewMode === 'mobile' && renderMobilePreview()}
          {previewMode === 'print' && renderPrintPreview()}
        </div>

        {/* Selected Element Info */}
        {selectedElement && (
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-medium text-blue-400">
                  Selected: {selectedElement.type}
                </h5>
                <p className="text-xs text-blue-300/80">
                  Color: {selectedElement.color}
                </p>
              </div>
              <Button
                onClick={() => copyColor(selectedElement.color)}
                variant="ghost"
                size="sm"
                icon={<span>📋</span>}
              >
                Copy
              </Button>
            </div>
          </div>
        )}

        {/* Color Information */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-white/90">
              Current Palette
            </h5>
            <div className="flex gap-2">
              {palette.colors?.slice(0, 5).map((color, index) => (
                <div
                  key={index}
                  className="h-8 w-8 cursor-pointer rounded transition-transform hover:scale-110"
                  style={{ backgroundColor: color }}
                  onClick={() => copyColor(color)}
                  title={`Click to copy ${color}`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h5 className="text-sm font-medium text-white/90">
                Accessibility
              </h5>
              <Button
                onClick={() => setShowAccessibilityInfo(!showAccessibilityInfo)}
                variant="ghost"
                size="sm"
              >
                {showAccessibilityInfo ? '▼' : '▶'}
              </Button>
            </div>
            {showAccessibilityInfo && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-white/5 p-3">
                    <h5 className="mb-1 text-xs font-medium text-white/70">
                      Text Contrast
                    </h5>
                    <span className="font-mono text-sm">
                      {checkContrast(
                        elementStyles.text,
                        elementStyles.background,
                      ).toFixed(1)}
                      :1
                    </span>
                  </div>
                  <div className="rounded-lg bg-white/5 p-3">
                    <h5 className="mb-1 text-xs font-medium text-white/70">
                      WCAG Level
                    </h5>
                    <span className="text-sm">
                      {getWcagLevel(
                        elementStyles.text,
                        elementStyles.background,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Usage Tips */}
        <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-3">
          <h5 className="mb-1 text-sm font-medium text-green-400">💡 Tips</h5>
          <ul className="space-y-1 text-xs text-green-300/80">
            <li>• Click any element in the preview to select it for editing</li>
            <li>• Check contrast ratios to ensure accessibility compliance</li>
            <li>
              • Switch between preview modes to see your palette in different
              contexts
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
}

export default PalettePreview;
