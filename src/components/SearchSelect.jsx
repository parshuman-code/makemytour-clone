import React, { useState, useEffect, useRef } from 'react';

export function SearchSelect({ options = [], placeholder, value, onChange, icon, subtitle }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div
        className="border rounded-lg p-3 hover:border-blue-500 cursor-pointer bg-white transition-colors h-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-2">
          {icon}
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-500 truncate font-medium">{placeholder}</div>
            <input
              type="text"
              value={value || searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                onChange('');
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              className="font-bold text-slate-900 w-full bg-transparent outline-none text-sm cursor-pointer"
              placeholder={placeholder}
            />
            <div className="text-xs text-gray-400 truncate">{subtitle}</div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-xl max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors border-b border-gray-100 last:border-0"
                onClick={() => {
                  onChange(option.value);
                  setSearchTerm('');
                  setIsOpen(false);
                }}
              >
                {option.label}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-xs text-gray-500">No matching cities found</div>
          )}
        </div>
      )}
    </div>
  );
}
