'use client';

import { useState } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';

interface R2UploadProps {
  onUpload: (url: string) => void;
  resourceType?: 'image' | 'video';
  currentUrl?: string;
  className?: string;
}

export default function R2Upload({ 
  onUpload, 
  resourceType = 'image', 
  currentUrl, 
  className = '' 
}: R2UploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('resource_type', resourceType);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur upload');
      }

      const data = await response.json();
      onUpload(data.url);
    } catch (err: any) {
      console.error('Erreur upload:', err);
      setError(err.message || 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    onUpload('');
    setError('');
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Zone d'upload */}
      <div className="relative">
        <input
          type="file"
          id={`upload-${resourceType}`}
          accept={resourceType === 'video' ? 'video/*' : 'image/*'}
          onChange={handleFileUpload}
          disabled={uploading}
          className="hidden"
        />
        
        <label
          htmlFor={`upload-${resourceType}`}
          className={`
            flex flex-col items-center justify-center w-full h-32 
            border-2 border-dashed border-gray-600 rounded-lg 
            bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer
            transition-colors duration-200
            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {uploading ? (
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              <span className="text-sm text-gray-400">Upload en cours...</span>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm text-gray-400">
                Cliquez pour uploader {resourceType === 'video' ? 'une vidéo' : 'une image'}
              </span>
              <span className="text-xs text-gray-500 block mt-1">
                Max {resourceType === 'video' ? '50MB' : '10MB'}
              </span>
            </div>
          )}
        </label>
      </div>

      {/* Aperçu du fichier actuel */}
      {currentUrl && (
        <div className="relative bg-gray-800 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Fichier actuel :</span>
            <button
              onClick={removeFile}
              className="text-red-400 hover:text-red-300 p-1"
              title="Supprimer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {resourceType === 'video' ? (
            <video
              src={currentUrl}
              className="w-full h-24 object-cover rounded"
              controls
            />
          ) : (
            <img
              src={currentUrl}
              alt="Aperçu"
              className="w-full h-24 object-cover rounded"
            />
          )}
          
          <div className="mt-2 text-xs text-gray-500 break-all">
            {currentUrl}
          </div>
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className="bg-red-900/50 border border-red-500 rounded p-3">
          <span className="text-red-300 text-sm">{error}</span>
        </div>
      )}
    </div>
  );
}