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
      <label className="block text-sm font-semibold text-gray-300 mb-1.5 uppercase tracking-wide text-left">{label}</label>

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt={label}
            className="w-full h-48 object-cover rounded-xl border border-white/10"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <span className="bg-green-600/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg">
              <Check className="h-3.5 w-3.5" /> Terunggah
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="bg-dark-900/80 backdrop-blur-sm text-gray-300 p-1.5 rounded-lg border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-lg"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-48 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-red-500 hover:bg-red-500/5 transition-all group"
        >
          <Camera className="h-10 w-10 text-gray-500 mb-3 group-hover:text-red-400 transition-colors" />
          <span className="text-sm font-medium text-gray-400 group-hover:text-gray-300">Ketuk untuk mengambil foto</span>
          <span className="text-xs text-gray-500 mt-1">atau pilih dari galeri</span>
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
