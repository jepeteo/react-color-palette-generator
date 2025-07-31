import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { useColorPalette } from '../../../hooks/useColorPalette';
import {
    selectPalette,
    selectPrimaryColor,
    selectHarmonyType,
    setPalette
} from '../../../store/slices/paletteSlice';
import {
    addNotification,
    setError,
    setShowModal
} from '../../../store/slices/uiSlice';

/**
 * Comprehensive PaletteLibrary component for saving and managing color palettes
 */
const PaletteLibrary = () => {
    const dispatch = useDispatch();
    const palette = useSelector(selectPalette);
    const primaryColor = useSelector(selectPrimaryColor);
    const harmonyType = useSelector(selectHarmonyType);

    const { generatePalette } = useColorPalette();

    const [savedPalettes, setSavedPalettes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest'); // newest, oldest, name, harmony
    const [filterBy, setFilterBy] = useState('all'); // all, complementary, analogous, etc.
    const [isLoading, setIsLoading] = useState(false);
    const [editingPalette, setEditingPalette] = useState(null);
    const [newPaletteName, setNewPaletteName] = useState('');
    const [showSaveDialog, setShowSaveDialog] = useState(false);

    // Load saved palettes from localStorage on component mount
    useEffect(() => {
        loadSavedPalettes();
    }, []);

    // Load palettes from localStorage
    const loadSavedPalettes = useCallback(() => {
        try {
            const saved = localStorage.getItem('colorPalettes');
            if (saved) {
                const palettes = JSON.parse(saved);
                setSavedPalettes(palettes);
            }
        } catch (error) {
            console.error('Error loading saved palettes:', error);
            dispatch(setError({
                message: 'Failed to load saved palettes',
                details: error.message
            }));
        }
    }, [dispatch]);

    // Save palettes to localStorage
    const savePalettesToStorage = useCallback((palettes) => {
        try {
            localStorage.setItem('colorPalettes', JSON.stringify(palettes));
        } catch (error) {
            console.error('Error saving palettes:', error);
            dispatch(setError({
                message: 'Failed to save palettes',
                details: 'Local storage may be full or unavailable'
            }));
        }
    }, [dispatch]);

    // Save current palette
    const saveCurrentPalette = useCallback((name) => {
        if (!palette.colors || palette.colors.length === 0) {
            dispatch(setError({
                message: 'No palette to save',
                details: 'Generate a color palette first'
            }));
            return;
        }

        if (!name || name.trim() === '') {
            dispatch(setError({
                message: 'Please enter a palette name',
                details: 'A name is required to save the palette'
            }));
            return;
        }

        const newPalette = {
            id: Date.now().toString(),
            name: name.trim(),
            colors: [...palette.colors],
            primaryColor,
            harmonyType: harmonyType || 'complementary',
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString(),
            tags: [harmonyType || 'complementary'],
            metadata: {
                colorCount: palette.colors.length,
                dominantHue: getDominantHue(palette.colors),
                averageLightness: getAverageLightness(palette.colors)
            }
        };

        const updatedPalettes = [newPalette, ...savedPalettes];
        setSavedPalettes(updatedPalettes);
        savePalettesToStorage(updatedPalettes);

        dispatch(addNotification({
            type: 'success',
            message: `Palette "${name}" saved successfully`,
            duration: 3000
        }));

        setShowSaveDialog(false);
        setNewPaletteName('');
    }, [palette, primaryColor, harmonyType, savedPalettes, savePalettesToStorage, dispatch]);

    // Load a saved palette
    const loadPalette = useCallback((savedPalette) => {
        try {
            dispatch(setPalette({
                colors: savedPalette.colors,
                timestamp: Date.now()
            }));

            // Also update base color and harmony if available
            if (savedPalette.primaryColor) {
                // You might want to add a setBaseColor action dispatch here
            }

            dispatch(addNotification({
                type: 'success',
                message: `Loaded palette "${savedPalette.name}"`,
                duration: 2000
            }));
        } catch (error) {
            console.error('Error loading palette:', error);
            dispatch(setError({
                message: 'Failed to load palette',
                details: error.message
            }));
        }
    }, [dispatch]);

    // Delete a saved palette
    const deletePalette = useCallback((paletteId) => {
        const paletteToDelete = savedPalettes.find(p => p.id === paletteId);
        if (!paletteToDelete) return;

        const updatedPalettes = savedPalettes.filter(p => p.id !== paletteId);
        setSavedPalettes(updatedPalettes);
        savePalettesToStorage(updatedPalettes);

        dispatch(addNotification({
            type: 'success',
            message: `Deleted palette "${paletteToDelete.name}"`,
            duration: 2000
        }));
    }, [savedPalettes, savePalettesToStorage, dispatch]);

    // Duplicate a palette
    const duplicatePalette = useCallback((paletteId) => {
        const originalPalette = savedPalettes.find(p => p.id === paletteId);
        if (!originalPalette) return;

        const duplicatedPalette = {
            ...originalPalette,
            id: Date.now().toString(),
            name: `${originalPalette.name} (Copy)`,
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString()
        };

        const updatedPalettes = [duplicatedPalette, ...savedPalettes];
        setSavedPalettes(updatedPalettes);
        savePalettesToStorage(updatedPalettes);

        dispatch(addNotification({
            type: 'success',
            message: `Duplicated palette "${originalPalette.name}"`,
            duration: 2000
        }));
    }, [savedPalettes, savePalettesToStorage, dispatch]);

    // Update palette name
    const updatePaletteName = useCallback((paletteId, newName) => {
        if (!newName || newName.trim() === '') return;

        const updatedPalettes = savedPalettes.map(p =>
            p.id === paletteId
                ? { ...p, name: newName.trim(), modifiedAt: new Date().toISOString() }
                : p
        );

        setSavedPalettes(updatedPalettes);
        savePalettesToStorage(updatedPalettes);
        setEditingPalette(null);

        dispatch(addNotification({
            type: 'success',
            message: 'Palette name updated',
            duration: 2000
        }));
    }, [savedPalettes, savePalettesToStorage, dispatch]);

    // Export all palettes
    const exportAllPalettes = useCallback(() => {
        if (savedPalettes.length === 0) {
            dispatch(addNotification({
                type: 'warning',
                message: 'No palettes to export',
                duration: 2000
            }));
            return;
        }

        const exportData = {
            exportDate: new Date().toISOString(),
            version: '1.0',
            totalPalettes: savedPalettes.length,
            palettes: savedPalettes
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `color-palettes-backup-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        dispatch(addNotification({
            type: 'success',
            message: `Exported ${savedPalettes.length} palettes`,
            duration: 2000
        }));
    }, [savedPalettes, dispatch]);

    // Import palettes
    const importPalettes = useCallback((event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importData = JSON.parse(e.target.result);

                if (!importData.palettes || !Array.isArray(importData.palettes)) {
                    throw new Error('Invalid file format');
                }

                const importedPalettes = importData.palettes.map(p => ({
                    ...p,
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                    name: `${p.name} (Imported)`,
                    createdAt: new Date().toISOString()
                }));

                const updatedPalettes = [...importedPalettes, ...savedPalettes];
                setSavedPalettes(updatedPalettes);
                savePalettesToStorage(updatedPalettes);

                dispatch(addNotification({
                    type: 'success',
                    message: `Imported ${importedPalettes.length} palettes`,
                    duration: 3000
                }));
            } catch (error) {
                console.error('Import error:', error);
                dispatch(setError({
                    message: 'Failed to import palettes',
                    details: 'Please check the file format'
                }));
            }
        };
        reader.readAsText(file);

        // Reset input
        event.target.value = '';
    }, [savedPalettes, savePalettesToStorage, dispatch]);

    // Helper functions
    const getDominantHue = useCallback((colors) => {
        // Simple hue analysis - can be enhanced
        try {
            const hues = colors.map(color => {
                const hex = color.replace('#', '');
                const r = parseInt(hex.substr(0, 2), 16) / 255;
                const g = parseInt(hex.substr(2, 2), 16) / 255;
                const b = parseInt(hex.substr(4, 2), 16) / 255;

                const max = Math.max(r, g, b);
                const min = Math.min(r, g, b);
                const diff = max - min;

                if (diff === 0) return 0;

                let hue;
                if (max === r) hue = ((g - b) / diff) % 6;
                else if (max === g) hue = (b - r) / diff + 2;
                else hue = (r - g) / diff + 4;

                return Math.round(hue * 60);
            });

            return Math.round(hues.reduce((a, b) => a + b, 0) / hues.length);
        } catch (error) {
            return 0;
        }
    }, []);

    const getAverageLightness = useCallback((colors) => {
        try {
            const lightnesses = colors.map(color => {
                const hex = color.replace('#', '');
                const r = parseInt(hex.substr(0, 2), 16);
                const g = parseInt(hex.substr(2, 2), 16);
                const b = parseInt(hex.substr(4, 2), 16);
                return (r + g + b) / 3;
            });

            return Math.round(lightnesses.reduce((a, b) => a + b, 0) / lightnesses.length);
        } catch (error) {
            return 128;
        }
    }, []);

    // Filter and sort palettes
    const filteredAndSortedPalettes = useMemo(() => {
        let filtered = savedPalettes;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(palette =>
                palette.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                palette.harmonyType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                palette.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Apply harmony filter
        if (filterBy !== 'all') {
            filtered = filtered.filter(palette => palette.harmonyType === filterBy);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'harmony':
                    return a.harmonyType.localeCompare(b.harmonyType);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [savedPalettes, searchTerm, filterBy, sortBy]);

    // Get unique harmony types for filter
    const availableHarmonyTypes = useMemo(() => {
        const types = [...new Set(savedPalettes.map(p => p.harmonyType))];
        return types.sort();
    }, [savedPalettes]);

    return (
        <Card title="Palette Library" subtitle="Save, organize, and manage your color palettes">
            <div className="space-y-6">
                {/* Save Current Palette */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-blue-400">Save Current Palette</h3>
                        <Button
                            onClick={() => setShowSaveDialog(true)}
                            variant="primary"
                            size="sm"
                            icon={<span>💾</span>}
                            disabled={!palette.colors || palette.colors.length === 0}
                        >
                            Save Palette
                        </Button>
                    </div>

                    {palette.colors && palette.colors.length > 0 ? (
                        <div className="flex h-12 rounded overflow-hidden">
                            {palette.colors.map((color, index) => (
                                <div
                                    key={index}
                                    className="flex-1"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4 text-blue-300/60">
                            <p>Generate a palette to save it</p>
                        </div>
                    )}
                </div>

                {/* Save Dialog */}
                {showSaveDialog && (
                    <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                        <h4 className="text-white/90 font-medium mb-3">Save Palette</h4>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                placeholder="Enter palette name..."
                                value={newPaletteName}
                                onChange={(e) => setNewPaletteName(e.target.value)}
                                className="flex-1 bg-white/10 border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        saveCurrentPalette(newPaletteName);
                                    } else if (e.key === 'Escape') {
                                        setShowSaveDialog(false);
                                        setNewPaletteName('');
                                    }
                                }}
                                autoFocus
                            />
                            <Button
                                onClick={() => saveCurrentPalette(newPaletteName)}
                                variant="primary"
                                size="sm"
                                disabled={!newPaletteName.trim()}
                            >
                                Save
                            </Button>
                            <Button
                                onClick={() => {
                                    setShowSaveDialog(false);
                                    setNewPaletteName('');
                                }}
                                variant="outline"
                                size="sm"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {/* Library Controls */}
                {savedPalettes.length > 0 && (
                    <div className="space-y-4">
                        {/* Search and Filters */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <input
                                type="text"
                                placeholder="Search palettes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="name">Name A-Z</option>
                                <option value="harmony">Harmony Type</option>
                            </select>

                            <select
                                value={filterBy}
                                onChange={(e) => setFilterBy(e.target.value)}
                                className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            >
                                <option value="all">All Harmonies</option>
                                {availableHarmonyTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>

                            <div className="flex gap-2">
                                <Button
                                    onClick={exportAllPalettes}
                                    variant="outline"
                                    size="sm"
                                    icon={<span>📤</span>}
                                >
                                    Export
                                </Button>
                                <label className="cursor-pointer">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={<span>📥</span>}
                                        as="span"
                                    >
                                        Import
                                    </Button>
                                    <input
                                        type="file"
                                        accept=".json"
                                        onChange={importPalettes}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Library Stats */}
                        <div className="flex items-center gap-4 text-sm text-white/60">
                            <span>Total: {savedPalettes.length} palettes</span>
                            <span>Showing: {filteredAndSortedPalettes.length}</span>
                            {searchTerm && <span>Search: "{searchTerm}"</span>}
                            {filterBy !== 'all' && <span>Filter: {filterBy}</span>}
                        </div>
                    </div>
                )}

                {/* Saved Palettes Grid */}
                {filteredAndSortedPalettes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredAndSortedPalettes.map((savedPalette) => (
                            <div
                                key={savedPalette.id}
                                className="bg-white/5 border border-white/20 rounded-lg p-4 hover:bg-white/10 transition-colors"
                            >
                                {/* Palette Header */}
                                <div className="flex items-center justify-between mb-3">
                                    {editingPalette === savedPalette.id ? (
                                        <input
                                            type="text"
                                            defaultValue={savedPalette.name}
                                            className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                            onBlur={(e) => updatePaletteName(savedPalette.id, e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    updatePaletteName(savedPalette.id, e.target.value);
                                                } else if (e.key === 'Escape') {
                                                    setEditingPalette(null);
                                                }
                                            }}
                                            autoFocus
                                        />
                                    ) : (
                                        <h4
                                            className="font-medium text-white/90 cursor-pointer hover:text-white transition-colors"
                                            onClick={() => setEditingPalette(savedPalette.id)}
                                            title="Click to edit name"
                                        >
                                            {savedPalette.name}
                                        </h4>
                                    )}

                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => loadPalette(savedPalette)}
                                            className="p-1 rounded hover:bg-white/10 transition-colors text-white/60 hover:text-white/90"
                                            title="Load palette"
                                        >
                                            📂
                                        </button>
                                        <button
                                            onClick={() => duplicatePalette(savedPalette.id)}
                                            className="p-1 rounded hover:bg-white/10 transition-colors text-white/60 hover:text-white/90"
                                            title="Duplicate palette"
                                        >
                                            📄
                                        </button>
                                        <button
                                            onClick={() => deletePalette(savedPalette.id)}
                                            className="p-1 rounded hover:bg-red-500/20 transition-colors text-white/60 hover:text-red-400"
                                            title="Delete palette"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>

                                {/* Color Swatches */}
                                <div className="flex h-12 rounded overflow-hidden mb-3 cursor-pointer" onClick={() => loadPalette(savedPalette)}>
                                    {savedPalette.colors.map((color, index) => (
                                        <div
                                            key={index}
                                            className="flex-1 hover:scale-105 transition-transform"
                                            style={{ backgroundColor: color }}
                                            title={`${color} - Click to load palette`}
                                        />
                                    ))}
                                </div>

                                {/* Palette Metadata */}
                                <div className="space-y-1 text-xs text-white/60">
                                    <div className="flex justify-between">
                                        <span>Harmony: {savedPalette.harmonyType}</span>
                                        <span>{savedPalette.colors.length} colors</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Created: {new Date(savedPalette.createdAt).toLocaleDateString()}</span>
                                        {savedPalette.primaryColor && (
                                            <span style={{ color: savedPalette.primaryColor }}>
                                                ● Primary: {savedPalette.primaryColor}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-white/60">
                        {savedPalettes.length === 0 ? (
                            <div>
                                <div className="text-6xl mb-4">🎨</div>
                                <p className="text-lg mb-2">No saved palettes yet</p>
                                <p>Create and save your first color palette to get started</p>
                            </div>
                        ) : (
                            <div>
                                <div className="text-6xl mb-4">🔍</div>
                                <p className="text-lg mb-2">No palettes match your search</p>
                                <p>Try adjusting your search or filter criteria</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Tips */}
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                    <h5 className="text-sm font-medium text-purple-400 mb-1">💡 Library Tips</h5>
                    <ul className="text-xs text-purple-300/80 space-y-1">
                        <li>• Click on palette names to edit them</li>
                        <li>• Click on color swatches to load a palette</li>
                        <li>• Export your library as backup before making major changes</li>
                        <li>• Use search and filters to quickly find specific palettes</li>
                    </ul>
                </div>
            </div>
        </Card>
    );
};

export default PaletteLibrary;
