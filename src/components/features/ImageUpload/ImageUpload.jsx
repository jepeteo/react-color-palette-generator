import React, { useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { extractColors } from 'extract-colors';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { useColorPalette } from '../../../hooks/useColorPalette';
import {
  setUploadedImage,
  setImageExtractionProgress,
  setIsExtractingColors,
  addNotification,
  setError,
} from '../../../store/slices/uiSlice';
import {
  selectUploadedImage,
  selectImageExtractionProgress,
  selectIsExtractingColors,
} from '../../../store/slices/uiSlice';

/**
 * Enhanced ImageUpload component with color extraction
 */
function ImageUpload() {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const { generatePalette } = useColorPalette();
  const uploadedImage = useSelector(selectUploadedImage);
  const extractionProgress = useSelector(selectImageExtractionProgress);
  const isExtracting = useSelector(selectIsExtractingColors);

  const [dragActive, setDragActive] = useState(false);
  const [extractedColors, setExtractedColors] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  // Handle file selection
  const handleFileSelect = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      dispatch(setError({
        message: 'Please select a valid image file',
        details: 'Supported formats: JPG, PNG, GIF, WebP',
      }));
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      dispatch(setError({
        message: 'Image file is too large',
        details: 'Please select an image smaller than 10MB',
      }));
      return;
    }

    try {
      dispatch(setIsExtractingColors(true));
      dispatch(setImageExtractionProgress(0));

      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        dispatch(setUploadedImage({
          file,
          preview: e.target.result,
          name: file.name,
          size: file.size,
          type: file.type,
          timestamp: Date.now(),
        }));
      };
      reader.readAsDataURL(file);

      // Simulate progress for UX
      const progressInterval = setInterval(() => {
        dispatch(setImageExtractionProgress((prev) => {
          const newProgress = Math.min(prev + 10, 90);
          if (newProgress >= 90) {
            clearInterval(progressInterval);
          }
          return newProgress;
        }));
      }, 200);

      // Extract colors
      const colors = await extractColors(file, {
        pixels: 64000, // Reduce for performance
        distance: 0.22,
        splitPower: 10,
        colorValidator: (red, green, blue, alpha = 255) => alpha > 128,
        saturationDistance: 0.2,
        lightnessDistance: 0.2,
        hueDistance: 0.083333333,
      });

      clearInterval(progressInterval);
      dispatch(setImageExtractionProgress(100));

      if (colors && colors.length > 0) {
        setExtractedColors(colors);

        // Automatically set the most prominent color as primary
        const primaryColor = colors[0].hex;
        generatePalette(primaryColor);

        dispatch(addNotification({
          type: 'success',
          message: `Extracted ${colors.length} colors from image`,
          duration: 3000,
        }));
      } else {
        dispatch(setError({
          message: 'Could not extract colors from image',
          details: 'Try an image with more distinct colors',
        }));
      }
    } catch (error) {
      console.error('Error extracting colors:', error);
      dispatch(setError({
        message: 'Failed to process image',
        details: error.message,
      }));
    } finally {
      dispatch(setIsExtractingColors(false));
    }
  }, [dispatch, generatePalette]);

  // Handle file input change
  const handleFileChange = useCallback(
    (event) => {
      const file = event.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect],
  );

  // Handle drag and drop
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const { files } = e.dataTransfer;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  },
    [handleFileSelect],
  );

  // Clear uploaded image
  const clearImage = useCallback(() => {
    setImagePreview(null);
    setExtractedColors([]);
    dispatch(setUploadedImage(null));
    dispatch(setImageExtractionProgress(0));

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    dispatch(addNotification({
      type: 'info',
      message: 'Image cleared',
      duration: 2000,
    }));
  }, [dispatch]);

  // Use specific extracted color
  const useExtractedColor = useCallback((color) => {
    generatePalette(color.hex);
    dispatch(
      addNotification({
        type: 'success',
        message: `Applied color ${color.hex}`,
        duration: 2000,
      }),
    );
  },
    [generatePalette, dispatch],
  );

  // Open file dialog
  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <Card title="Image Color Extraction" subtitle="Extract colors from inspiration images">
      <div className="space-y-4">
        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer ${dragActive
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-white/20 hover:border-white/40 hover:bg-white/5'
            } ${isExtracting ? 'pointer-events-none opacity-50' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isExtracting}
          />

          <div className="text-center">
            {isExtracting ? (
              <div className="space-y-2">
                <div className="text-2xl">⏳</div>
                <p className="text-white/80">Extracting colors...</p>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${extractionProgress}%` }}
                  />
                </div>
                <p className="text-xs text-white/60">
                  {extractionProgress}%</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-3xl">{dragActive ? '📤' : '📁'}</div>
                <p className="text-white/80">
                  {dragActive
                    ? 'Drop image here'
                    : 'Click or drag image to extract colors'}
                </p>
                <p className="text-xs text-white/60">
                  Supports JPG, PNG, GIF, WebP • Max 10MB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="relative group">
            <img
              src={imagePreview}
              alt="Uploaded preview"
              className="w-full h-32 object-cover rounded-lg"
            />
            <Button
              onClick={clearImage}
              variant="danger"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              icon={<span>✕</span>}
            >
              Remove
            </Button>
            {uploadedImage && (
              <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm rounded px-2 py-1">
                <p className="text-xs text-white">{uploadedImage.name}</p>
                <p className="text-xs text-white/60">
                  {(uploadedImage.size / 1024 / 1024).toFixed(1)}
                  MB
                </p>
              </div>
            )}
          </div>
        )}

        {/* Extracted Colors */}
        {extractedColors.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-white/90">
              Extracted Colors (
              {extractedColors.length})
            </h4>
            <div className="grid grid-cols-6 gap-2">
              {extractedColors.slice(0, 12).map((color, index) => (
                <button
                  key={index}
                  onClick={() => useExtractedColor(color)}
                  className="group relative aspect-square rounded-lg overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: color.hex }}
                  title={`${color.hex} (${Math.round(color.area * 100)}% of image)`}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Use
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Color Details */}
            <div className="text-xs text-white/60 space-y-1">
              <p>
                Primary color:{' '}
                <span className="font-mono">{extractedColors[0]?.hex}</span>
              </p>
              <p>Click any color to use it as your palette base</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={() => useExtractedColor(extractedColors[0])}
                variant="primary"
                size="sm"
                icon={<span>🎨</span>}
              >
                Use Primary
              </Button>
              <Button
                onClick={clearImage}
                variant="outline"
                size="sm"
                icon={<span>🗑️</span>}
              >
                Clear
              </Button>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <h5 className="text-sm font-medium text-blue-400 mb-1">💡 Tips</h5>
          <ul className="space-y-1 text-xs text-blue-300/80">
            <li>• Use high-contrast images for better color extraction</li>
            <li>• The most prominent color will be automatically selected</li>
            <li>• Colors are sorted by prominence in the image</li>
          </ul>
        </div>
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </Card>
  );
}

export default ImageUpload;
