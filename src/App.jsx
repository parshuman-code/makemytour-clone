import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import FlightDetailsPage from './pages/FlightDetailsPage';
import BookFlightPage from './pages/BookFlightPage';
import BookHotelPage from './pages/BookHotelPage';
import ProfilePage from './pages/ProfilePage';
import BlogPage from './pages/BlogPage';
import FlightTrackerPage from './pages/FlightTrackerPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import HotelBookingModal from './components/HotelBookingModal';
import AdminModal from './components/AdminModal';
import NotificationToast from './components/NotificationToast';

import { initialFlightsData, bestOffersData } from './mockData';

function AppContent() {
  const [flights, setFlights] = useState(initialFlightsData);
  const [bestOffers] = useState(bestOffersData);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Modals & Notifications State
  const [selectedHotelForBooking, setSelectedHotelForBooking] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [activeNotification, setActiveNotification] = useState(null);

  const navigate = useNavigate();

  // Persistent Auth Session Restoration & Periodic Live Notification Simulation
  useEffect(() => {
    const savedUser = localStorage.getItem('mmt_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.email) {
          setUser(parsed);
          if (parsed.role === 'ADMIN') setIsAdmin(true);

          // Verify with backend
          fetch(`/api/user/email?email=${encodeURIComponent(parsed.email)}`)
            .then(res => res.json())
            .then(freshData => {
              if (freshData && freshData._id) {
                setUser(freshData);
                localStorage.setItem('mmt_user', JSON.stringify(freshData));
                if (freshData.role === 'ADMIN') setIsAdmin(true);
              }
            })
            .catch(err => console.log('Session validation notice:', err.message));
        }
      } catch (err) {
        localStorage.removeItem('mmt_user');
      }
    }

    // Fetch live flights from backend
    fetch('/api/flight')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setFlights(data);
        }
      })
      .catch(err => console.log('Backend connect notice:', err.message));

    // Simulate Live Push Notifications every 15 seconds
    const notificationTimer = setInterval(() => {
      const mockAlerts = [
        {
          flightNumber: '6E-204',
          title: 'Flight 6E-204 is Now Boarding!',
          message: 'Passengers traveling from Delhi (DEL) to Mumbai (BOM) are requested to proceed to Gate 4B.',
          reason: 'Scheduled departure at 06:30 AM',
          type: 'info'
        },
        {
          flightNumber: 'AI-502',
          title: 'Flight AI-502 Status Update: Delayed by 45m',
          message: 'Revised departure: 12:00 PM (Mumbai to Bengaluru). Expected arrival: 01:45 PM.',
          reason: 'Heavy Rain & Adverse Weather in Mumbai Airspace',
          type: 'delay'
        },
        {
          flightNumber: 'SG-993',
          title: 'Gate Changed for Flight SG-993',
          message: 'Departure gate changed to Gate 18 (Terminal 1D) for Delhi to Kolkata flight.',
          reason: 'Late Arrival of Inbound Aircraft',
          type: 'gate'
        }
      ];

      const randomAlert = mockAlerts[Math.floor(Math.random() * mockAlerts.length)];
      setActiveNotification(randomAlert);
    }, 15000);

    return () => clearInterval(notificationTimer);
  }, []);

  const handleOpenBookingModal = (item, travelers = 1) => {
    if (item.isHotel || item.hotelName) {
      const hotelId = item._id || item.id || '1';
      navigate(`/book-hotel/${hotelId}`);
    } else {
      const flightId = item._id || item.id || 'FL-202';
      navigate(`/book-flight/${flightId}`);
    }
  };

  const handleConfirmFlightBooking = (bookingData) => {
    const flightObj = bookingData.flight || {};
    const newBookingObj = {
      bookingId: bookingData.bookingId || `MMT-FL-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'flight',
      itemDetails: {
        title: flightObj.flightName || flightObj.airline || "Flight Booking",
        route: `${flightObj.from || 'Delhi'} → ${flightObj.to || 'Mumbai'}`,
        date: new Date().toISOString().split('T')[0],
        time: `${flightObj.departureTime || '06:30 AM'} - ${flightObj.arrivalTime || '06:45 PM'}`,
        airline: flightObj.airline || flightObj.flightName || 'IndiGo'
      },
      date: new Date().toISOString().split('T')[0],
      quantity: bookingData.passengerCount || 1,
      totalPrice: bookingData.totalAmount || 5500,
      status: "Paid",
      paymentMethod: "Credit Card / UPI"
    };

    const updatedUserObj = {
      ...user,
      bookings: [newBookingObj, ...(user?.bookings || [])]
    };

    setUser(updatedUserObj);
    localStorage.setItem('mmt_user', JSON.stringify(updatedUserObj));
  };

  const handleConfirmHotelBooking = (bookingData) => {
    const newBookingObj = {
      bookingId: bookingData.bookingId || `MMT-HT-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'hotel',
      itemDetails: bookingData.itemDetails,
      date: new Date().toISOString().split('T')[0],
      quantity: bookingData.quantity,
      totalPrice: bookingData.totalAmount,
      status: "Paid",
      paymentMethod: "Credit Card / UPI"
    };

    const updatedUserObj = {
      ...user,
      bookings: [newBookingObj, ...(user?.bookings || [])]
    };

    setUser(updatedUserObj);
    localStorage.setItem('mmt_user', JSON.stringify(updatedUserObj));
    setSelectedHotelForBooking(null);
    navigate('/profile');
  };

  return (
    <div className="min-h-screen text-slate-900 font-sans">
      <Navbar 
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        onOpenAdminModal={() => navigate('/admin')}
        user={user}
        setUser={setUser}
      />

      <Routes>
        <Route 
          path="/" 
          element={
            <HomePage 
              flights={flights} 
              bestOffers={bestOffers}
              onBookFlight={handleOpenBookingModal}
              user={user}
            />
          } 
        />
        <Route 
          path="/flight-tracker" 
          element={
            <FlightTrackerPage 
              onTriggerNotification={(notif) => setActiveNotification(notif)} 
            />
          } 
        />
        <Route 
          path="/book-flight/:id" 
          element={
            <BookFlightPage 
              flights={flights}
              user={user}
              onConfirmBooking={handleConfirmFlightBooking}
            />
          } 
        />
        <Route 
          path="/book-hotel/:id" 
          element={
            <BookHotelPage 
              user={user}
              onConfirmBooking={handleConfirmHotelBooking}
            />
          } 
        />
        <Route 
          path="/blog" 
          element={<BlogPage />} 
        />
        <Route 
          path="/admin" 
          element={<AdminDashboardPage />} 
        />
        <Route 
          path="/flight-details/:id" 
          element={
            <FlightDetailsPage 
              flights={flights}
              onBookFlight={handleOpenBookingModal}
            />
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProfilePage 
              user={user}
              setUser={setUser}
              onLogout={() => { setUser(null); localStorage.removeItem('mmt_user'); }}
            />
          } 
        />
      </Routes>

      {/* Live Push Notification Toast Banner */}
      <NotificationToast 
        notification={activeNotification} 
        onClose={() => setActiveNotification(null)} 
      />

      {/* Hotel Booking Modal */}
      {selectedHotelForBooking && (
        <HotelBookingModal
          hotel={selectedHotelForBooking}
          user={user}
          onClose={() => setSelectedHotelForBooking(null)}
          onConfirmBooking={handleConfirmHotelBooking}
        />
      )}

      {/* Admin Panel Modal Overlay */}
      {showAdminModal && (
        <AdminModal
          flights={flights}
          setFlights={setFlights}
          onClose={() => setShowAdminModal(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
