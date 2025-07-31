import { useCallback } from 'react';
import chroma from 'chroma-js';

/**
 * Hook for accessibility utilities
 */
export const useAccessibility = () => {
    // Calculate contrast ratio between two colors
    const checkContrast = useCallback((foreground, background) => {
        try {
            const fgColor = chroma(foreground);
            const bgColor = chroma(background);
            return chroma.contrast(fgColor, bgColor);
        } catch (error) {
            console.warn('Error calculating contrast:', error);
            return 1;
        }
    }, []);

    // Get WCAG compliance level
    const getWcagLevel = useCallback((contrast, isLargeText = false) => {
        if (isLargeText) {
            if (contrast >= 4.5) return 'AAA';
            if (contrast >= 3) return 'AA';
            return 'Fail';
        } else {
            if (contrast >= 7) return 'AAA';
            if (contrast >= 4.5) return 'AA';
            return 'Fail';
        }
    }, []);

    return {
        checkContrast,
        getWcagLevel,
    };
};
