import React, { useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import {
  selectPalette,
  selectPrimaryColor,
  selectHarmonyType,
} from '../../../store/slices/paletteSlice';
import { addNotification, setError } from '../../../store/slices/uiSlice';

/**
 * PaletteSharing component for sharing color palettes via URL and social media
 */
function PaletteSharing() {
  const dispatch = useDispatch();
    const palette = useSelector(selectPalette);
    const primaryColor = useSelector(selectPrimaryColor);
    const harmonyType = useSelector(selectHarmonyType);

  const [shareFormat, setShareFormat] = useState('url'); // url, embed, social
    const [embedSize, setEmbedSize] = useState('medium'); // small, medium, large
    const [showPreview, setShowPreview] = useState(false);

  // Generate shareable URL
    const shareableUrl = useMemo(() => {
        if (!palette.colors || palette.colors.length === 0) return '';

    const baseUrl = window.location.origin + window.location.pathname;
        const colors = palette.colors.map((color) => color.replace('#', '')).join(',');
        const params = new URLSearchParams({
      colors,
      harmony: harmonyType || 'complementary',
            primary: primaryColor?.replace('#', '') || '',
        });

    return `${baseUrl}?${params.toString()}`;
    }, [palette.colors, harmonyType, primaryColor]);

  // Generate embed code
  const embedCode = useMemo(() => {
    if (!palette.colors || palette.colors.length === 0) return '';

    const sizes = {
            small: { width: 300, height: 100 },
            medium: { width: 400, height: 150 },
            large: { width: 600, height: 200 },
        };

    const size = sizes[embedSize];
        const colors = palette.colors.join(',');

    return `<iframe 
  src="${shareableUrl}&embed=true" 
  width="${size.width}" 
  height="${size.height}" 
  frameborder="0" 
  style="border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
  title="Color Palette">
</iframe>`;
  }, [shareableUrl, embedSize, palette.colors]);

  // Social media sharing templates
    const socialShares = useMemo(() => {
        const paletteText = 'Check out this beautiful color palette! 🎨';
        const hashtags = ['colorpalette', 'design', 'colors', harmonyType?.replace(/\s+/g, '').toLowerCase()].filter(Boolean);

    return {
            twitter: {
                name: 'Twitter',
                icon: '🐦',
                url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(paletteText)}&url=${encodeURIComponent(shareableUrl)}&hashtags=${hashtags.join(',')}`,
            },
            facebook: {
                name: 'Facebook',
                icon: '📘',
                url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableUrl)}`,
            },
            linkedin: {
                name: 'LinkedIn',
                icon: '💼',
                url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareableUrl)}`,
            },
            pinterest: {
                name: 'Pinterest',
                icon: '📌',
                url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareableUrl)}&description=${encodeURIComponent(paletteText)}`,
            }
    };
    }, [shareableUrl, harmonyType]);

  // Copy to clipboard
    const copyToClipboard = useCallback(async (text, type = 'URL') => {
        try {
            await navigator.clipboard.writeText(text);
            dispatch(addNotification({
                type: 'success',
                message: `${type} copied to clipboard`,
                duration: 2000,
            }));
        } catch (error) {
            console.error('Copy failed:', error);
        dispatch(
          setError({
        message: 'Failed to copy to clipboard',
                details: error.message,
            }));
        );
      }
  },
    [dispatch],
  );

  // Open social share
    const openSocialShare = useCallback((platform) => {
        const shareData = socialShares[platform];
      if (shareData) {
      window.open(shareData.url, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
        }
    },
    [socialShares],
  );

  // Generate QR code URL (using a free QR service)
    const qrCodeUrl = useMemo(() => {
        if (!shareableUrl) return '';
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareableUrl)}`;
    }, [shareableUrl]);

  // Generate palette image data URL for sharing
    const generatePaletteImage = useCallback(() => {
        if (!palette.colors || palette.colors.length === 0) return '';

    const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

    canvas.width = 400;
        canvas.height = 100;

    const colorWidth = canvas.width / palette.colors.length;

    palette.colors.forEach((color, index) => {
            ctx.fillStyle = color;
            ctx.fillRect(index * colorWidth, 0, colorWidth, canvas.height);
        });

    // Add text overlay
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, canvas.height - 30, canvas.width, 30);

    ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
    ctx.fillText(
      `${harmonyType || 'Custom'} Palette`,
      canvas.width / 2,
      canvas.height - 8,
    return canvas.toDataURL('image/png');
    }, [palette.colors, harmonyType]);

  // Download palette image
    const downloadPaletteImage = useCallback(() => {
    const dataUrl = generatePaletteImage();
    if (!dataUrl) return;

    const link = document.createElement('a');
        link.download = `color-palette-${Date.now()}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    dispatch(addNotification({
            type: 'success',
            message: 'Palette image downloaded',
            duration: 2000,
        }));
    }, [generatePaletteImage, dispatch]);

  if (!palette.colors || palette.colors.length === 0) {
        return (
      <Card
        title="Share Palette"
        subtitle="Share your color palette with the world"
              <div className="text-center py-8 text-white/60">
                    <div className="text-4xl mb-4">🔗</div>
                    <p>No palette to share</p>
                    <p className="text-sm mt-2">Generate a color palette to enable sharing options</p>
          </p>
        </div>
      </Card>
    );
    }

  return (
        <Card title="Share Palette" subtitle="Share your beautiful color palette">
            <div className="space-y-6">
                {/* Share Format Selection */}
                <div className="flex gap-2">
                    {[
                        { id: 'url', label: 'Share URL', icon: '🔗' },
                        { id: 'embed', label: 'Embed Code', icon: '💻' },
                        { id: 'social', label: 'Social Media', icon: '📱' },
                    ].map((format) => (
                        <Button
                            key={format.id}
              onClick={() => setShareFormat(format.id)}
                          variant={shareFormat === format.id ? 'primary' : 'outline'}
                            size="sm"
                            icon={<span>{format.icon}</span>}
                        >
                            {format.label}
                        </Button>
                    ))}
                </div>

              {/* Current Palette Preview */}
                <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white/90 font-medium mb-3">Current Palette</h3>
                    <div className="flex h-16 rounded overflow-hidden mb-3">
                        {palette.colors.map((color, index) => (
                            <div
                key={index}
                              className="flex-1 flex items-end justify-center pb-2"
                                style={{ backgroundColor: color }}
                            >
                                <span className="text-xs font-mono bg-black/30 px-2 py-1 rounded text-white">
                                    {color}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-sm text-white/60">
                        <span>
{palette.colors.length} colors</span>
                        <span>
{harmonyType || 'Custom'} harmony</span>
                    </div>
                </div>

              {/* Share Content */}
        {shareFormat === 'url' && (
                <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Shareable URL
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={shareableUrl}
                                    readOnly
                                    className="flex-1 bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                                <Button
                                    onClick={() => copyToClipboard(shareableUrl)}
                                    variant="outline"
                                    size="sm"
                                    icon={<span>📋</span>}
                                >
                                    Copy
                                </Button>
                            </div>
                        </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* QR Code */}
                            <div className="text-center">
                                <h4 className="text-white/80 text-sm font-medium mb-2">QR Code</h4>
                </h4>
                <div className="inline-block rounded-lg bg-white p-4">
                                  <img
                                        src={qrCodeUrl}
                                        alt="QR Code for palette"
                                        className="w-32 h-32"
                                    />
                                </div>
                                <p className="text-xs text-white/60 mt-2">Scan to view palette</p>
                </p>
              </div>

                          {/* Palette Image */}
                            <div className="text-center">
                                <h4 className="text-white/80 text-sm font-medium mb-2">Palette Image</h4>
                </h4>
                <div className="rounded-lg bg-white/10 p-4">
                                  <img
                                        src={generatePaletteImage()}
                                        alt="Palette preview"
                                        className="w-full max-w-48 rounded"
                                    />
                                </div>
                                <Button
                  onClick={downloadPaletteImage}
                                  variant="outline"
                                    size="sm"
                                    icon={<span>💾</span>}
                                    className="mt-2"
                                >
                                    Download
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

              {shareFormat === 'embed' && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-white/80">Size:</label>
                            {[
                                { id: 'small', label: 'Small (300×100)' },
                                { id: 'medium', label: 'Medium (400×150)' },
                                { id: 'large', label: 'Large (600×200)' },
                            ].map((size) => (
                                <button
                                    key={size.id}
                                    onClick={() => setEmbedSize(size.id)}
                                    className={`px-3 py-1 rounded text-sm transition-colors ${embedSize === size.id
                    embedSize === size.id
                      ? 'bg-blue-500 text-white'
                                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                                        }`}
                                >
                                    {size.label}
                                </button>
                            ))}
                        </div>

                      <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Embed Code
              </label>
                          <div className="relative">
                                <textarea
                  value={embedCode}
                                  readOnly
                                    rows={6}
                                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                                />
                <Button
                                  onClick={() => copyToClipboard(embedCode, 'Embed code')}
                                    variant="outline"
                                    size="sm"
                                    icon={<span>📋</span>}
                                    className="absolute top-2 right-2"
                                >
                                    Copy
                                </Button>
                            </div>
                        </div>

                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                            <h5 className="text-blue-400 text-sm font-medium mb-1">💡 Embed Tips</h5>
              </h5>
              <ul className="space-y-1 text-xs text-blue-300/80">
                              <li>• Paste this code into any HTML page or blog post</li>
                                <li>• The embedded palette will always show current colors</li>
                                <li>• Responsive design adapts to container width</li>
                            </ul>
                        </div>
                    </div>
                )}

              {shareFormat === 'social' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {Object.entries(socialShares).map(([platform, data]) => (
                                <Button
                                    key={platform}
                                    onClick={() => openSocialShare(platform)}
                                    variant="outline"
                                    className="flex-col h-20"
                                    icon={<span className="text-2xl">{data.icon}</span>}
                                >
                  <span className="mt-1 text-sm">{data.name}</span>
                </Button>
              ))}
            </div>

                      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                            <h4 className="text-purple-400 font-medium mb-2">Social Media Preview</h4>
              </h4>
              <div className="rounded bg-white/5 p-3">
                              <div className="flex items-center gap-3">
                  <div
                    className="flex h-8 overflow-hidden rounded"
                    style={{ width: '80px' }}
                                      {palette.colors.map((color, index) => (
                                            <div
                                                key={index}
                                                className="flex-1"
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white text-sm font-medium">
                                            Check out this beautiful color palette! 🎨
                                        </p>
                                        <p className="text-white/60 text-xs">
                                            #
{harmonyType?.replace(/\s+/g, '').toLowerCase()} #colorpalette #design
                                        </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

              {/* Quick Actions */}
                <div className="flex gap-2 flex-wrap">
                    <Button
                        onClick={() => copyToClipboard(shareableUrl)}
                        variant="primary"
                        size="sm"
                        icon={<span>🔗</span>}
                    >
                        Copy URL
                    </Button>
                    <Button
                        onClick={downloadPaletteImage}
                        variant="outline"
                        size="sm"
                        icon={<span>🖼️</span>}
                    >
                        Download Image
          </Button>
                  <Button
                        onClick={() => openSocialShare('twitter')}
                        variant="outline"
                        size="sm"
                        icon={<span>🐦</span>}
                    >
                        Tweet
                    </Button>
                </div>

              {/* Usage Statistics */}
                <div className="bg-gray-500/10 border border-gray-500/20 rounded-lg p-3">
                    <h5 className="text-gray-300 font-medium mb-2">📊 Sharing Stats</h5>
                    <div className="grid grid-cols-3 gap-4 text-sm text-gray-400">
                        <div className="text-center">
                            <div className="text-white font-medium">URL</div>
                            <div>Quick sharing</div>
                        </div>
                        <div className="text-center">
                            <div className="text-white font-medium">Embed</div>
                            <div>Website integration</div>
                        </div>
                        <div className="text-center">
                            <div className="text-white font-medium">Social</div>
                            <div>Wider reach</div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default PaletteSharing;
