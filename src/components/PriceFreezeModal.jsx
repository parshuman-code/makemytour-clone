import React, { useState } from 'react';
import { X, ShieldCheck, Clock, AlertTriangle, CheckCircle2, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { savePriceFreeze } from '../utils/pricingEngine';

export default function PriceFreezeModal({ flight, onClose, onConfirmFreeze }) {
  const [duration, setDuration] = useState(24);
  const [isSuccess, setIsSuccess] = useState(false);
  const [frozenDetails, setFrozenDetails] = useState(null);

  if (!flight) return null;

  const currentPrice = flight.price || flight.basePrice || 5500;
  const freezeFee = duration === 24 ? 199 : 349;

  const handleLockPrice = () => {
    const freezeObj = savePriceFreeze(flight, currentPrice, duration);
    setFrozenDetails(freezeObj);
    setIsSuccess(true);
    if (onConfirmFreeze) {
      onConfirmFreeze(freezeObj);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white flex items-start justify-between relative overflow-hidden">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-extrabold uppercase tracking-wider mb-2">
              <Lock className="w-3.5 h-3.5" />
              Fare Guarantee Lock
            </span>
            <h3 className="text-xl font-black">Price Freeze Protection</h3>
            <p className="text-xs text-slate-300 mt-1 font-medium">
              Lock this fare today. If prices jump up to 20%, your price remains guaranteed!
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isSuccess ? (
          <div className="p-6 space-y-6">
            {/* Flight Overview Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 block">
                  {flight.airline || flight.flightName} ({flight.flightNumber || flight.code || 'FL-202'})
                </span>
                <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2 mt-0.5">
                  <span>{flight.from}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-rose-500" />
                  <span>{flight.to}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-semibold text-slate-400 block uppercase">Current Fare</span>
                <span className="text-xl font-black text-rose-600">₹{currentPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Lock Duration Selector */}
            <div className="space-y-3">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                Select Price Freeze Duration
              </label>

              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setDuration(24)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    duration === 24
                      ? 'border-rose-500 bg-rose-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-slate-900">24 Hours Lock</span>
                    <Clock className="w-4 h-4 text-rose-500" />
                  </div>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Protect fare for 1 full day</p>
                  <div className="mt-3 text-xs font-extrabold text-rose-600">₹199 lock fee</div>
                </div>

                <div
                  onClick={() => setDuration(48)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    duration === 48
                      ? 'border-rose-500 bg-rose-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-slate-900">48 Hours Lock</span>
                    <Clock className="w-4 h-4 text-rose-500" />
                  </div>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Extended weekend coverage</p>
                  <div className="mt-3 text-xs font-extrabold text-rose-600">₹349 lock fee</div>
                </div>
              </div>
            </div>

            {/* Perks & Protection Guarantee */}
            <div className="space-y-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 text-xs font-semibold text-emerald-900">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Locked fare guaranteed even if demand surge increases price by 20%</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>100% of lock fee refunded directly if you complete booking before expiry</span>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-2">
              <button
                onClick={handleLockPrice}
                className="w-full py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-5 h-5" />
                Freeze Price at ₹{currentPrice.toLocaleString('en-IN')} (Pay ₹{freezeFee})
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h4 className="text-2xl font-black text-slate-900">Price Frozen Successfully!</h4>
            <p className="text-xs text-slate-600 font-semibold max-w-sm mx-auto leading-relaxed">
              Your fare of <strong className="text-rose-600">₹{currentPrice.toLocaleString('en-IN')}</strong> for {flight.airline || flight.flightName} is now locked until{' '}
              <strong className="text-slate-900">
                {new Date(frozenDetails.expiresAt).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </strong>.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-1 text-xs text-slate-600 font-semibold">
              <div className="flex justify-between">
                <span>Freeze Guarantee Code:</span>
                <span className="font-extrabold text-slate-900">{frozenDetails.freezeId}</span>
              </div>
              <div className="flex justify-between">
                <span>Locked Fare:</span>
                <span className="font-extrabold text-emerald-600">₹{currentPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all"
              >
                Got It, View My Active Freezes
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
