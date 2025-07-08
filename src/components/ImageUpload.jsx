import React, { useState, useRef } from 'react';

function ImageUpload({ onImageUpload }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.substr(0, 5) === 'image') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        onImageUpload(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setPreviewUrl(null);
    onImageUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300">
        🖼️ Extract from Image
      </label>

      <div className="space-y-3">
        <label
          htmlFor="imageToPrimary"
          className="btn-secondary cursor-pointer inline-flex items-center gap-2 w-full justify-center"
        >
          📁 Choose Image
        </label>
        <input
          id="imageToPrimary"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {previewUrl && (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Uploaded preview"
              className="w-full h-20 object-cover rounded-xl border border-white border-opacity-20"
            />
            <button
              onClick={clearImage}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm hover:bg-red-600 transition-colors"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageUpload;
