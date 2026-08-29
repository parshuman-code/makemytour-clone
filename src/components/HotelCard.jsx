import React from 'react';
import { Building2, MapPin, Star, Wifi, Coffee, Check, Shield } from 'lucide-react';

export default function HotelCard({ hotel, onBookHotel }) {
  const defaultAmenities = ["Free WiFi", "Swimming Pool", "Spa & Wellness", "Restaurant"];
  const amenitiesList = hotel.amenities || defaultAmenities;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row group">
      
      {/* Hotel Image Container */}
      <div className="md:w-2/5 relative overflow-hidden min-h-[200px]">
        <img 
          src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'} 
          alt={hotel.hotelName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{hotel.rating || 4.8} / 5.0</span>
        </div>
      </div>

      {/* Hotel Details */}
      <div className="md:w-3/5 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {hotel.hotelName}
            </h3>
          </div>

          <div className="flex items-center text-xs font-medium text-gray-500 mb-3">
            <MapPin className="w-4 h-4 text-red-500 mr-1" />
            <span>{hotel.location}</span>
          </div>

          {/* Amenities tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {amenitiesList.map((item, idx) => (
              <span 
                key={idx}
                className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-100 flex items-center gap-1"
              >
                <Check className="w-3 h-3 text-blue-600" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing & Booking CTA */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 block font-medium">Per Night</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">
                ₹{Number(hotel.pricePerNight || 8000).toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-gray-500 font-normal">+ taxes</span>
            </div>
          </div>

          <button
            onClick={() => onBookHotel(hotel)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-lg shadow-sm transition-colors text-sm"
          >
            Book Room
          </button>
        </div>

      </div>

    </div>
  );
}
