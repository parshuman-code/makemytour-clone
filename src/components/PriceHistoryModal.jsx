import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Info, ShieldCheck, Sparkles, Calendar, ArrowRight } from 'lucide-react';
import { generatePriceHistoryData } from '../utils/pricingEngine';

export default function PriceHistoryModal({ flight, onClose, onFreezePrice }) {
  const [historyData, setHistoryData] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  useEffect(() => {
    if (!flight) return;
    const flightId = flight._id || flight.id || 'FL-202';
    const basePrice = flight.basePrice || flight.price || 5500;

    // Try fetching real API data or generate deterministic history
    fetch(`/api/flight/price-history/${flightId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.history) {
          setHistoryData(data);
        } else {
          setHistoryData(generatePriceHistoryData(flightId, basePrice));
        }
      })
      .catch(() => {
        setHistoryData(generatePriceHistoryData(flightId, basePrice));
      });
  }, [flight]);

  if (!flight || !historyData) return null;

  const { history, summary } = historyData;

  // Chart dimensions & calculations
  const width = 640;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;

  const prices = history.map(h => h.price);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  const priceRange = maxP - minP || 1;

  // Map data points to SVG coordinates
  const points = history.map((item, index) => {
    const x = paddingX + (index / (history.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((item.price - minP) / priceRange) * (height - paddingY * 2);
    return { ...item, x, y };
  });

  const svgPathD = points.reduce((acc, point, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
  }, '');

  const areaPathD = `${svgPathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-widest mb-1">
              <TrendingUp className="w-4 h-4" />
              Dynamic Pricing Engine Analytics
            </div>
            <h3 className="text-xl font-black flex items-center gap-2">
              <span>{flight.airline || flight.flightName || 'SkyHigh'}</span>
              <span className="text-slate-400 font-normal text-sm">({flight.flightNumber || flight.code || 'FL-202'})</span>
            </h3>
            <p className="text-xs text-slate-300 font-medium mt-1 flex items-center gap-1.5">
              <span>{flight.from}</span>
              <ArrowRight className="w-3 h-3 text-rose-400" />
              <span>{flight.to}</span>
              <span className="mx-1">•</span>
              <span>Past 30 Days Price History</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Summary Cards */}
        <div className="grid grid-cols-4 gap-3 p-5 bg-slate-50 border-b border-slate-100 text-center">
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Current Fare</span>
            <span className="text-lg font-black text-slate-900">₹{summary.currentPrice.toLocaleString('en-IN')}</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-[11px] font-semibold text-emerald-500 block uppercase">Lowest (30D)</span>
            <span className="text-lg font-black text-emerald-600">₹{summary.minPrice.toLocaleString('en-IN')}</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Average</span>
            <span className="text-lg font-black text-slate-700">₹{summary.avgPrice.toLocaleString('en-IN')}</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-[11px] font-semibold text-rose-500 block uppercase">Peak Fare</span>
            <span className="text-lg font-black text-rose-600">₹{summary.maxPrice.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Interactive SVG Chart Section */}
        <div className="p-6 relative">
          <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Fare Timeline (30 Days Ago → Today)
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Lowest
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span> Peak
              </span>
            </div>
          </div>

          <div className="relative bg-slate-50/50 rounded-2xl border border-slate-200/60 p-2 overflow-hidden">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e53935" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#e53935" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#e2e8f0" strokeDasharray="4 4" />
              <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="#e2e8f0" strokeDasharray="4 4" />
              <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#e2e8f0" strokeDasharray="4 4" />

              {/* Area Under Line */}
              <path d={areaPathD} fill="url(#priceGradient)" />

              {/* Trend Line */}
              <path d={svgPathD} fill="none" stroke="#e53935" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

              {/* Points */}
              {points.map((pt, idx) => {
                const isHovered = hoveredPoint?.date === pt.date;
                let dotColor = "#e53935";
                if (pt.isLowest) dotColor = "#10b981";
                if (pt.isHighest) dotColor = "#f43f5e";

                return (
                  <g key={idx}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 7 : (pt.isLowest || pt.isHighest ? 5 : 3.5)}
                      fill={dotColor}
                      stroke="#ffffff"
                      strokeWidth={isHovered ? 3 : 2}
                      className="cursor-pointer transition-all duration-200"
                      onMouseEnter={() => setHoveredPoint(pt)}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredPoint && (
              <div 
                className="absolute bg-slate-900 text-white text-xs px-3 py-2 rounded-xl shadow-xl border border-slate-700 pointer-events-none z-20 transition-all duration-150"
                style={{
                  left: `${Math.min(Math.max((hoveredPoint.x / width) * 100, 15), 85)}%`,
                  top: `${Math.max((hoveredPoint.y / height) * 100 - 25, 10)}%`,
                  transform: 'translate(-50%, -100%)'
                }}
              >
                <div className="font-bold text-slate-300">{hoveredPoint.displayDate}</div>
                <div className="text-base font-black text-rose-400">₹{hoveredPoint.price.toLocaleString('en-IN')}</div>
                {hoveredPoint.isLowest && <div className="text-[10px] text-emerald-400 font-bold">Lowest fare recorded</div>}
                {hoveredPoint.isHighest && <div className="text-[10px] text-rose-400 font-bold">Peak fare recorded</div>}
              </div>
            )}
          </div>
        </div>

        {/* Buying Advice & Dynamic Engine Insights */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4">
          <div className="flex items-start gap-3 bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4">
            <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-wide">
                Smart Fare Recommendation
              </h4>
              <p className="text-xs font-semibold text-amber-800 mt-0.5 leading-relaxed">
                {summary.recommendationText}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Real-time price trend algorithm updated 5m ago</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  if (onFreezePrice) onFreezePrice(flight);
                }}
                className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                Freeze Price (₹199)
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
