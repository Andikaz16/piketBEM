'use client';

import { useRef, useState, useCallback } from 'react';
import { Camera, RotateCcw, Check } from 'lucide-react';

interface CameraCaptureProps {
  label: string;
  onCapture: (file: File) => void;
}

export default function CameraCapture({ label, onCapture }: CameraCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider text-left">{label}</label>

      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt={label}
            className="w-full h-48 object-cover rounded-xl border border-white/10"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
          <div className="absolute top-3 right-3 flex gap-2">
            <span className="bg-green-600/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg">
              <Check className="h-3.5 w-3.5" /> Terunggah
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="bg-black/60 backdrop-blur-sm text-gray-300 p-1.5 rounded-lg border border-white/10 hover:bg-red-600/80 hover:text-white hover:border-red-500 transition-all shadow-lg"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-48 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-red-500/50 hover:bg-red-500/5 transition-all group"
        >
          <div className="bg-red-600/10 p-4 rounded-2xl mb-3 group-hover:bg-red-600/20 transition-all group-hover:scale-110 duration-300">
            <Camera className="h-8 w-8 text-red-400" />
          </div>
          <span className="text-sm font-medium text-gray-400 group-hover:text-gray-300">Ketuk untuk mengambil foto</span>
          <span className="text-xs text-gray-600 mt-1">atau pilih dari galeri</span>
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
