import React from 'react';

export function Button({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '', 
  disabled = false,
  ...props 
}) {
  const baseStyle = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none rounded-xl active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    default: 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-500/20 hover:from-red-700 hover:to-rose-700',
    navy: 'bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-900/20',
    outline: 'border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
