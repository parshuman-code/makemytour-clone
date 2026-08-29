import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Info, Bookmark, ShieldCheck, Armchair } from 'lucide-react';

export default function SeatSelectionModal({ isOpen, onClose, selectedQuantity, onConfirm, initialSelectedSeats = [] }) {
  const [selectedSeats, setSelectedSeats] = useState(initialSelectedSeats);
  const [savePreference, setSavePreference] = useState(false);

  useEffect(() => {
    setSelectedSeats(initialSelectedSeats);
  }, [initialSelectedSeats, isOpen]);

  if (!isOpen) return null;

  // Generate Dummy Layout
  const rows = 30;
  const cols = ['A', 'B', 'C', 'D', 'E', 'F'];
  
  const getSeatType = (rowIndex) => {
    if (rowIndex < 5) return { type: 'Business', price: 3000, color: 'bg-indigo-600', hover: 'hover:bg-indigo-700', text: 'text-indigo-900', border: 'border-indigo-600' };
    if (rowIndex < 15) return { type: 'Extra Legroom', price: 1500, color: 'bg-emerald-600', hover: 'hover:bg-emerald-700', text: 'text-emerald-900', border: 'border-emerald-600' };
    return { type: 'Economy', price: 0, color: 'bg-blue-500', hover: 'hover:bg-blue-600', text: 'text-blue-900', border: 'border-blue-500' };
  };

  const handleSeatClick = (seatId, seatData) => {
    if (selectedSeats.find(s => s.id === seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seatId));
    } else {
      if (selectedSeats.length >= selectedQuantity) {
        setSelectedSeats([...selectedSeats.slice(1), { id: seatId, ...seatData }]);
      } else {
        setSelectedSeats([...selectedSeats, { id: seatId, ...seatData }]);
      }
    }
  };

  const totalUpgradeFee = selectedSeats.reduce((acc, seat) => acc + seat.price, 0);

  const handleConfirm = () => {
    if (savePreference) {
      const user = JSON.parse(localStorage.getItem('mmt_user') || '{}');
      user.seatPreference = selectedSeats[0]?.id?.includes('A') || selectedSeats[0]?.id?.includes('F') ? 'Window' : 'Aisle';
      localStorage.setItem('mmt_user', JSON.stringify(user));
    }
    onConfirm(selectedSeats);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full border border-slate-100 flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-300 max-h-[90vh]">
        
        {/* Left Side: Seat Map */}
        <div className="w-full md:w-2/3 bg-slate-50 p-6 overflow-y-auto border-r border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <Armchair className="w-6 h-6 text-blue-600" />
                Select Your Seats
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-1">Please select {selectedQuantity} seat(s) for your journey.</p>
            </div>
            <div className="md:hidden">
              <button onClick={onClose} className="p-2 bg-slate-200 rounded-full"><X className="w-5 h-5 text-slate-700" /></button>
            </div>
          </div>

          {/* Seat Map Legend */}
          <div className="flex flex-wrap items-center gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
             <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <div className="w-4 h-4 rounded-md border-2 border-indigo-600 bg-white"></div> Business (₹3,000)
             </div>
             <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <div className="w-4 h-4 rounded-md border-2 border-emerald-600 bg-white"></div> Extra Legroom (₹1,500)
             </div>
             <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <div className="w-4 h-4 rounded-md border-2 border-blue-500 bg-white"></div> Economy (Free)
             </div>
             <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <div className="w-4 h-4 rounded-md bg-slate-200"></div> Occupied
             </div>
          </div>

          {/* Actual Seat Map Wrapper */}
          <div className="relative max-w-sm mx-auto">
            {/* Plane Nose styling */}
            <div className="w-full h-12 bg-slate-200 rounded-t-full mb-8 relative border-x-4 border-t-4 border-slate-300">
               <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-300 rounded-full"></div>
            </div>

            <div className="space-y-4 px-4 pb-12 border-x-4 border-slate-300">
              {[...Array(rows)].map((_, rIndex) => {
                const seatInfo = getSeatType(rIndex);
                
                return (
                  <div key={rIndex} className="flex items-center justify-center gap-3">
                    <div className="flex gap-2">
                      {cols.slice(0, 3).map((col) => {
                        const seatId = `${rIndex + 1}${col}`;
                        const isOccupied = Math.random() > 0.85; 
                        const isSelected = selectedSeats.some(s => s.id === seatId);
                        
                        return (
                          <button
                            key={seatId}
                            disabled={isOccupied && !isSelected}
                            onClick={() => handleSeatClick(seatId, { price: seatInfo.price, type: seatInfo.type })}
                            className={`w-8 h-10 rounded-t-lg rounded-b-sm border-2 transition-all flex items-center justify-center text-[10px] font-black
                              ${isSelected ? `${seatInfo.color} text-white border-transparent scale-110 shadow-md` : 
                                isOccupied ? 'bg-slate-200 border-transparent text-slate-300 cursor-not-allowed' : 
                                `bg-white ${seatInfo.border} ${seatInfo.text} ${seatInfo.hover} hover:text-white cursor-pointer`
                              }
                            `}
                          >
                            {seatId}
                          </button>
                        );
                      })}
                    </div>
                    {/* Aisle */}
                    <div className="w-6 text-center text-xs font-bold text-slate-300">{rIndex + 1}</div>
                    <div className="flex gap-2">
                      {cols.slice(3, 6).map((col) => {
                        const seatId = `${rIndex + 1}${col}`;
                        const isOccupied = Math.random() > 0.85; 
                        const isSelected = selectedSeats.some(s => s.id === seatId);
                        
                        return (
                          <button
                            key={seatId}
                            disabled={isOccupied && !isSelected}
                            onClick={() => handleSeatClick(seatId, { price: seatInfo.price, type: seatInfo.type })}
                            className={`w-8 h-10 rounded-t-lg rounded-b-sm border-2 transition-all flex items-center justify-center text-[10px] font-black
                              ${isSelected ? `${seatInfo.color} text-white border-transparent scale-110 shadow-md` : 
                                isOccupied ? 'bg-slate-200 border-transparent text-slate-300 cursor-not-allowed' : 
                                `bg-white ${seatInfo.border} ${seatInfo.text} ${seatInfo.hover} hover:text-white cursor-pointer`
                              }
                            `}
                          >
                            {seatId}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Plane Tail styling */}
            <div className="w-full h-16 bg-slate-200 rounded-b-[40px] mt-4 relative border-x-4 border-b-4 border-slate-300"></div>

          </div>
        </div>

        {/* Right Side: Summary & Actions */}
        <div className="w-full md:w-1/3 bg-white p-6 md:p-8 flex flex-col h-full justify-between">
          <div>
            <div className="hidden md:flex justify-end mb-6">
               <button onClick={onClose} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-6">Selection Summary</h3>
            
            <div className="space-y-3 mb-8">
              {selectedSeats.length === 0 ? (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center text-slate-500 text-sm font-semibold">
                  No seats selected yet. <br/><span className="text-xs">Click on the map to choose.</span>
                </div>
              ) : (
                selectedSeats.map((seat, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                    <div>
                       <div className="text-sm font-black text-slate-900">Seat {seat.id}</div>
                       <div className="text-[10px] font-bold text-slate-500 uppercase">{seat.type}</div>
                    </div>
                    <div className="text-sm font-extrabold text-slate-900">
                       {seat.price > 0 ? `+ ₹${seat.price.toLocaleString('en-IN')}` : 'Free'}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                   type="checkbox" 
                   checked={savePreference} 
                   onChange={(e) => setSavePreference(e.target.checked)}
                   className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                />
                <div>
                  <span className="block text-sm font-bold text-blue-900">Save my seat preference</span>
                  <span className="block text-xs text-blue-700 mt-0.5">We'll auto-select similar seats (Aisle/Window) for your future bookings.</span>
                </div>
              </label>
            </div>
          </div>

          <div>
             <div className="border-t border-slate-200 pt-4 mb-6">
                <div className="flex justify-between items-center mb-1">
                   <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upgrade Fees</span>
                   <span className="text-xl font-black text-slate-900">₹{totalUpgradeFee.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold text-right">Added to base fare</p>
             </div>

             <button 
                onClick={handleConfirm}
                disabled={selectedSeats.length !== selectedQuantity}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-wide hover:bg-slate-800 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed shadow-lg"
             >
                {selectedSeats.length === selectedQuantity ? 'Confirm Seats' : `Select ${selectedQuantity - selectedSeats.length} More Seat(s)`}
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}
