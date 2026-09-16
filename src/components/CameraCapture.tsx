'use client';

import { useRef, useState, useCallback } from 'react';
import { Camera, RotateCcw, Check } from 'lucide-react';

interface CameraCaptureProps {
  label: string;
  onCapture: (file: File) => void;
}

// Compress image on client side to reduce upload size
function compressImage(file: File, maxWidth = 800, quality = 0.6): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Scale down if wider than maxWidth
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file); // fallback to original
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export default function CameraCapture({ label, onCapture }: CameraCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setCompressing(true);
        try {
          // Compress before passing to parent
          const compressed = await compressImage(file, 800, 0.6);

          const reader = new FileReader();
          reader.onloadend = () => {
            setPreview(reader.result as string);
          };
          reader.readAsDataURL(compressed);
          onCapture(compressed);
        } catch {
          // Fallback to original if compression fails
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreview(reader.result as string);
          };
          reader.readAsDataURL(file);
          onCapture(file);
        } finally {
          setCompressing(false);
        }
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
          onClick={() => !compressing && fileInputRef.current?.click()}
          className={`w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all group ${
            compressing 
              ? 'border-yellow-500/40 bg-yellow-500/5' 
              : 'border-white/20 hover:border-red-500 hover:bg-red-500/5'
          }`}
        >
          {compressing ? (
            <>
              <div className="h-10 w-10 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mb-3" />
              <span className="text-sm font-medium text-yellow-300">Mengompres foto...</span>
            </>
          ) : (
            <>
              <Camera className="h-10 w-10 text-gray-500 mb-3 group-hover:text-red-400 transition-colors" />
              <span className="text-sm font-medium text-gray-400 group-hover:text-gray-300">Ketuk untuk mengambil foto</span>
              <span className="text-xs text-gray-500 mt-1">atau pilih dari galeri</span>
            </>
          )}
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
