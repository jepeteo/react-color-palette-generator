import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ColorUtils } from '../../../utils/colorUtils';
import {
  setBaseColor,
  randomizePalette,
} from '../../../store/slices/paletteSlice';
import { addNotification } from '../../../store/slices/uiSlice';

/**
 * Advanced color picker with HSL sliders and color space visualization
 */
function AdvancedColorPicker() {
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const [pickerMode, setPickerMode] = useState('hsl'); // 'hsl', 'rgb', 'wheel'

  // Update color from HSL
  const updateFromHsl = useCallback((newHsl) => {
    setHsl(newHsl);
    try {
      const hex = ColorUtils.hslToHex(newHsl);
      const newRgb = ColorUtils.hexToRgb(hex);
      setSelectedColor(hex);
      setRgb(newRgb);
    } catch (error) {
      console.warn('Color conversion error:', error);
    }
  }, []);

  // Update color from RGB
  const updateFromRgb = useCallback((newRgb) => {
    setRgb(newRgb);
    try {
      const hex = ColorUtils.rgbToHex(newRgb);
      const newHsl = ColorUtils.hexToHsl(hex);
      setSelectedColor(hex);
      setHsl(newHsl);
    } catch (error) {
      console.warn('Color conversion error:', error);
    }
  }, []);

  // Update color from hex
  const updateFromHex = useCallback((hex) => {
    if (!/^#[0-9A-F]{6}$/i.test(hex)) return;

    try {
      setSelectedColor(hex);
      const newHsl = ColorUtils.hexToHsl(hex);
      const newRgb = ColorUtils.hexToRgb(hex);
      setHsl(newHsl);
      setRgb(newRgb);
    } catch (error) {
      console.warn('Color conversion error:', error);
    }
  }, []);

  // Draw color picker canvas
  const drawColorPicker = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (pickerMode === 'wheel') {
      // Draw color wheel
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 2 - 10;

      for (let angle = 0; angle < 360; angle += 1) {
        for (let r = 0; r < radius; r += 1) {
          const saturation = (r / radius) * 100;
          const lightness = 50;
          const color = ColorUtils.hslToHex({
            h: angle,
            s: saturation,
            l: lightness,
          });

          const x = centerX + Math.cos((angle * Math.PI) / 180) * r;
          const y = centerY + Math.sin((angle * Math.PI) / 180) * r;

          ctx.fillStyle = color;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    } else {
      // Draw saturation/lightness picker
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          const saturation = (x / width) * 100;
          const lightness = 100 - (y / height) * 100;
          const color = ColorUtils.hslToHex({
            h: hsl.h,
            s: saturation,
            l: lightness,
          });

          ctx.fillStyle = color;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
  }, [pickerMode, hsl.h]);

  // Handle canvas click
  const handleCanvasClick = useCallback(
    (event) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (pickerMode === 'wheel') {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const radius = Math.min(canvas.width, canvas.height) / 2 - 10;

        if (distance <= radius) {
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
          const hue = (angle + 360) % 360;
          const saturation = (distance / radius) * 100;
          updateFromHsl({ h: hue, s: saturation, l: hsl.l });
        }
      } else {
        const saturation = (x / canvas.width) * 100;
        const lightness = 100 - (y / canvas.height) * 100;
        updateFromHsl({ h: hsl.h, s: saturation, l: lightness });
      }
    },
    [pickerMode, hsl.h, hsl.l, updateFromHsl],
  );

  // Redraw canvas when needed
  useEffect(() => {
    drawColorPicker();
  }, [drawColorPicker]);

  // Apply color to palette
  const applyColor = useCallback(() => {
    dispatch(setBaseColor(selectedColor));
    dispatch(randomizePalette());
    dispatch(
      addNotification({
        type: 'success',
        message: `Applied color ${selectedColor}`,
        duration: 2000,
      }),
    );
  }, [selectedColor, dispatch]);

  // Color format conversion helpers
  const copyToClipboard = useCallback(
    async (text, format) => {
      try {
        await navigator.clipboard.writeText(text);
        dispatch(
          addNotification({
            type: 'success',
            message: `Copied ${format} value`,
            duration: 1500,
          }),
        );
      } catch (error) {
        console.error('Copy failed:', error);
      }
    },
    [dispatch],
  );

  return (
    <Card
      title="Advanced Color Picker"
      subtitle="Precise color selection with multiple color spaces"
    >
      <div className="space-y-6">
        {/* Color Preview */}
        <div className="flex items-center gap-4">
          <div
            className="h-16 w-16 rounded-lg border-2 border-white/20 shadow-lg"
            style={{ backgroundColor: selectedColor }}
          />
          <div className="flex-1">
            <div className="font-mono text-lg text-white">{selectedColor}</div>
            <div className="text-sm text-white/60">
              RGB({rgb.r}, {rgb.g}, {rgb.b}) • HSL({Math.round(hsl.h)}°,{' '}
              {Math.round(hsl.s)}%, {Math.round(hsl.l)}%)
            </div>
          </div>
          <Button onClick={applyColor} variant="primary" size="sm">
            Apply to Palette
          </Button>
        </div>

        {/* Picker Mode Selector */}
        <div className="flex gap-2">
          {[
            { id: 'hsl', label: 'HSL Sliders', icon: '🎚️' },
            { id: 'rgb', label: 'RGB Sliders', icon: '🔴' },
            { id: 'wheel', label: 'Color Wheel', icon: '🎯' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setPickerMode(mode.id)}
              className={`rounded-lg px-3 py-2 text-sm transition-all ${
                pickerMode === mode.id
                  ? 'border border-blue-500/50 bg-blue-500/20 text-blue-300'
                  : 'border border-white/20 bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <span className="mr-2">{mode.icon}</span>
              {mode.label}
            </button>
          ))}
        </div>

        {/* Color Picker Interface */}
        {pickerMode === 'hsl' && (
          <div className="space-y-4">
            {/* Hue Slider */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Hue: {Math.round(hsl.h)}°
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={hsl.h}
                onChange={(e) =>
                  updateFromHsl({ ...hsl, h: parseInt(e.target.value) })
                }
                className="h-3 w-full cursor-pointer appearance-none rounded-lg"
                style={{
                  background: `linear-gradient(to right, 
                    hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), 
                    hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))`,
                }}
              />
            </div>

            {/* Saturation Slider */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Saturation: {Math.round(hsl.s)}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={hsl.s}
                onChange={(e) =>
                  updateFromHsl({ ...hsl, s: parseInt(e.target.value) })
                }
                className="h-3 w-full cursor-pointer appearance-none rounded-lg"
                style={{
                  background: `linear-gradient(to right, 
                    hsl(${hsl.h}, 0%, ${hsl.l}%), hsl(${hsl.h}, 100%, ${hsl.l}%))`,
                }}
              />
            </div>

            {/* Lightness Slider */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Lightness: {Math.round(hsl.l)}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={hsl.l}
                onChange={(e) =>
                  updateFromHsl({ ...hsl, l: parseInt(e.target.value) })
                }
                className="h-3 w-full cursor-pointer appearance-none rounded-lg"
                style={{
                  background: `linear-gradient(to right, 
                    hsl(${hsl.h}, ${hsl.s}%, 0%), hsl(${hsl.h}, ${hsl.s}%, 50%), hsl(${hsl.h}, ${hsl.s}%, 100%))`,
                }}
              />
            </div>
          </div>
        )}

        {pickerMode === 'rgb' && (
          <div className="space-y-4">
            {/* Red Slider */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Red: {rgb.r}
              </label>
              <input
                type="range"
                min="0"
                max="255"
                value={rgb.r}
                onChange={(e) =>
                  updateFromRgb({ ...rgb, r: parseInt(e.target.value) })
                }
                className="h-3 w-full cursor-pointer appearance-none rounded-lg"
                style={{
                  background: `linear-gradient(to right, 
                    rgb(0, ${rgb.g}, ${rgb.b}), rgb(255, ${rgb.g}, ${rgb.b}))`,
                }}
              />
            </div>

            {/* Green Slider */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Green: {rgb.g}
              </label>
              <input
                type="range"
                min="0"
                max="255"
                value={rgb.g}
                onChange={(e) =>
                  updateFromRgb({ ...rgb, g: parseInt(e.target.value) })
                }
                className="h-3 w-full cursor-pointer appearance-none rounded-lg"
                style={{
                  background: `linear-gradient(to right, 
                    rgb(${rgb.r}, 0, ${rgb.b}), rgb(${rgb.r}, 255, ${rgb.b}))`,
                }}
              />
            </div>

            {/* Blue Slider */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Blue: {rgb.b}
              </label>
              <input
                type="range"
                min="0"
                max="255"
                value={rgb.b}
                onChange={(e) =>
                  updateFromRgb({ ...rgb, b: parseInt(e.target.value) })
                }
                className="h-3 w-full cursor-pointer appearance-none rounded-lg"
                style={{
                  background: `linear-gradient(to right, 
                    rgb(${rgb.r}, ${rgb.g}, 0), rgb(${rgb.r}, ${rgb.g}, 255))`,
                }}
              />
            </div>
          </div>
        )}

        {pickerMode === 'wheel' && (
          <div className="space-y-4">
            <canvas
              ref={canvasRef}
              width={300}
              height={300}
              onClick={handleCanvasClick}
              className="mx-auto block cursor-crosshair rounded-lg border border-white/20"
            />

            {/* Lightness Slider for wheel mode */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Lightness: {Math.round(hsl.l)}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={hsl.l}
                onChange={(e) =>
                  updateFromHsl({ ...hsl, l: parseInt(e.target.value) })
                }
                className="h-3 w-full cursor-pointer appearance-none rounded-lg"
                style={{
                  background: `linear-gradient(to right, 
                    hsl(${hsl.h}, ${hsl.s}%, 0%), hsl(${hsl.h}, ${hsl.s}%, 50%), hsl(${hsl.h}, ${hsl.s}%, 100%))`,
                }}
              />
            </div>
          </div>
        )}

        {/* Hex Input */}
        <div>
          <label className="mb-2 block text-sm font-medium text-white/80">
            Hex Color
          </label>
          <input
            type="text"
            value={selectedColor}
            onChange={(e) => updateFromHex(e.target.value)}
            className="w-full rounded border border-white/20 bg-white/10 px-3 py-2 font-mono text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="#000000"
          />
        </div>

        {/* Color Format Values */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div
            className="cursor-pointer rounded-lg bg-white/5 p-3 transition-colors hover:bg-white/10"
            onClick={() => copyToClipboard(selectedColor, 'HEX')}
          >
            <div className="mb-1 text-xs text-white/60">HEX</div>
            <div className="font-mono text-sm text-white">{selectedColor}</div>
          </div>
          <div
            className="cursor-pointer rounded-lg bg-white/5 p-3 transition-colors hover:bg-white/10"
            onClick={() =>
              copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'RGB')
            }
          >
            <div className="mb-1 text-xs text-white/60">RGB</div>
            <div className="font-mono text-sm text-white">
              {rgb.r}, {rgb.g}, {rgb.b}
            </div>
          </div>
          <div
            className="cursor-pointer rounded-lg bg-white/5 p-3 transition-colors hover:bg-white/10"
            onClick={() =>
              copyToClipboard(
                `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`,
                'HSL',
              )
            }
          >
            <div className="mb-1 text-xs text-white/60">HSL</div>
            <div className="font-mono text-sm text-white">
              {Math.round(hsl.h)}°, {Math.round(hsl.s)}%, {Math.round(hsl.l)}%
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default AdvancedColorPicker;
