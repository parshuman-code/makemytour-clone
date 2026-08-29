import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plane, Luggage, Clock, Calendar, MapPin, Gift, CreditCard, 
  AlertCircle, Star, Info, ArrowRight, CheckCircle2, Lock, ShieldCheck, Users, X, Armchair
} from 'lucide-react';
import Footer from '../components/Footer';
import SeatSelectionModal from '../components/SeatSelectionModal';
import { isFlightPriceFrozen } from '../utils/pricingEngine';

export default function BookFlightPage({ flights = [], user, onConfirmBooking }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedPromo, setSelectedPromo] = useState('MMTSECURE');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [isBooked, setIsBooked] = useState(false);
  const [bookingRefId, setBookingRefId] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSeatSelection, setShowSeatSelection] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    // Look up flight in passed array or fetch from backend
    if (flights && flights.length > 0) {
      const found = flights.find(f => (f._id === id || f.id === id || f.flightNumber === id || f.code === id));
      if (found) {
        setFlight(found);
        return;
      }
    }

    fetch(`/api/flight/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data && (data._id || data.id)) {
          setFlight(data);
        } else {
          fetch('/api/flight')
            .then(res => res.json())
            .then(list => {
              if (Array.isArray(list)) {
                setFlight(list.find(f => (f._id === id || f.id === id)) || list[0]);
              }
            });
        }
      })
      .catch(() => {
        setFlight({
          _id: 'FL-202',
          flightName: 'SkyHigh 202',
          airline: 'SkyHigh',
          flightNumber: 'IX 2747',
          from: 'Paris',
          to: 'Tokyo',
          departureTime: '08:30 AM',
          arrivalTime: '11:45 PM',
          price: 5500,
          availableSeats: 12
        });
      });
  }, [id, flights]);

  const flightId = flight?._id || flight?.id || flight?.code || 'FL-202';
  const frozenObj = isFlightPriceFrozen(flightId);

  const effectiveUnitFare = frozenObj ? frozenObj.lockedPrice : Number(flight?.price || 5500);

  const basePrice = effectiveUnitFare * quantity;
  const taxes = Math.round(basePrice * 0.12);
  const otherServices = 249 * quantity;
  const seatUpgradeFees = selectedSeats.reduce((acc, seat) => acc + seat.price, 0);
  const discounts = selectedPromo === 'MMTSECURE' ? 299 : (selectedPromo === 'SPECIALUPI' ? 362 : 0);
  const grandTotal = Math.max(0, basePrice + taxes + otherServices + seatUpgradeFees - discounts);

  const handleBookNow = async () => {
    const bookingId = `MMT-FL-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingRefId(bookingId);

    const bookingPayload = {
      bookingId,
      type: 'flight',
      itemDetails: {
        title: flight?.flightName || flight?.airline || 'SkyHigh 202',
        route: `${flight?.from || 'Paris'} → ${flight?.to || 'Tokyo'}`,
        date: new Date().toISOString().split('T')[0],
        time: `${flight?.departureTime || '08:30 AM'} - ${flight?.arrivalTime || '11:45 PM'}`,
        airline: flight?.airline || flight?.flightName || 'SkyHigh 202'
      },
      date: new Date().toISOString().split('T')[0],
      quantity,
      totalPrice: grandTotal,
      status: 'Paid',
      paymentMethod: 'Credit Card / UPI'
    };

    try {
      await fetch('/api/booking/flight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user ? user._id : 'demo-user',
          flightId: flight?._id || flight?.id,
          quantity,
          seats: selectedSeats.map(s => s.id),
          totalPrice: grandTotal
        })
      });
    } catch (err) {
      console.log('Booking submit notice:', err.message);
    }

    if (onConfirmBooking) {
      onConfirmBooking({
        flight,
        passengerCount: quantity,
        totalAmount: grandTotal,
        bookingId
      });
    }

    setIsBooked(true);
    setTimeout(() => {
      navigate('/profile');
    }, 2500);
  };

  const hotelsList = [
    {
      name: "Hotel Park Tree",
      rating: 4,
      price: 9000,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800",
      location: "Near Airport, New Delhi",
    },
    {
      name: "Lemon Tree Premier",
      rating: 4,
      price: 43875,
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800",
      location: "Connaught Place, New Delhi",
    },
    {
      name: "Hotel Kian",
      rating: 4,
      price: 1968,
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800",
      location: "Karol Bagh, New Delhi",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7fa] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {isBooked && (
          <div className="mb-6 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-sm text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-2xl font-bold text-emerald-900">Ticket Booked Successfully!</h3>
            <p className="text-sm font-semibold text-emerald-700">Booking Reference ID: {bookingRefId}</p>
            <p className="text-xs text-emerald-600">Redirecting to your user profile & booking history...</p>
          </div>
        )}

        {/* Active Price Freeze Protection Banner */}
        {frozenObj && (
          <div className="mb-6 p-4 bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-900 text-white rounded-2xl border border-emerald-700 shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                  <span>Price Freeze Guarantee Active</span>
                  <span className="bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded text-[10px]">
                    ID: {frozenObj.freezeId}
                  </span>
                </h4>
                <p className="text-xs text-slate-200 font-semibold mt-0.5">
                  Fare is locked at ₹{frozenObj.lockedPrice.toLocaleString('en-IN')}. Protected against price surges until{' '}
                  {new Date(frozenObj.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-emerald-400 font-extrabold block">LOCKED FARE</span>
              <span className="text-xl font-black text-white">₹{frozenObj.lockedPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN - FLIGHT TICKET DETAILS */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Main Ticket Box */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
              
              {/* Route & Badge Header */}
              <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                <div>
                  <div className="flex items-center flex-wrap gap-3 mb-2">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center">
                      <span>{flight?.from || 'Paris'}</span>
                      <ArrowRight className="w-5 h-5 mx-2 text-slate-400" />
                      <span>{flight?.to || 'Tokyo'}</span>
                    </h2>
                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                      CANCELLATION FEES APPLY
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 font-medium">
                    <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
                    <span>Departure: {flight?.departureTime || '08:30 AM'}</span>
                    <span className="mx-2">•</span>
                    <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                    <span>Non Stop - {flight?.duration || '7h 15m'}</span>
                  </div>
                </div>
                <button className="text-blue-600 text-xs font-bold hover:text-blue-700 flex items-center gap-1">
                  <Info className="w-4 h-4" />
                  View Fare Rules
                </button>
              </div>

              {/* Airline Badge Line */}
              <div className="flex items-center space-x-4 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Plane className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-base">{flight?.airline || flight?.flightName || 'SkyHigh 202'}</div>
                  <div className="text-xs text-gray-500 font-medium">
                    {flight?.flightNumber || flight?.code || 'IX 2747'} • Airbus A320
                  </div>
                </div>
                <div className="ml-auto text-xs flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 font-bold rounded-full border border-blue-100">
                    Economy
                  </span>
                </div>
              </div>

              {/* Timeline Departure / Arrival */}
              <div className="flex flex-wrap md:flex-nowrap justify-between items-start gap-6 border-t border-slate-100 pt-6">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">
                    {flight?.departureTime || '08:30 AM'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 flex items-start">
                    <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0 mt-0.5 text-red-500" />
                    {flight?.from || 'Paris'} International Airport
                  </div>
                </div>

                <div className="text-center flex-shrink-0">
                  <div className="text-xs text-gray-500 font-semibold mb-1">
                    {flight?.duration || '7h 15m'}
                  </div>
                  <div className="w-28 sm:w-36 h-0.5 bg-gray-300 relative my-2">
                    <div className="absolute -top-1.5 right-0 w-3 h-3 rounded-full bg-gray-400 flex items-center justify-center">
                      <Plane className="w-2 h-2 text-white" />
                    </div>
                  </div>
                  <div className="text-[11px] text-gray-400 font-medium">Non-stop</div>
                </div>

                <div className="text-right">
                  <div className="text-xl sm:text-2xl font-black text-slate-900">
                    {flight?.arrivalTime || '11:45 PM'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 flex items-start justify-end">
                    <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0 mt-0.5 text-red-500" />
                    {flight?.to || 'Tokyo'} International Airport
                  </div>
                </div>
              </div>

              {/* Baggage Information Footer */}
              <div className="flex flex-wrap gap-6 mt-6 text-xs text-gray-600 border-t border-slate-100 pt-4">
                <div className="flex items-center">
                  <Luggage className="w-4 h-4 mr-2 text-slate-400" />
                  <span>Cabin Baggage: <strong className="text-slate-800">7 Kgs / Adult</strong></span>
                </div>
                <div className="flex items-center">
                  <Luggage className="w-4 h-4 mr-2 text-slate-400" />
                  <span>Check-in Baggage: <strong className="text-slate-800">15 Kgs / Adult</strong></span>
                </div>
              </div>

            </div>

            {/* Cancellation & Date Change Policy Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  Cancellation & Date Change Policy
                </h2>
                <button className="text-blue-600 text-xs font-bold hover:underline">
                  View Policy
                </button>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Plane className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-bold text-slate-900 text-sm">{flight?.from} - {flight?.to}</span>
                  </div>
                  <div className="font-black text-lg text-slate-900">₹ {effectiveUnitFare.toLocaleString("en-IN")}</div>
                </div>
                
                {/* Progress bar */}
                <div className="h-2 bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 rounded-full"></div>
                <div className="flex justify-between mt-2 text-[11px] font-semibold text-gray-500">
                  <span>Standard Fare</span>
                  <span>Cancellation Charge Applies</span>
                </div>
              </div>
            </div>

            {/* Book a Flight & Unlock Offers Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-rose-500" />
                  Book a Flight & unlock these hotel stay offers
                </h2>
                <span className="bg-rose-50 text-rose-600 text-[11px] font-bold px-3 py-1 rounded-full border border-rose-100">
                  Flyer Exclusive Deal
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {hotelsList.map((h, index) => (
                  <div
                    key={index}
                    className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow group"
                  >
                    <div className="relative h-36">
                      <img
                        src={h.image}
                        alt={h.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md text-white px-2 py-0.5 rounded text-[10px] font-bold">
                        Best Seller
                      </span>
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-sm text-slate-900 truncate mb-1">
                        {h.name}
                      </h3>
                      <p className="text-[11px] text-gray-500 flex items-center gap-1 mb-2 truncate">
                        <MapPin className="w-3 h-3 text-red-500 flex-shrink-0" />
                        {h.location}
                      </p>
                      <div className="flex items-center justify-between border-t pt-2 mt-1">
                        <div className="flex items-center text-amber-400">
                          {[...Array(h.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-gray-400 block">Starting from</span>
                          <span className="font-extrabold text-xs text-slate-900">
                            ₹ {h.price.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN - FARE SUMMARY & PROMO CODES */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 sticky top-24 space-y-6">
              
              {/* Fare Summary Title */}
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-slate-700" />
                  Fare Summary
                </h2>

                <div className="space-y-2.5 text-sm text-gray-600">
                  <div className="flex justify-between items-center">
                    <span>Base Fare ({quantity} Traveler)</span>
                    <span className="font-bold text-slate-900">₹ {basePrice.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Taxes and Surcharges (12%)</span>
                    <span className="font-bold text-slate-900">₹ {taxes.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Other Services</span>
                    <span className="font-bold text-slate-900">₹ {otherServices.toLocaleString("en-IN")}</span>
                  </div>
                  {seatUpgradeFees > 0 && (
                    <div className="flex justify-between items-center text-indigo-600 font-bold">
                      <span>Seat Upgrades</span>
                      <span>+ ₹ {seatUpgradeFees.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  {discounts > 0 && (
                    <div className="flex justify-between items-center text-emerald-600 font-bold">
                      <span>Promo Discount</span>
                      <span>- ₹ {discounts.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="border-t border-slate-200 pt-3 mt-3">
                    <div className="flex justify-between items-center text-slate-900">
                      <span className="font-extrabold text-base">Total Amount</span>
                      <span className="font-black text-xl text-slate-900">₹ {grandTotal.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowSeatSelection(true)}
                  className="w-full mt-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-3 rounded-lg shadow-sm border border-slate-300 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <Armchair className="w-4 h-4" />
                  {selectedSeats.length > 0 ? `Seats Selected (${selectedSeats.length})` : 'Select Seats (Optional)'}
                </button>

                <button
                  onClick={() => setShowBookingModal(true)}
                  className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white font-extrabold py-3 rounded-lg shadow-md transition-colors text-base"
                >
                  Book Now (₹ {grandTotal.toLocaleString("en-IN")})
                </button>
              </div>

              {/* Promo Codes Box */}
              <div className="bg-[#FFF8E7] p-5 rounded-xl border border-amber-200/80">
                <h3 className="font-bold text-amber-900 text-xs tracking-wider uppercase mb-3 flex items-center gap-2">
                  <Gift className="w-4 h-4 text-amber-600" />
                  PROMO CODES
                </h3>

                <div className="mb-4">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    placeholder="Enter promo code here"
                    className="w-full px-3.5 py-2.5 border border-amber-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                  />
                </div>

                {/* Promo Radio 1 */}
                <div className="bg-white p-3.5 rounded-lg mb-3 border border-amber-100 shadow-sm">
                  <div className="flex items-start gap-2.5">
                    <input
                      type="radio"
                      name="promo"
                      id="promo1"
                      checked={selectedPromo === 'MMTSECURE'}
                      onChange={() => setSelectedPromo('MMTSECURE')}
                      className="mt-1 h-4 w-4 text-red-600 accent-red-600 cursor-pointer"
                    />
                    <label htmlFor="promo1" className="cursor-pointer">
                      <div className="font-extrabold text-red-600 text-xs">MMTSECURE</div>
                      <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                        Get an instant discount of ₹299 on your flight booking and Trip Secure with this coupon!
                      </p>
                    </label>
                  </div>
                </div>

                {/* Promo Radio 2 */}
                <div className="bg-white p-3.5 rounded-lg border border-amber-100 shadow-sm">
                  <div className="flex items-start gap-2.5">
                    <input
                      type="radio"
                      name="promo"
                      id="promo2"
                      checked={selectedPromo === 'SPECIALUPI'}
                      onChange={() => setSelectedPromo('SPECIALUPI')}
                      className="mt-1 h-4 w-4 text-red-600 accent-red-600 cursor-pointer"
                    />
                    <label htmlFor="promo2" className="cursor-pointer">
                      <div className="font-extrabold text-red-600 text-xs">SPECIALUPI</div>
                      <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                        Use this code and get ₹362 instant discount on payments via UPI only!
                      </p>
                    </label>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Flight Booking Details Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Plane className="w-6 h-6 text-slate-800" />
                Flight Booking Details
              </h2>
              <button 
                onClick={() => setShowBookingModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5" /> Flight Name
                  </label>
                  <input type="text" readOnly value={flight?.flightName || flight?.airline || 'SkyHigh 202'} className="w-full text-sm border border-slate-300 bg-blue-50/50 rounded-md px-3 py-2 text-blue-700 font-semibold focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> From
                  </label>
                  <input type="text" readOnly value={flight?.from || 'Paris'} className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 text-slate-700 focus:outline-none" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> To
                  </label>
                  <input type="text" readOnly value={flight?.to || 'Tokyo'} className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 text-slate-700 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Departure Time
                  </label>
                  <input type="text" readOnly value="1/21/2025, 3:41:00 PM" className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 text-slate-700 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Arrival Time
                  </label>
                  <input type="text" readOnly value="1/23/2025, 4:43:00 PM" className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 text-slate-700 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" /> Number of Tickets
                  </label>
                  <input type="number" min="1" max="9" value={quantity} onChange={(e) => setQuantity(Number(e.target.value) || 1)} className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 text-slate-700 focus:outline-none focus:border-slate-400" />
                </div>
              </div>

              <div className="bg-[#f8f9fa] rounded-xl p-5 mt-2 border border-slate-100">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2 mb-4">
                  <CreditCard className="w-4 h-4" /> Fare Summary
                </h4>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between items-center">
                    <span>Base Fare</span>
                    <span className="font-semibold text-slate-900">₹ {basePrice.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Taxes and Surcharges</span>
                    <span className="font-semibold text-slate-900">₹ {taxes.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Other Services</span>
                    <span className="font-semibold text-slate-900">₹ {otherServices.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-500 font-semibold">
                    <span>Discounts</span>
                    <span>- ₹ {discounts.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="border-t border-slate-200 mt-4 pt-4 flex justify-between items-center font-extrabold text-slate-900 text-base">
                    <span>Total Amount</span>
                    <span>₹ {grandTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 bg-white rounded-b-2xl">
              <button
                onClick={() => {
                  setShowBookingModal(false);
                  handleBookNow();
                }}
                className="w-full bg-[#1e293b] hover:bg-black text-white font-bold py-3.5 rounded-xl text-sm shadow-sm transition-colors"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      {/* Seat Selection Modal */}
      <SeatSelectionModal
        isOpen={showSeatSelection}
        onClose={() => setShowSeatSelection(false)}
        selectedQuantity={quantity}
        initialSelectedSeats={selectedSeats}
        onConfirm={(seats) => {
          setSelectedSeats(seats);
          setShowSeatSelection(false);
        }}
      />
    </div>
  );
}
