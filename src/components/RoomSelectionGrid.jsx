import React, { useState } from 'react';
import { Bed, Users, Wifi, Coffee, CheckCircle2, Tv, Snowflake, View } from 'lucide-react';

const ROOM_TYPES = [
  {
    id: 'standard',
    name: 'Standard Room',
    priceBump: 0,
    capacity: 2,
    size: '250 sq.ft',
    bedType: 'Queen Bed',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80',
    amenities: ['Free WiFi', 'AC', 'TV', 'En-suite Bathroom']
  },
  {
    id: 'deluxe',
    name: 'Deluxe Room',
    priceBump: 1500,
    capacity: 3,
    size: '350 sq.ft',
    bedType: 'King Bed',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
    amenities: ['Free WiFi', 'AC', 'Smart TV', 'Mini Bar', 'City View']
  },
  {
    id: 'suite',
    name: 'Executive Suite',
    priceBump: 3500,
    capacity: 4,
    size: '550 sq.ft',
    bedType: 'King Bed + Sofa Bed',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    amenities: ['Lounge Area', 'Premium WiFi', 'Bathtub', 'Balcony', 'Breakfast Included']
  }
];

export default function RoomSelectionGrid({ selectedRoomId, onSelectRoom, roomsCount }) {
  const [savePreference, setSavePreference] = useState(false);

  const handleSelect = (room) => {
    onSelectRoom(room);
    
    if (savePreference) {
      const user = JSON.parse(localStorage.getItem('mmt_user') || '{}');
      user.roomPreference = room.id === 'suite' ? 'High Floor / Suite' : (room.id === 'deluxe' ? 'City View' : 'Standard');
      localStorage.setItem('mmt_user', JSON.stringify(user));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-900">Select Room Type</h3>
        <label className="flex items-center gap-2 cursor-pointer bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
          <input 
            type="checkbox" 
            checked={savePreference} 
            onChange={(e) => setSavePreference(e.target.checked)}
            className="w-3.5 h-3.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
          />
          <span className="text-[11px] font-bold text-blue-900">Save preference</span>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {ROOM_TYPES.map((room) => {
          const isSelected = selectedRoomId === room.id;

          return (
            <div 
              key={room.id}
              onClick={() => handleSelect(room)}
              className={`relative overflow-hidden rounded-2xl border-2 transition-all cursor-pointer group ${
                isSelected ? 'border-emerald-500 shadow-emerald-500/20 shadow-lg ring-4 ring-emerald-50' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div className="flex flex-col md:flex-row">
                {/* Room Image */}
                <div className="w-full md:w-1/3 relative h-48 md:h-auto overflow-hidden">
                  <img 
                    src={room.image} 
                    alt={room.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {room.id !== 'standard' && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                      Premium
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute inset-0 bg-emerald-900/20 flex items-center justify-center">
                      <div className="bg-emerald-500 text-white p-2 rounded-full shadow-lg">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Room Details */}
                <div className="w-full md:w-2/3 p-4 flex flex-col justify-between bg-white">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-extrabold text-slate-900 text-base">{room.name}</h4>
                      <div className="text-right">
                        <div className="font-black text-slate-900">
                           {room.priceBump > 0 ? `+ ₹${room.priceBump.toLocaleString('en-IN')}` : 'Included'}
                        </div>
                        <div className="text-[10px] text-slate-500 font-semibold text-right">per room/night</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                        <Users className="w-3.5 h-3.5 text-slate-400" /> Max {room.capacity} Guests
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                        <Bed className="w-3.5 h-3.5 text-slate-400" /> {room.bedType}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                        <View className="w-3.5 h-3.5 text-slate-400" /> {room.size}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {room.amenities.map((amenity, idx) => (
                        <span key={idx} className="bg-slate-50 text-slate-600 border border-slate-100 text-[10px] px-2 py-1 rounded-md font-semibold">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500">
                      Total Upgrade for {roomsCount} room(s): <strong className="text-slate-900">₹{(room.priceBump * roomsCount).toLocaleString('en-IN')}</strong>
                    </span>
                    <button 
                      className={`text-xs font-black px-4 py-2 rounded-lg transition-colors ${
                        isSelected ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Select Room'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
