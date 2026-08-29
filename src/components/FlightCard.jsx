import React, { useState } from 'react';
import { Plane, Clock, ShieldCheck, Star, Users, TrendingUp, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import PriceHistoryModal from './PriceHistoryModal';
import PriceFreezeModal from './PriceFreezeModal';
import { isFlightPriceFrozen } from '../utils/pricingEngine';

export default function FlightCard({ flight, onBookFlight }) {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showFreezeModal, setShowFreezeModal] = useState(false);

  const flightId = flight._id || flight.id || flight.code || 'FL-202';
  const frozenPriceObj = isFlightPriceFrozen(flightId);

  const dynamic = flight.dynamicPricing || {};
  const isSurging = dynamic.isSurging || (flight.availableSeats && flight.availableSeats < 15);
  const effectivePrice = frozenPriceObj ? frozenPriceObj.lockedPrice : Number(flight.price || 5500);

  return (
    <>
      <Card className="p-6 transition-all duration-300 hover:border-red-300 hover:shadow-xl group relative overflow-hidden">
        
        {/* Top Surge & Freeze Banner Bar */}
        {(frozenPriceObj || dynamic.surgeLabel || isSurging) && (
          <div className="flex items-center justify-between gap-2 mb-4 text-xs">
            {frozenPriceObj ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Price Frozen at ₹{frozenPriceObj.lockedPrice.toLocaleString('en-IN')} (Guaranteed)
              </span>
            ) : dynamic.surgeLabel ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold border border-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                {dynamic.surgeLabel}
              </span>
            ) : isSurging ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 font-extrabold border border-rose-300">
                <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
                High Demand Fare Surge
              </span>
            ) : null}

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setShowHistoryModal(true)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-full transition-colors"
                title="View 30-day price trend"
              >
                <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
                Price Graph
              </button>

              {!frozenPriceObj && (
                <button
                  onClick={() => setShowFreezeModal(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-full border border-rose-200 transition-colors"
                  title="Lock in this price for 24 hours"
                >
                  <Lock className="w-3 h-3 text-rose-600" />
                  Freeze Price
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Airline Info */}
          <div className="flex items-center gap-4 min-w-[200px]">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
              {flight.logo ? (
                <img 
                  src={flight.logo} 
                  alt={flight.airline || flight.flightName} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <Plane className="w-7 h-7 text-slate-600" />
              )}
            </div>
            <div>
              <h4 className="text-base font-extrabold text-slate-900 leading-tight">
                {flight.airline || flight.flightName}
              </h4>
              <span className="text-xs font-semibold text-slate-500 block mt-0.5">
                {flight.flightNumber || flight.code || "6E-204"}
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-slate-700">{flight.rating || 4.8}</span>
                <span className="text-[11px] text-slate-400">(420 reviews)</span>
              </div>
            </div>
          </div>

          {/* Flight Route & Schedule */}
          <div className="flex-1 w-full flex items-center justify-between gap-4 px-4 sm:px-8 py-3 bg-slate-50/80 rounded-2xl border border-slate-100">
            {/* Departure */}
            <div className="text-left">
              <span className="text-xl sm:text-2xl font-black text-slate-900 block">
                {flight.departureTime}
              </span>
              <span className="text-xs font-bold text-slate-600 block mt-0.5">
                {flight.from}
              </span>
            </div>

            {/* Flight Path Graphic */}
            <div className="flex-1 flex flex-col items-center px-4">
              <span className="text-[11px] font-extrabold text-slate-500 tracking-wider mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-red-500" />
                {flight.duration || "7h 15m"}
              </span>
              <div className="w-full flex items-center gap-1">
                <div className="h-0.5 flex-1 bg-slate-300 rounded-full" />
                <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center">
                  <Plane className="w-3.5 h-3.5 text-red-600 transform rotate-90" />
                </div>
                <div className="h-0.5 flex-1 bg-slate-300 rounded-full" />
              </div>
              <Badge variant="primary" className="mt-1 text-[10px]">
                {flight.stops || "Non-stop"}
              </Badge>
            </div>

            {/* Arrival */}
            <div className="text-right">
              <span className="text-xl sm:text-2xl font-black text-slate-900 block">
                {flight.arrivalTime}
              </span>
              <span className="text-xs font-bold text-slate-600 block mt-0.5">
                {flight.to}
              </span>
            </div>
          </div>

          {/* Pricing & Booking CTA */}
          <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            <div className="text-left lg:text-right">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">
                  ₹{effectivePrice.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-slate-400 font-medium">/ passenger</span>
              </div>
              {frozenPriceObj ? (
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                  <Lock className="w-3 h-3" />
                  Locked Fare
                </span>
              ) : flight.availableSeats && flight.availableSeats < 25 ? (
                <span className="text-[11px] font-bold text-rose-600 flex items-center gap-1 mt-0.5">
                  <Users className="w-3 h-3" />
                  Only {flight.availableSeats} seats left!
                </span>
              ) : (
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3" />
                  Refundable Fare
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="default"
                size="md"
                onClick={() => onBookFlight({ ...flight, price: effectivePrice, frozenPriceObj })}
                className="px-6 py-2.5 shadow-lg shadow-red-500/20"
              >
                Book Now
              </Button>
            </div>
          </div>

        </div>
      </Card>

      {/* Modals */}
      {showHistoryModal && (
        <PriceHistoryModal
          flight={flight}
          onClose={() => setShowHistoryModal(false)}
          onFreezePrice={() => setShowFreezeModal(true)}
        />
      )}

      {showFreezeModal && (
        <PriceFreezeModal
          flight={flight}
          onClose={() => setShowFreezeModal(false)}
          onConfirmFreeze={() => {
            setShowFreezeModal(false);
          }}
        />
      )}
    </>
  );
}
