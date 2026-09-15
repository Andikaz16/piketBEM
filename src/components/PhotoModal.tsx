'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

export default function PhotoModal({ isOpen, onClose, imageUrl, title }: PhotoModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-red-600/20 animate-scale-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h3 className="font-heading font-bold text-white uppercase tracking-wide">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-auto max-h-[70vh] object-contain rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}
