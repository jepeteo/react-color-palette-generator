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
    <div className="imageUpload">
      <h3 className="mb-2 w-full">Upload Image to find primary color</h3>
      <div className="block">
        <label
          htmlFor="imageToPrimary"
          className="block w-fit w-full cursor-pointer rounded-lg border border-blue-400 px-2 py-1 hover:bg-slate-200"
        >
          Upload
        </label>
        <input
          id="imageToPrimary"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-2 hidden text-sm"
        />
        {previewUrl && (
          <div className="flex">
            <img
              src={previewUrl}
              alt="Uploaded preview"
              className="mt-2 inline-block aspect-square max-w-24 object-cover"
            />
            <button
              onClick={clearImage}
              className="relative right-4 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-black text-white"
            >
              <span className="text-1xl -mt-1">x</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageUpload;
