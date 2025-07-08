// Local storage utility functions for palette management
const STORAGE_KEY = 'colorPaletteGenerator_savedPalettes';

export const loadSavedPalettes = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error loading saved palettes:', error);
        return [];
    }
};

export const savePaletteToStorage = (palette) => {
    try {
        const existingPalettes = loadSavedPalettes();
        const newPalette = {
            id: Date.now().toString(),
            name: palette.name || `Palette ${existingPalettes.length + 1}`,
            colors: palette.colors,
            harmony: palette.harmony,
            isDarkMode: palette.isDarkMode,
            createdAt: new Date().toISOString(),
        };

        const updatedPalettes = [...existingPalettes, newPalette];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPalettes));
        return newPalette;
    } catch (error) {
        console.error('Error saving palette:', error);
        throw error;
    }
};

export const deletePaletteFromStorage = (paletteId) => {
    try {
        const existingPalettes = loadSavedPalettes();
        const filteredPalettes = existingPalettes.filter(p => p.id !== paletteId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredPalettes));
        return filteredPalettes;
    } catch (error) {
        console.error('Error deleting palette:', error);
        throw error;
    }
};

export const updatePaletteInStorage = (paletteId, updatedData) => {
    try {
        const existingPalettes = loadSavedPalettes();
        const updatedPalettes = existingPalettes.map(p =>
            p.id === paletteId ? { ...p, ...updatedData, updatedAt: new Date().toISOString() } : p
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPalettes));
        return updatedPalettes;
    } catch (error) {
        console.error('Error updating palette:', error);
        throw error;
    }
};
