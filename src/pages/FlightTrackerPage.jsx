import React, { useState, useEffect } from 'react';
import { 
  Plane, Search, Clock, MapPin, AlertTriangle, CheckCircle2, 
  Bell, RefreshCw, Radio, ArrowRight, ShieldCheck, Gauge
} from 'lucide-react';
import Footer from '../components/Footer';

export default function FlightTrackerPage({ onTriggerNotification }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [trackedFlights, setTrackedFlights] = useState(['6E-204', 'AI-502']);
  const [flightStatuses, setFlightStatuses] = useState([
    {
      flightNumber: "6E-204",
      airline: "IndiGo",
      from: "Delhi (DEL)",
      to: "Mumbai (BOM)",
      status: "On Time",
      delayMinutes: 0,
      delayReason: null,
      gate: "Gate 4B",
      terminal: "Terminal 3",
      scheduledDeparture: "06:30 AM",
      revisedDeparture: "06:30 AM",
      scheduledArrival: "08:45 AM",
      revisedArrival: "08:45 AM",
      progressPercentage: 55,
      altitude: "32,000 ft",
      speed: "780 km/h",
      aircraft: "Airbus A320neo",
      lastUpdated: "Just now"
    },
    {
      flightNumber: "AI-502",
      airline: "Air India",
      from: "Mumbai (BOM)",
      to: "Bengaluru (BLR)",
      status: "Delayed",
      delayMinutes: 45,
      delayReason: "Adverse Weather & Heavy Rain in Mumbai Airspace",
      gate: "Gate 12A",
      terminal: "Terminal 2",
      scheduledDeparture: "11:15 AM",
      revisedDeparture: "12:00 PM",
      scheduledArrival: "01:00 PM",
      revisedArrival: "01:45 PM",
      progressPercentage: 20,
      altitude: "14,500 ft",
      speed: "540 km/h",
      aircraft: "Boeing 787 Dreamliner",
      lastUpdated: "2 mins ago"
    },
    {
      flightNumber: "UK-811",
      airline: "Vistara",
      from: "Bengaluru (BLR)",
      to: "Delhi (DEL)",
      status: "Boarding",
      delayMinutes: 0,
      delayReason: null,
      gate: "Gate 7C",
      terminal: "Terminal 2",
      scheduledDeparture: "02:30 PM",
      revisedDeparture: "02:30 PM",
      scheduledArrival: "05:15 PM",
      revisedArrival: "05:15 PM",
      progressPercentage: 5,
      altitude: "On Ground",
      speed: "0 km/h",
      aircraft: "Airbus A321neo",
      lastUpdated: "Just now"
    },
    {
      flightNumber: "SG-993",
      airline: "SpiceJet",
      from: "Delhi (DEL)",
      to: "Kolkata (CCU)",
      status: "Gate Changed",
      delayMinutes: 15,
      delayReason: "Late Arrival of Inbound Aircraft from Jaipur",
      gate: "Gate 18 (Changed from 14)",
      terminal: "Terminal 1D",
      scheduledDeparture: "08:10 PM",
      revisedDeparture: "08:25 PM",
      scheduledArrival: "10:30 PM",
      revisedArrival: "10:45 PM",
      progressPercentage: 0,
      altitude: "On Ground",
      speed: "0 km/h",
      aircraft: "Boeing 737 MAX",
      lastUpdated: "1 min ago"
    },
    {
      flightNumber: "EK-501",
      airline: "Emirates",
      from: "Mumbai (BOM)",
      to: "Dubai (DXB)",
      status: "In Flight",
      delayMinutes: 0,
      delayReason: null,
      gate: "Gate 1",
      terminal: "Terminal 2",
      scheduledDeparture: "04:00 PM",
      revisedDeparture: "04:00 PM",
      scheduledArrival: "06:15 PM",
      revisedArrival: "06:15 PM",
      progressPercentage: 80,
      altitude: "38,000 ft",
      speed: "890 km/h",
      aircraft: "Boeing 777-300ER",
      lastUpdated: "Just now"
    }
  ]);

  useEffect(() => {
    fetch('/api/flight/status')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setFlightStatuses(data);
        }
      })
      .catch(err => console.log('Flight status fetch notice:', err.message));
  }, []);

  const toggleTrackFlight = (flightNum) => {
    if (trackedFlights.includes(flightNum)) {
      setTrackedFlights(trackedFlights.filter(f => f !== flightNum));
    } else {
      setTrackedFlights([...trackedFlights, flightNum]);
      // Trigger notification test
      const target = flightStatuses.find(f => f.flightNumber === flightNum);
      if (onTriggerNotification && target) {
        onTriggerNotification({
          flightNumber: target.flightNumber,
          title: `Flight ${target.flightNumber} Tracking Enabled`,
          message: `Live updates for ${target.airline} (${target.from} → ${target.to}) are now active. Current status: ${target.status}.`,
          reason: target.delayReason || `Scheduled departure at ${target.scheduledDeparture}`,
          type: target.status === 'Delayed' ? 'delay' : 'info'
        });
      }
    }
  };

  const filteredList = flightStatuses.filter((f) => {
    const matchesSearch = 
      f.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.to.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'Tracked') return trackedFlights.includes(f.flightNumber);
    if (activeTab === 'Delayed') return f.status === 'Delayed' || f.delayMinutes > 0;
    if (activeTab === 'On Time') return f.status === 'On Time';
    if (activeTab === 'Boarding') return f.status === 'Boarding';
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'On Time':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> ON TIME</span>;
      case 'Boarding':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 animate-pulse"><Radio className="w-3.5 h-3.5" /> BOARDING NOW</span>;
      case 'Delayed':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> DELAYED</span>;
      case 'Gate Changed':
        return <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> GATE CHANGED</span>;
      default:
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1"><Plane className="w-3.5 h-3.5" /> IN FLIGHT</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Tracker Hero Header */}
      <div className="bg-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-extrabold border border-blue-500/30">
            <Radio className="w-4 h-4 text-blue-400 animate-pulse" />
            Live Flight Status Radar & Multi-Tracking Dashboard
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Real-Time Flight Tracking System
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-medium">
            Monitor departure times, gate changes, weather delays, and dynamic arrival updates in real time.
          </p>

          {/* Live Search Bar */}
          <div className="max-w-xl mx-auto mt-6 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Flight Code (e.g. 6E-204, AI-502) or City..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 font-bold text-sm outline-none shadow-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/30 placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Controls & Category Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white p-3 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {['All', 'Tracked', 'Delayed', 'On Time', 'Boarding'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab} {tab === 'Tracked' && `(${trackedFlights.length})`}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3 text-xs font-bold text-slate-500 px-2">
            <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
            <span>Telemetry Auto-Sync Active</span>
          </div>
        </div>

        {/* Flight Status Cards Grid */}
        <div className="space-y-6">
          {filteredList.length > 0 ? (
            filteredList.map((flight) => {
              const isTracked = trackedFlights.includes(flight.flightNumber);

              return (
                <div 
                  key={flight.flightNumber}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-300 space-y-6"
                >
                  
                  {/* Top Bar: Flight Name & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        <Plane className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-black text-slate-900">{flight.airline}</h3>
                          <span className="bg-slate-100 text-slate-800 text-xs font-extrabold px-2.5 py-0.5 rounded-md border border-slate-200">
                            {flight.flightNumber}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">Aircraft: {flight.aircraft}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {getStatusBadge(flight.status)}

                      <button
                        onClick={() => toggleTrackFlight(flight.flightNumber)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-colors flex items-center gap-1.5 border ${
                          isTracked
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                        }`}
                      >
                        <Bell className={`w-3.5 h-3.5 ${isTracked ? 'fill-white' : ''}`} />
                        {isTracked ? 'Tracking Active' : 'Track Flight'}
                      </button>
                    </div>
                  </div>

                  {/* Route & Animated Telemetry Progress Bar */}
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-4">
                    <div className="flex flex-wrap justify-between items-center gap-4">
                      <div>
                        <span className="text-xs text-slate-400 font-medium block">Origin</span>
                        <span className="text-lg font-black text-slate-900">{flight.from}</span>
                        <span className="text-xs text-slate-500 font-bold block mt-0.5">
                          Dep: {flight.scheduledDeparture} {flight.delayMinutes > 0 && <span className="text-rose-600 line-through">({flight.scheduledDeparture})</span>}
                        </span>
                      </div>

                      <div className="flex-1 max-w-md mx-4">
                        <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                          <span>{flight.terminal}</span>
                          <span>{flight.gate}</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden relative">
                          <div 
                            className="bg-blue-600 h-full rounded-full transition-all duration-1000"
                            style={{ width: `${flight.progressPercentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
                          <span>Alt: {flight.altitude}</span>
                          <span>Speed: {flight.speed}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-400 font-medium block">Destination</span>
                        <span className="text-lg font-black text-slate-900">{flight.to}</span>
                        <span className="text-xs text-slate-500 font-bold block mt-0.5">
                          Est. Arr: <span className="text-blue-600 font-black">{flight.revisedArrival}</span>
                        </span>
                      </div>
                    </div>

                    {/* Delay Context Explanation Banner */}
                    {flight.delayReason && (
                      <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold">Delay Context ({flight.delayMinutes} mins delay):</strong> {flight.delayReason}. 
                          Revised departure scheduled at <span className="font-black text-slate-900">{flight.revisedDeparture}</span>.
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer Meta */}
                  <div className="flex flex-wrap justify-between items-center text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      Assigned Gate: <strong className="text-slate-800">{flight.gate}</strong> ({flight.terminal})
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">Last status ping: {flight.lastUpdated}</span>
                  </div>

                </div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-2">
              <Plane className="w-12 h-12 mx-auto text-slate-300" />
              <h3 className="font-bold text-slate-800 text-base">No matching flights found</h3>
              <p className="text-xs">Try searching for flight code "6E-204", "AI-502", or "UK-811".</p>
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
