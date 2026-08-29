import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, Edit2, MapPin, Calendar, CreditCard, X, Check, LogOut, Plane, Building2, Lock, Clock, ArrowRight, Trash2, ShieldAlert, RefreshCw, AlertTriangle } from 'lucide-react';
import Footer from '../components/Footer';
import CancellationModal from '../components/CancellationModal';
import RefundTrackerModal from '../components/RefundTrackerModal';
import { getFrozenPrices, removePriceFreeze } from '../utils/pricingEngine';

export default function ProfilePage({ user, setUser, onLogout }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    profilePic: user?.profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  });
  const [bookingsList, setBookingsList] = useState(user?.bookings || []);
  const [activeFreezes, setActiveFreezes] = useState([]);
  const [preferences, setPreferences] = useState({ seat: 'Not Set', room: 'Not Set' });

  // Modals state
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);
  const [selectedBookingForTracker, setSelectedBookingForTracker] = useState(null);

  useEffect(() => {
    setActiveFreezes(getFrozenPrices());
    const interval = setInterval(() => {
      setActiveFreezes(getFrozenPrices());
    }, 5000);
    
    // Load preferences
    const storedUser = JSON.parse(localStorage.getItem('mmt_user') || '{}');
    if (storedUser.seatPreference || storedUser.roomPreference) {
      setPreferences({
        seat: storedUser.seatPreference || 'Not Set',
        room: storedUser.roomPreference || 'Not Set'
      });
    }
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user) {
      setUserData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        profilePic: user.profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
      });
      setBookingsList(user.bookings || []);

      // Fetch fresh user data from MongoDB
      if (user.email) {
        fetch(`/api/user/email?email=${encodeURIComponent(user.email)}`)
          .then(res => res.json())
          .then(freshUser => {
            if (freshUser && freshUser._id) {
              setUser(freshUser);
              localStorage.setItem('mmt_user', JSON.stringify(freshUser));
              setBookingsList(freshUser.bookings || []);
            }
          })
          .catch(err => console.log('MongoDB user fetch notice:', err.message));
      }
    }
  }, [user?.email]);

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/');
  };

  const handleEditFormChange = (field, value) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    const updatedUserObj = {
      ...user,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      profilePic: userData.profilePic
    };

    try {
      const res = await fetch(`/api/user/edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user?._id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          profilePic: userData.profilePic
        })
      });
      if (res.ok) {
        const savedUser = await res.json();
        setUser(savedUser);
        localStorage.setItem('mmt_user', JSON.stringify(savedUser));
      } else {
        setUser(updatedUserObj);
        localStorage.setItem('mmt_user', JSON.stringify(updatedUserObj));
      }
    } catch (err) {
      setUser(updatedUserObj);
      localStorage.setItem('mmt_user', JSON.stringify(updatedUserObj));
    }
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleRemoveFreeze = (freezeId) => {
    removePriceFreeze(freezeId);
    setActiveFreezes(getFrozenPrices());
  };

  const handleConfirmCancel = (cancellationPayload) => {
    const { bookingId, cancellationDetails } = cancellationPayload;
    
    const updatedBookings = bookingsList.map(b => {
      if (b.bookingId === bookingId) {
        return {
          ...b,
          status: 'Cancelled',
          cancellationDetails
        };
      }
      return b;
    });

    setBookingsList(updatedBookings);
    const updatedUserObj = {
      ...user,
      bookings: updatedBookings
    };
    setUser(updatedUserObj);
    localStorage.setItem('mmt_user', JSON.stringify(updatedUserObj));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-8 px-4 pb-0">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Active Price Freezes Section */}
          {activeFreezes.length > 0 && (
            <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white rounded-3xl shadow-xl p-6 border border-rose-900/40">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black">Active Price Freeze Protection</h3>
                    <p className="text-xs text-slate-300">Your locked flight fares protected against dynamic surges</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold bg-rose-500 text-white px-3 py-1 rounded-full">
                  {activeFreezes.length} Active Lock{activeFreezes.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeFreezes.map((freeze) => {
                  const timeLeftMs = Math.max(0, freeze.expiresAt - Date.now());
                  const hoursLeft = Math.floor(timeLeftMs / (1000 * 60 * 60));
                  const minsLeft = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));

                  return (
                    <div key={freeze.freezeId} className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-extrabold text-slate-300">
                            {freeze.airline} ({freeze.flightCode})
                          </span>
                          <span className="text-rose-400 font-bold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {hoursLeft}h {minsLeft}m left
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm font-black text-white mb-2">
                          <span>{freeze.from}</span>
                          <ArrowRight className="w-4 h-4 text-rose-400" />
                          <span>{freeze.to}</span>
                        </div>

                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-xl font-black text-emerald-400">
                            ₹{freeze.lockedPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-slate-400 line-through">
                            ₹{freeze.originalPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-700">
                        <button
                          onClick={() => navigate(`/book-flight/${freeze.flightId}`)}
                          className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                        >
                          Book at Frozen Fare
                        </button>
                        <button
                          onClick={() => handleRemoveFreeze(freeze.freezeId)}
                          className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-rose-400 transition-colors"
                          title="Release price freeze"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Profile Section - Left Column */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6">
                
                {/* Profile Header Avatar */}
                <div className="flex flex-col items-center mb-6 border-b border-gray-100 pb-6">
                  <div className="w-20 h-20 rounded-full bg-slate-900 text-white font-extrabold text-2xl flex items-center justify-center border-4 border-blue-500 shadow-md mb-3">
                    {(userData.firstName || 'U').charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{userData.firstName} {userData.lastName}</h3>
                  <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100 mt-1">
                    {user?.role || 'USER'}
                  </span>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-slate-900">Personal Details</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-red-600 flex items-center space-x-1 hover:text-red-700 text-sm font-semibold"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={userData.firstName}
                        onChange={(e) => handleEditFormChange('firstName', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={userData.lastName}
                        onChange={(e) => handleEditFormChange('lastName', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={userData.email}
                        onChange={(e) => handleEditFormChange('email', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={userData.phoneNumber}
                        onChange={(e) => handleEditFormChange('phoneNumber', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Profile Picture URL
                      </label>
                      <input
                        type="text"
                        value={userData.profilePic}
                        onChange={(e) => handleEditFormChange('profilePic', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-xs"
                      />
                    </div>
                    <div className="flex space-x-3 pt-2">
                      <button
                        onClick={handleSave}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 text-sm font-bold shadow-sm"
                      >
                        <Check className="w-4 h-4" />
                        <span>Save to MongoDB</span>
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 text-sm font-bold"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-900 text-sm">
                          {userData.firstName} {userData.lastName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <p className="text-sm text-slate-700 truncate">{userData.email}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <p className="text-sm text-slate-700">{userData.phoneNumber}</p>
                    </div>
                    <button
                      className="w-full mt-4 flex items-center justify-center space-x-2 text-red-600 hover:text-red-700 font-semibold text-sm py-2 border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log out</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Travel Preferences */}
              <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Travel Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <Plane className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Flight Seat</p>
                      <p className="font-bold text-slate-900 text-sm">
                        {preferences.seat}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <Building2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Hotel Room</p>
                      <p className="font-bold text-slate-900 text-sm">
                        {preferences.room}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Bookings Section - Right Column */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-slate-900">Booking History</h2>
                <div className="space-y-6">
                  {bookingsList.length > 0 ? (
                    bookingsList.map((booking, index) => {
                      const isCancelled = booking.status === 'Cancelled';

                      return (
                        <div
                          key={booking.bookingId || index}
                          className={`border rounded-xl p-5 hover:shadow-md transition-all ${
                            isCancelled ? 'bg-slate-50/60 border-rose-200' : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              {booking?.type === 'hotel' ? (
                                <div className="bg-green-100 p-2.5 rounded-xl">
                                  <Building2 className="w-6 h-6 text-green-600" />
                                </div>
                              ) : (
                                <div className="bg-blue-100 p-2.5 rounded-xl">
                                  <Plane className="w-6 h-6 text-blue-600" />
                                </div>
                              )}
                              <div>
                                <h3 className="font-bold text-slate-900 text-base">
                                  {booking?.itemDetails?.title || booking?.itemDetails?.hotelName || (booking?.type === 'hotel' ? 'Hotel Stay' : 'Flight')}
                                </h3>
                                <p className="text-xs text-gray-500 font-semibold">
                                  Booking ID: {booking?.bookingId}
                                </p>
                                {booking?.itemDetails?.route && (
                                  <p className="text-xs text-blue-600 font-bold mt-0.5">
                                    {booking.itemDetails.route}
                                  </p>
                                )}
                                {booking?.itemDetails?.location && (
                                  <p className="text-xs text-green-600 font-bold mt-0.5">
                                    {booking.itemDetails.location}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="font-black text-lg text-slate-900">
                                ₹{Number(booking?.totalPrice || booking?.totalAmount || 5000).toLocaleString("en-IN")}
                              </p>
                              {isCancelled ? (
                                <span className="inline-block text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                                  Cancelled
                                </span>
                              ) : (
                                <span className="inline-block text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                                  {booking?.status || 'Paid'}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Cancellation Audit Badge if Cancelled */}
                          {isCancelled && booking.cancellationDetails && (
                            <div className="mb-3 p-3 bg-rose-50/70 border border-rose-200/80 rounded-xl flex items-center justify-between text-xs">
                              <div>
                                <span className="font-extrabold text-rose-900 block">
                                  Refund Initiated: ₹{Number(booking.cancellationDetails.refundAmount || 0).toLocaleString('en-IN')}
                                </span>
                                <span className="text-[11px] text-rose-700 font-medium">
                                  Reason: {booking.cancellationDetails.reason}
                                </span>
                              </div>
                              <button
                                onClick={() => setSelectedBookingForTracker(booking)}
                                className="px-3 py-1.5 rounded-full bg-slate-900 text-white font-extrabold text-[11px] shadow-sm hover:bg-slate-800 transition-colors flex items-center gap-1"
                              >
                                <RefreshCw className="w-3 h-3 text-emerald-400" />
                                Track Refund Status
                              </button>
                            </div>
                          )}

                          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-gray-600 border-t pt-3 mt-2">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Date: {formatDate(booking?.date || booking?.itemDetails?.date)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <CreditCard className="w-3.5 h-3.5" />
                                <span>{booking?.paymentMethod || 'Paid via Card / UPI'}</span>
                              </div>
                            </div>

                            {!isCancelled && (
                              <button
                                onClick={() => setSelectedBookingForCancel(booking)}
                                className="text-xs font-extrabold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-full border border-rose-200 transition-colors flex items-center gap-1"
                              >
                                <ShieldAlert className="w-3.5 h-3.5" />
                                Cancel Booking & Request Refund
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Plane className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="font-bold text-gray-700">No flight or hotel bookings found</p>
                      <p className="text-sm mt-1">Book your travel from the home page to see your history here.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedBookingForCancel && (
        <CancellationModal
          booking={selectedBookingForCancel}
          onClose={() => setSelectedBookingForCancel(null)}
          onConfirmCancel={handleConfirmCancel}
        />
      )}

      {selectedBookingForTracker && (
        <RefundTrackerModal
          booking={selectedBookingForTracker}
          onClose={() => setSelectedBookingForTracker(null)}
        />
      )}

      <Footer />
    </div>
  );
}
