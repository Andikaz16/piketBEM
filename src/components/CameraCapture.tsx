'use client';

import { useRef, useState, useCallback } from 'react';
import { Camera, RotateCcw, Upload, Check } from 'lucide-react';

interface CameraCaptureProps {
  label: string;
  onCapture: (file: File) => void;
}

export default function CameraCapture({ label, onCapture }: CameraCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setFileName(file.name);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        onCapture(file);
      }
    },
    [onCapture]
  );

  const handleReset = () => {
    setPreview(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt={label}
            className="w-full h-48 object-cover rounded-lg border border-gray-200"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <span className="bg-green-500 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
              <Check className="h-3 w-3" /> Terunggah
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="bg-white text-gray-700 p-1.5 rounded-md shadow-sm border border-gray-200 hover:bg-gray-50"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
        >
          <Camera className="h-10 w-10 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">Ketuk untuk mengambil foto</span>
          <span className="text-xs text-gray-400 mt-1">atau pilih dari galeri</span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
