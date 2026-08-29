import React, { useState } from 'react';

export function Tabs({ tabs, activeTab, onChange }) {
  const [selected, setSelected] = useState(activeTab || tabs[0]?.id);

  const handleTabClick = (tabId) => {
    setSelected(tabId);
    if (onChange) onChange(tabId);
  };

  return (
    <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
      {tabs.map((tab) => {
        const isActive = (activeTab !== undefined ? activeTab : selected) === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabClick(tab.id)}
            className={`flex-1 py-2 px-4 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              isActive 
                ? 'bg-white text-slate-900 shadow-sm font-bold' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
