import React, { useCallback, useState } from 'react';
import { UploadCloud, FileImage, X } from 'lucide-react';

export default function UploadBox({ onUpload }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    onUpload(file);
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    setPreview(null);
    onUpload(null);
  };

  return (
    <div 
      className={`relative w-full max-w-xl mx-auto mt-8 p-6 border-2 border-dashed rounded-2xl transition-all duration-300 ${
        dragActive ? "border-blue-500 bg-blue-500/10" : "border-slate-700 bg-slate-800/50 hover:bg-slate-800"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleChange} 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
      />
      
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        {preview ? (
          <div className="relative w-full aspect-square max-h-64 rounded-xl overflow-hidden shadow-2xl">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button 
              onClick={clearFile}
              className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-colors z-10"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <>
            <div className="p-4 bg-blue-500/20 rounded-full">
              <UploadCloud className="w-12 h-12 text-blue-400" />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-200">
                Drag & drop your MRI scan here
              </p>
              <p className="text-sm text-slate-400 mt-1">
                or click to browse from your computer
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <FileImage size={14} />
              <span>Supports JPG, PNG, DICOM (converted)</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
