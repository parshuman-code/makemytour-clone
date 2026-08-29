import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Star, MapPin, ChevronRight, Camera, Image as ImageIcon, 
  CreditCard, Ticket, Home, CheckCircle2, ShieldCheck, Waves, Utensils, Wine, Zap, Wifi, Dumbbell, Umbrella
} from 'lucide-react';
import Footer from '../components/Footer';
import RoomSelectionGrid from '../components/RoomSelectionGrid';

// Rich amenity icons mapper
const amenityIcons = {
  'Swimming Pool': Waves,
  'Restaurant': Utensils,
  'Bar': Wine,
  'Power Backup': Zap,
  'Wi-Fi': Wifi,
  'Free WiFi': Wifi,
  'Beach Access': Umbrella,
  'Water Sports': Waves,
  'Fitness Center': Dumbbell,
};

export default function BookHotelPage({ user, onConfirmBooking }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState({ id: 'standard', priceBump: 0, name: 'Standard Room' });
  const [isBooked, setIsBooked] = useState(false);
  const [bookingRefId, setBookingRefId] = useState('');

  useEffect(() => {
    fetch('/api/hotel')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const found = data.find(h => (h._id === id || h.id === id || h.hotelName.toLowerCase().includes(id.toLowerCase()))) || data[0];
          setHotel(found);
        }
      })
      .catch(err => {
        setHotel({
          _id: '1',
          hotelName: 'Seaside Resort',
          location: 'Bali, Indonesia',
          pricePerNight: 6000,
          availableRooms: 17,
          amenities: ['Beach Access', 'Wi-Fi', 'Restaurant', 'Water Sports', 'Swimming Pool', 'Bar', 'Power Backup'],
          rating: 3.8,
          image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80'
        });
      });
  }, [id]);

  const pricePerNight = (hotel?.pricePerNight || 6000) + selectedRoom.priceBump;
  const totalPrice = pricePerNight * quantity;
  const taxes = 527 * quantity;
  const discount = 137 * quantity;
  const grandTotal = totalPrice + taxes - discount;

  const handleBookingConfirm = async () => {
    const bookingId = `MMT-HT-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingRefId(bookingId);

    const bookingPayload = {
      bookingId,
      type: 'hotel',
      itemDetails: {
        title: hotel?.hotelName || 'Seaside Resort',
        hotelName: hotel?.hotelName || 'Seaside Resort',
        roomType: selectedRoom.name,
        location: hotel?.location || 'Bali, Indonesia',
        date: new Date().toISOString().split('T')[0]
      },
      date: new Date().toISOString().split('T')[0],
      quantity,
      totalPrice: grandTotal,
      status: 'Paid',
      paymentMethod: 'Credit Card / UPI'
    };

    try {
      await fetch('/api/booking/hotel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user ? user._id : 'demo-user',
          hotelId: hotel?._id || hotel?.id,
          rooms: quantity,
          roomType: selectedRoom.id,
          price: grandTotal
        })
      });
    } catch (err) {
      console.log('Hotel booking submit notice:', err.message);
    }

    if (onConfirmBooking) {
      onConfirmBooking({
        type: 'hotel',
        itemDetails: bookingPayload.itemDetails,
        quantity,
        totalAmount: grandTotal,
        bookingId
      });
    }

    setIsBooked(true);
    setTimeout(() => {
      navigate('/profile');
    }, 2500);
  };

  // Dynamic hotel gallery and meta built from actual hotel data
  const starCount = hotel?.rating ? Math.round(hotel.rating) : 3;
  const emptyStars = 5 - starCount;
  const amenitiesList = Array.isArray(hotel?.amenities) ? hotel.amenities : ['Swimming Pool', 'Restaurant', 'Bar', 'Power Backup'];
  const mainAmenities = amenitiesList.slice(0, 4);
  const extraAmenities = amenitiesList.length > 4 ? amenitiesList.length - 4 : 0;

  const hotelData = {
    name: hotel?.hotelName || "Seaside Resort",
    propertyPhotos: 91,
    guestPhotos: 386,
    description: hotel?.location === 'Bali, Indonesia'
      ? "A stunning beachfront resort on the shores of Bali, offering world-class hospitality with traditional Balinese touches. Ideal for couples, families, and group travelers seeking a tropical getaway."
      : hotel?.location === 'Goa'
        ? "One of the best hotels in North Goa, operating since 2001 catering to international and domestic individual and group travelers."
        : `Experience premium comfort at ${hotel?.hotelName || 'this hotel'} located in ${hotel?.location || 'a prime destination'}. Perfect for leisure and business travelers alike.`,
    room: {
      type: "Standard Room",
      capacity: "Fits 2 Adults",
      features: [
        "No meals included",
        "10% off on food & beverage services",
        "Complimentary welcome drinks on arrival",
        "Non-Refundable",
      ]
    },
    reviews: {
      rating: hotel?.rating || 3.8,
      count: 784,
      text: (hotel?.rating || 3.8) >= 4.5 ? "Excellent" : (hotel?.rating || 3.8) >= 4.0 ? "Very Good" : (hotel?.rating || 3.8) >= 3.5 ? "Very Good" : "Good",
    },
  };

  // Gallery images: use hotel image as primary, plus 2 supplementary images
  const galleryImages = {
    main: hotel?.image || "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800",
    secondary: hotel?.location === 'Bali, Indonesia'
      ? "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800"
      : "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800",
    tertiary: hotel?.location === 'Bali, Indonesia'
      ? "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=800"
      : "https://images.unsplash.com/photo-1520454974749-611b7248ffdb?auto=format&fit=crop&w=800"
  };

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Breadcrumb Navigation Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
            <Link to="/" className="text-blue-600 hover:underline">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link to="/" className="text-blue-600 hover:underline">{hotel?.location || 'Bali, Indonesia'}</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-slate-800 font-bold">{hotel?.hotelName || 'Seaside Resort'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {isBooked && (
          <div className="mb-6 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-sm text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-2xl font-bold text-emerald-900">Hotel Reservation Confirmed!</h3>
            <p className="text-sm font-semibold text-emerald-700">Booking Reference ID: {bookingRefId}</p>
            <p className="text-xs text-emerald-600">Redirecting to your profile & booking history...</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* MAIN LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Title & Stars */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                {hotel?.hotelName || "Seaside Resort"}
              </h1>
              <div className="flex items-center space-x-1">
                {[...Array(starCount)].map((_, i) => (
                  <Star key={`filled-${i}`} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
                {[...Array(emptyStars)].map((_, i) => (
                  <Star key={`empty-${i}`} className="w-5 h-5 text-slate-300" />
                ))}
              </div>
            </div>

            {/* Photo Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2 relative group cursor-pointer overflow-hidden rounded-xl h-72 sm:h-80 shadow-sm">
                <img
                  src={galleryImages.main}
                  alt="Hotel Main"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center space-x-1.5 shadow-sm text-xs font-bold text-slate-800">
                  <Camera className="w-4 h-4 text-slate-700" />
                  <span>+{hotelData.propertyPhotos} Property Photos</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="relative group cursor-pointer overflow-hidden rounded-xl h-36 sm:h-[154px] shadow-sm">
                  <img
                    src={galleryImages.secondary}
                    alt="Hotel Room"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="relative group cursor-pointer overflow-hidden rounded-xl h-36 sm:h-[154px] shadow-sm">
                  <img
                    src={galleryImages.tertiary}
                    alt="Hotel Amenity"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center space-x-1.5 shadow-sm text-xs font-bold text-slate-800">
                    <ImageIcon className="w-4 h-4 text-slate-700" />
                    <span>+{hotelData.guestPhotos} Guest Photos</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-600 text-sm leading-relaxed">
              {hotelData.description}
              <button className="text-blue-600 font-bold ml-2 hover:underline">Read more</button>
            </p>

            {/* Amenities Section */}
            <div className="border-t border-slate-200 pt-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Amenities</h2>
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-700">
                {mainAmenities.map((amenity, index) => {
                  const IconComponent = amenityIcons[amenity] || ShieldCheck;
                  return (
                    <div key={index} className="flex items-center space-x-2 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
                      <IconComponent className="w-4 h-4 text-slate-500" />
                      <span>{amenity}</span>
                    </div>
                  );
                })}
                {extraAmenities > 0 && (
                  <button className="text-blue-600 font-bold hover:underline">+ {extraAmenities + 27} Amenities</button>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN - BOOKING CARD */}
          <div className="lg:col-span-1 space-y-6">
            
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 space-y-5">
              
              <RoomSelectionGrid 
                selectedRoomId={selectedRoom.id}
                onSelectRoom={setSelectedRoom}
                roomsCount={quantity}
              />
              
              <div className="border-t border-slate-200 pt-4" />

              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Price Per Night:</span>
                  <span className="font-extrabold text-slate-900 text-sm">₹ {pricePerNight.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold">Available Rooms:</span>
                  <span className="font-extrabold text-slate-900 text-sm">{hotel?.availableRooms || 17}</span>
                </div>
                <div>
                  <span className="font-bold block mb-1">Amenities:</span>
                  <p className="text-slate-500 font-medium text-[11px] leading-snug">
                    {amenitiesList.join(', ')}
                  </p>
                </div>
              </div>

              {/* Quantity selector */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-1">Rooms to Book</label>
                <input
                  type="number"
                  min="1"
                  max={hotel?.availableRooms || 10}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 border rounded-lg text-sm font-bold bg-slate-50 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Final Pricing Line */}
              <div className="border-t border-slate-100 pt-3">
                <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                  <span className="line-through">₹ {(pricePerNight * quantity).toLocaleString("en-IN")}</span>
                  <span>Per Night:</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-black text-slate-900">₹ {grandTotal.toLocaleString("en-IN")}</span>
                  <span className="text-xs text-slate-500 font-medium">+ ₹ {taxes} taxes & fees</span>
                </div>
              </div>

              <button
                onClick={handleBookingConfirm}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-lg shadow-md transition-colors text-sm uppercase tracking-wide cursor-pointer"
              >
                BOOK THIS NOW
              </button>

              <button className="w-full text-blue-600 text-xs font-bold text-center hover:underline">
                14 More Options
              </button>
            </div>

            {/* Rating Summary Box */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 text-white text-xl font-black w-14 h-14 rounded-lg flex items-center justify-center shadow-sm">
                    {hotelData.reviews.rating}
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 text-base">
                      {hotelData.reviews.text}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      ({hotelData.reviews.count} ratings)
                    </div>
                  </div>
                </div>
                <button className="text-blue-600 font-bold text-xs hover:underline">
                  All Reviews
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
