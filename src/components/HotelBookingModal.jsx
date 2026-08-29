import React, { useState } from 'react';
import { Dialog, DialogHeader, DialogContent } from './ui/Dialog';
import { Building2, Calendar, MapPin, Users, AlertCircle } from 'lucide-react';

export default function HotelBookingModal({ hotel, onClose, onConfirmBooking, user }) {
  const [guestName, setGuestName] = useState(user ? `${user.firstName} ${user.lastName}` : '');
  const [guestEmail, setGuestEmail] = useState(user ? user.email : '');
  const [roomsCount, setRoomsCount] = useState(1);
  const [checkInDate, setCheckInDate] = useState(new Date().toISOString().split('T')[0]);
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const pricePerNight = hotel?.pricePerNight || 8000;
  const basePrice = pricePerNight * roomsCount * 2; // default 2 nights
  const taxesAndFees = Math.round(basePrice * 0.12);
  const totalAmount = basePrice + taxesAndFees;

  const handleBookHotel = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const userId = user ? user._id : 'demo-user-123';
      const hotelId = hotel._id || hotel.id || 'hotel-default';

      const res = await fetch('/api/booking/hotel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          hotelId,
          rooms: roomsCount,
          price: totalAmount,
          date: checkInDate
        })
      });

      let responseData;
      if (res.ok) {
        responseData = await res.json();
      }

      onConfirmBooking({
        type: 'hotel',
        itemDetails: {
          title: hotel.hotelName,
          hotelName: hotel.hotelName,
          location: hotel.location,
          date: `${checkInDate} to ${checkOutDate}`
        },
        quantity: roomsCount,
        totalAmount,
        bookingId: responseData?.bookingId || `MMT-HT-${Math.floor(100000 + Math.random() * 900000)}`
      });
    } catch (err) {
      onConfirmBooking({
        type: 'hotel',
        itemDetails: {
          title: hotel.hotelName,
          hotelName: hotel.hotelName,
          location: hotel.location,
          date: `${checkInDate} to ${checkOutDate}`
        },
        quantity: roomsCount,
        totalAmount,
        bookingId: `MMT-HT-${Math.floor(100000 + Math.random() * 900000)}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog isOpen={true} onClose={onClose} maxWidth="max-w-lg">
      <DialogHeader
        title="Book Hotel Stay"
        subtitle={`${hotel?.hotelName} — ${hotel?.location}`}
        onClose={onClose}
      />
      <DialogContent>
        <form onSubmit={handleBookHotel} className="space-y-5">
          
          {/* Hotel Summary Header */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Building2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-lg text-slate-900">{hotel?.hotelName}</p>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-500" />
                  {hotel?.location}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg text-slate-900">₹{Number(pricePerNight).toLocaleString("en-IN")}/night</p>
            </div>
          </div>

          {/* Guest Information & Dates */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Guest Name</label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Check-in Date</label>
                <input
                  type="date"
                  required
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs font-bold focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Check-out Date</label>
                <input
                  type="date"
                  required
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs font-bold focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Rooms</label>
              <input
                type="number"
                min={1}
                max={5}
                value={roomsCount}
                onChange={(e) => setRoomsCount(Number(e.target.value) || 1)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm font-bold"
              />
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="bg-gray-50 border rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-sm text-gray-800 mb-2">Booking Summary</h4>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Room Rate (₹{Number(pricePerNight).toLocaleString("en-IN")} × {roomsCount} rooms × 2 nights)</span>
              <span>₹{basePrice.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>GST & Resort Fees</span>
              <span>₹{taxesAndFees.toLocaleString("en-IN")}</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between font-bold text-slate-900">
              <span>Total Amount</span>
              <span className="text-lg text-green-700">₹{totalAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-medium rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {errorMsg}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-bold text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition-colors font-bold text-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Confirming...' : `Pay ₹${totalAmount.toLocaleString("en-IN")} & Reserve`}
            </button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
}
