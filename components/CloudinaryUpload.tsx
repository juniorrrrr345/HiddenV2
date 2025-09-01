'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Camera } from 'lucide-react';

interface CloudinaryUploadProps {
  onUpload: (url: string) => void;
  currentImage?: string;
  onRemove?: () => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
}

export default function CloudinaryUpload({
  onUpload,
  currentImage,
  onRemove,
  accept = "image/*",
  multiple = false,
  maxFiles = 1
}: CloudinaryUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const file = files[0]; // Pour l'instant, on ne prend que le premier fichier
      
      // Créer FormData pour l'upload
      const formData = new FormData();
      formData.append('file', file);

      // Upload vers notre API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload');
      }

      const data = await response.json();
      onUpload(data.url);
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
        className="hidden"
      />

      {currentImage ? (
        <div className="relative">
          <div className="aspect-square bg-gray-800 rounded-2xl overflow-hidden border-4 border-white">
            <img
              src={currentImage}
              alt="Product image"
              className="w-full h-full object-cover"
            />
          </div>
          
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-colors border-2 border-white"
            >
              <X size={20} />
            </button>
          )}
          
          <button
            type="button"
            onClick={openFileDialog}
            disabled={uploading}
            className="absolute bottom-4 right-4 bg-black/80 text-white rounded-full p-3 hover:bg-black transition-colors border-2 border-white"
          >
            <Camera size={20} />
          </button>
        </div>
      ) : (
        <div
          onClick={openFileDialog}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`aspect-square border-4 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
            dragActive
              ? 'border-white bg-white/10'
              : 'border-gray-400 hover:border-white hover:bg-white/5'
          } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
        >
          {uploading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white font-bold">Upload en cours...</p>
            </div>
          ) : (
            <div className="text-center p-8">
              <div className="bg-white/10 rounded-full p-6 mb-4 mx-auto w-fit">
                <ImageIcon size={48} className="text-white" />
              </div>
              <p className="text-white font-bold text-lg mb-2">
                Ajouter une photo
              </p>
              <p className="text-gray-300 text-sm mb-4">
                Glissez-déposez ou cliquez pour sélectionner
              </p>
              <div className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors">
                <Upload size={20} />
                Choisir une image
              </div>
              <p className="text-gray-400 text-xs mt-4">
                Formats supportés: JPG, PNG, WEBP<br/>
                Taille max: 10MB
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}