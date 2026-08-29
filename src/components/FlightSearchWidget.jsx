import React, { useState } from 'react';
import { Search, ArrowRightLeft, Calendar, Users, MapPin, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';

export default function FlightSearchWidget({ onSearch }) {
  const [tripType, setTripType] = useState('ONE_WAY'); // 'ONE_WAY' | 'ROUND_TRIP'
  const [fromCity, setFromCity] = useState('New York (JFK)');
  const [toCity, setToCity] = useState('London (LHR)');
  const [departureDate, setDepartureDate] = useState('2026-09-12');
  const [passengers, setPassengers] = useState(1);
  const [travelClass, setTravelClass] = useState('Economy');
  const [specialFare, setSpecialFare] = useState('REGULAR');

  const popularCities = [
    'New York (JFK)',
    'London (LHR)',
    'Dubai (DXB)',
    'Delhi (DEL)',
    'Paris (CDG)',
    'Tokyo (HND)',
    'Singapore (SIN)'
  ];

  const handleSwapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({
        from: fromCity,
        to: toCity,
        date: departureDate,
        passengers: Number(passengers),
        class: travelClass,
        fare: specialFare
      });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative z-20 -mt-16">
      
      {/* Trip Type Selector Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setTripType('ONE_WAY')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              tripType === 'ONE_WAY' 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            One Way
          </button>
          <button
            type="button"
            onClick={() => setTripType('ROUND_TRIP')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              tripType === 'ROUND_TRIP' 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Round Trip
          </button>
        </div>

        {/* Special Fares Options */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold hidden sm:inline">Select Fare:</span>
          {['REGULAR', 'STUDENT', 'SENIOR_CITIZEN', 'ARMED_FORCES'].map((fare) => (
            <button
              key={fare}
              type="button"
              onClick={() => setSpecialFare(fare)}
              className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all ${
                specialFare === fare
                  ? 'bg-red-50 border-red-300 text-red-600'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {fare.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* FROM Input */}
          <div className="md:col-span-5 relative group">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 group-hover:border-red-400 transition-all">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                From City / Airport
              </label>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />
                <select
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className="w-full bg-transparent font-bold text-slate-900 text-base focus:outline-none cursor-pointer"
                >
                  {popularCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button Absolute */}
            <button
              type="button"
              onClick={handleSwapCities}
              className="absolute right-[-18px] top-[50%] -translate-y-1/2 z-30 p-2.5 rounded-full bg-white border-2 border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-500 shadow-md transition-all hover:rotate-180 hidden md:block"
              title="Swap Departure and Destination"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* TO Input */}
          <div className="md:col-span-5">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 group-hover:border-red-400 transition-all">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                To Destination / Airport
              </label>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-slate-700 flex-shrink-0" />
                <select
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="w-full bg-transparent font-bold text-slate-900 text-base focus:outline-none cursor-pointer"
                >
                  {popularCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* DATE Input */}
          <div className="md:col-span-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 group-hover:border-red-400 transition-all">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                Departure Date
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-red-500 flex-shrink-0" />
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full bg-transparent font-bold text-slate-900 text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Passengers & Class + Search Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* Passengers Select */}
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-xs font-bold text-slate-700">
              <Users className="w-4 h-4 text-slate-500" />
              <span>Passengers:</span>
              <select
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                className="bg-transparent font-extrabold text-slate-900 focus:outline-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            {/* Travel Class Select */}
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-xs font-bold text-slate-700">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Class:</span>
              <select
                value={travelClass}
                onChange={(e) => setTravelClass(e.target.value)}
                className="bg-transparent font-extrabold text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="Economy">Economy</option>
                <option value="Premium Economy">Premium Economy</option>
                <option value="Business">Business</option>
                <option value="First Class">First Class</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <Button 
            type="submit" 
            variant="default" 
            size="lg"
            className="w-full sm:w-auto px-8 py-3.5 text-base shadow-xl shadow-red-500/25 flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            <span>Search Flights</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
