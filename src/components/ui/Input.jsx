import React from 'react';

export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
          {label}
        </label>
      )}
      <input 
        className={`w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${error ? 'border-red-500 ring-1 ring-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
