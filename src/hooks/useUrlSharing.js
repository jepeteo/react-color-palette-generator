import { useState, useCallback } from 'react';

/**
 * Hook for URL sharing functionality
 */
export const useUrlSharing = () => {
  const [shareUrl, setShareUrl] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  // Generate shareable URL with palette data
  const generateShareUrl = useCallback((paletteData) => {
    try {
      const encodedData = btoa(JSON.stringify(paletteData));
      const url = `${window.location.origin}${window.location.pathname}?palette=${encodedData}`;
      setShareUrl(url);
      return url;
    } catch (error) {
      console.warn('Error generating share URL:', error);
      return '';
    }
  }, []);

  // Parse palette data from URL
  const parsePaletteFromUrl = useCallback(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const paletteParam = urlParams.get('palette');
      if (paletteParam) {
        return JSON.parse(atob(paletteParam));
      }
    } catch (error) {
      console.warn('Error parsing palette from URL:', error);
    }
    return null;
  }, []);

  // Copy URL to clipboard
  const copyToClipboard = useCallback(async (url) => {
    try {
      setIsSharing(true);
      await navigator.clipboard.writeText(url);
      return true;
    } catch (error) {
      console.warn('Error copying to clipboard:', error);
      return false;
    } finally {
      setIsSharing(false);
    }
  }, []);

  return {
    shareUrl,
    isSharing,
    generateShareUrl,
    parsePaletteFromUrl,
    copyToClipboard,
  };
};
