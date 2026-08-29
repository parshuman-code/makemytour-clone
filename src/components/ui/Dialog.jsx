import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function Dialog({ isOpen, onClose, children, maxWidth = 'max-w-md' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true"
      />
      <div className={`relative w-full ${maxWidth} bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-slate-100 transform transition-all duration-300`}>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ title, subtitle, onClose }) {
  return (
    <div className="flex items-start justify-between p-6 border-b border-slate-100 bg-slate-50/50">
      <div>
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export function DialogContent({ children, className = '' }) {
  return (
    <div className={`p-6 max-h-[80vh] overflow-y-auto ${className}`}>
      {children}
    </div>
  );
}
