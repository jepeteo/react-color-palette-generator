import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPalette, setBaseColor, setHarmony } from '../store/slices/paletteSlice';
import { addNotification } from '../store/slices/uiSlice';

/**
 * Hook for handling URL-based palette sharing
 */
export const useUrlSharing = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const handleUrlParameters = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const colors = urlParams.get('colors');
            const harmony = urlParams.get('harmony');
            const primary = urlParams.get('primary');

            if (colors) {
                try {
                    // Parse colors from URL
                    const colorArray = colors.split(',').map(color => {
                        // Add # if not present
                        return color.startsWith('#') ? color : `#${color}`;
                    });

                    // Validate colors
                    const validColors = colorArray.filter(color => {
                        return /^#[0-9A-Fa-f]{6}$/.test(color);
                    });

                    if (validColors.length > 0) {
                        // Set palette from URL
                        dispatch(setPalette({
                            colors: validColors,
                            harmony: harmony || 'custom',
                            name: `Shared Palette - ${new Date().toLocaleDateString()}`
                        }));

                        // Set primary color if provided
                        if (primary) {
                            const primaryColor = primary.startsWith('#') ? primary : `#${primary}`;
                            if (/^#[0-9A-Fa-f]{6}$/.test(primaryColor)) {
                                dispatch(setBaseColor(primaryColor));
                            }
                        } else if (validColors.length > 0) {
                            // Use first color as primary
                            dispatch(setBaseColor(validColors[0]));
                        }

                        // Set harmony type
                        if (harmony) {
                            dispatch(setHarmony(harmony));
                        }

                        // Clean up URL without reloading page
                        const newUrl = window.location.pathname;
                        window.history.replaceState({}, document.title, newUrl);

                        // Show notification
                        dispatch(addNotification({
                            type: 'success',
                            message: `Loaded shared palette with ${validColors.length} colors`,
                            duration: 3000
                        }));
                    }
                } catch (error) {
                    console.error('Error parsing URL parameters:', error);
                    dispatch(addNotification({
                        type: 'error',
                        message: 'Failed to load shared palette',
                        details: 'Invalid URL format',
                        duration: 4000
                    }));
                }
            }
        };

        // Handle URL parameters on component mount
        handleUrlParameters();

        // Listen for popstate events (back/forward navigation)
        const handlePopState = () => {
            handleUrlParameters();
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [dispatch]);

    return {};
};

/**
 * Utility function to generate shareable URLs
 */
export const generateShareableUrl = (colors, harmony, primaryColor) => {
    if (!colors || colors.length === 0) return '';

    const baseUrl = window.location.origin + window.location.pathname;
    const colorString = colors.map(color => color.replace('#', '')).join(',');

    const params = new URLSearchParams();
    params.set('colors', colorString);

    if (harmony) {
        params.set('harmony', harmony);
    }

    if (primaryColor) {
        params.set('primary', primaryColor.replace('#', ''));
    }

    return `${baseUrl}?${params.toString()}`;
};

/**
 * Utility function to validate color format
 */
export const isValidHexColor = (color) => {
    return /^#[0-9A-Fa-f]{6}$/.test(color);
};

/**
 * Utility function to parse colors from various formats
 */
export const parseColorsFromString = (colorString) => {
    if (!colorString) return [];

    try {
        // Try JSON format first
        if (colorString.startsWith('[') && colorString.endsWith(']')) {
            const parsed = JSON.parse(colorString);
            if (Array.isArray(parsed)) {
                return parsed.filter(isValidHexColor);
            }
        }

        // Try comma-separated format
        const colors = colorString.split(',').map(color => {
            const trimmed = color.trim();
            return trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
        });

        return colors.filter(isValidHexColor);
    } catch (error) {
        console.error('Error parsing colors:', error);
        return [];
    }
};
