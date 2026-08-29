import React from 'react';
import { Bell, AlertTriangle, X, Plane } from 'lucide-react';

export default function NotificationToast({ notification, onClose }) {
  if (!notification) return null;

  const isWarning = notification.type === 'delay' || notification.type === 'gate';

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-emerald-50 text-emerald-950 rounded-xl shadow-xl border border-emerald-200/90 p-3 transition-all duration-300">
      <div className="flex items-start gap-2.5">
        
        {/* Icon Badge */}
        <div className={`p-2 rounded-lg flex-shrink-0 ${isWarning ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
          {isWarning ? <AlertTriangle className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
        </div>

        {/* Notification Body */}
        <div className="flex-1 min-w-0 space-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black tracking-wider uppercase text-emerald-800 flex items-center gap-1">
              <Plane className="w-3 h-3 text-emerald-600" />
              {notification.flightNumber} • Alert
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">Just now</span>
          </div>

          <h4 className="font-extrabold text-xs text-emerald-950 leading-tight">
            {notification.title}
          </h4>

          <p className="text-[11px] text-emerald-800 leading-snug">
            {notification.message}
          </p>

          {notification.reason && (
            <div className="mt-1.5 p-1.5 bg-emerald-100/70 rounded-md text-[10px] text-emerald-900 font-semibold border border-emerald-200/80">
              💡 {notification.reason}
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="text-emerald-600 hover:text-emerald-950 p-1 rounded-md hover:bg-emerald-100 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>

      </div>
    </div>
  );
}
