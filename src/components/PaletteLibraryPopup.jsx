import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    addSavedPalette,
    removeSavedPalette,
    updateSavedPalette,
    loadPaletteFromSaved
} from '../store/colorSlice';
import {
    savePaletteToStorage,
    deletePaletteFromStorage,
    updatePaletteInStorage
} from '../utils/paletteStorage';
import { BsSave, BsTrash, BsEye, BsPencil, BsX } from 'react-icons/bs';

const PaletteLibraryPopup = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const palette = useSelector((state) => state.color.palette);
    const harmony = useSelector((state) => state.color.harmony);
    const isDarkMode = useSelector((state) => state.color.isDarkMode);
    const savedPalettes = useSelector((state) => state.color.savedPalettes);

    const [newPaletteName, setNewPaletteName] = useState('');
    const [editingPalette, setEditingPalette] = useState(null);
    const [editName, setEditName] = useState('');

    const handleSavePalette = () => {
        if (!palette) return;

        const paletteToSave = {
            name: newPaletteName.trim() || `Palette ${savedPalettes.length + 1}`,
            colors: palette,
            harmony: harmony,
            isDarkMode: isDarkMode,
        };

        try {
            const savedPalette = savePaletteToStorage(paletteToSave);
            dispatch(addSavedPalette(savedPalette));
            setNewPaletteName('');
            alert('Palette saved successfully!');
        } catch (error) {
            alert('Failed to save palette. Please try again.');
        }
    };

    const handleDeletePalette = (paletteId) => {
        if (window.confirm('Are you sure you want to delete this palette?')) {
            try {
                deletePaletteFromStorage(paletteId);
                dispatch(removeSavedPalette(paletteId));
            } catch (error) {
                alert('Failed to delete palette. Please try again.');
            }
        }
    };

    const handleLoadPalette = (savedPalette) => {
        dispatch(loadPaletteFromSaved(savedPalette));
        onClose();
    };

    const handleEditPalette = (savedPalette) => {
        setEditingPalette(savedPalette.id);
        setEditName(savedPalette.name);
    };

    const handleUpdatePaletteName = (paletteId) => {
        if (editName.trim()) {
            try {
                const updatedData = { name: editName.trim() };
                updatePaletteInStorage(paletteId, updatedData);
                dispatch(updateSavedPalette({ id: paletteId, updatedData }));
                setEditingPalette(null);
                setEditName('');
            } catch (error) {
                alert('Failed to update palette name. Please try again.');
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black bg-opacity-50"
                onClick={onClose}
            />

            {/* Popup */}
            <div className="fixed inset-4 z-50 flex items-center justify-center">
                <div className="max-h-full w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b bg-gray-50 p-4">
                        <h2 className="text-xl font-bold text-gray-800">Palette Library</h2>
                        <button
                            onClick={onClose}
                            className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800"
                        >
                            <BsX size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="max-h-96 overflow-y-auto p-4">
                        {/* Save Current Palette */}
                        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <h3 className="mb-3 font-medium text-gray-800">Save Current Palette</h3>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newPaletteName}
                                    onChange={(e) => setNewPaletteName(e.target.value)}
                                    placeholder="Enter palette name (optional)"
                                    className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                                <button
                                    onClick={handleSavePalette}
                                    disabled={!palette}
                                    className="flex items-center gap-2 rounded bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-600 disabled:bg-gray-400"
                                >
                                    <BsSave size={14} />
                                    Save
                                </button>
                            </div>
                        </div>

                        {/* Saved Palettes List */}
                        <div>
                            <h3 className="mb-3 font-medium text-gray-800">
                                Saved Palettes ({savedPalettes.length})
                            </h3>

                            {savedPalettes.length === 0 ? (
                                <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center">
                                    <p className="text-gray-500">No saved palettes yet</p>
                                    <p className="text-sm text-gray-400">Save your first palette above!</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {savedPalettes.map((savedPalette) => (
                                        <div
                                            key={savedPalette.id}
                                            className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
                                        >
                                            <div className="mb-3 flex items-start justify-between">
                                                {editingPalette === savedPalette.id ? (
                                                    <div className="flex flex-1 gap-2">
                                                        <input
                                                            type="text"
                                                            value={editName}
                                                            onChange={(e) => setEditName(e.target.value)}
                                                            className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                                                            onKeyPress={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    handleUpdatePaletteName(savedPalette.id);
                                                                }
                                                            }}
                                                        />
                                                        <button
                                                            onClick={() => handleUpdatePaletteName(savedPalette.id)}
                                                            className="rounded bg-green-500 px-3 py-1 text-xs text-white hover:bg-green-600"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingPalette(null)}
                                                            className="rounded bg-gray-500 px-3 py-1 text-xs text-white hover:bg-gray-600"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="flex-1">
                                                            <h4 className="font-medium text-gray-900">{savedPalette.name}</h4>
                                                            <p className="text-xs text-gray-500">
                                                                {formatDate(savedPalette.createdAt)}
                                                                {savedPalette.updatedAt && ' (edited)'}
                                                            </p>
                                                            <p className="text-xs text-gray-600">
                                                                {savedPalette.harmony} • {savedPalette.isDarkMode ? 'Dark' : 'Light'}
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => handleLoadPalette(savedPalette)}
                                                                className="rounded bg-blue-500 p-2 text-white transition-colors hover:bg-blue-600"
                                                                title="Load palette"
                                                            >
                                                                <BsEye size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleEditPalette(savedPalette)}
                                                                className="rounded bg-yellow-500 p-2 text-white transition-colors hover:bg-yellow-600"
                                                                title="Edit name"
                                                            >
                                                                <BsPencil size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeletePalette(savedPalette.id)}
                                                                className="rounded bg-red-500 p-2 text-white transition-colors hover:bg-red-600"
                                                                title="Delete palette"
                                                            >
                                                                <BsTrash size={14} />
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {/* Color Preview */}
                                            <div className="flex gap-1">
                                                {Object.entries(savedPalette.colors).map(([name, color]) => (
                                                    <div
                                                        key={name}
                                                        className="h-8 flex-1 rounded border border-gray-300"
                                                        style={{ backgroundColor: color }}
                                                        title={`${name}: ${color}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaletteLibraryPopup;
