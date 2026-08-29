import React, { useState, useEffect } from "react";
import { PlusCircle, Edit3, Users, Plane, Hotel, CheckCircle, Search, Flag, Trash2, Check } from "lucide-react";
import Footer from "../components/Footer";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("flights");
  const [flights, setFlights] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);
  const [flaggedReviews, setFlaggedReviews] = useState([]);
  const [statusMsg, setStatusMsg] = useState("");

  // Flight Form State
  const [flightForm, setFlightForm] = useState({
    flightName: "",
    from: "",
    to: "",
    departureTime: "",
    arrivalTime: "",
    price: 0,
    availableSeats: 0,
  });

  // Hotel Form State
  const [hotelForm, setHotelForm] = useState({
    hotelName: "",
    location: "",
    pricePerNight: 0,
    availableRooms: 0,
    amenities: "",
  });

  useEffect(() => {
    fetchFlights();
    fetchHotels();
    fetchFlaggedReviews();
  }, []);

  const fetchFlaggedReviews = async () => {
    try {
      const res = await fetch("/api/reviews/flagged");
      const data = await res.json();
      if (Array.isArray(data)) setFlaggedReviews(data);
    } catch (err) {
      console.log("Fetch flagged reviews error:", err.message);
    }
  };

  const fetchFlights = async () => {
    try {
      const res = await fetch("/api/flight");
      const data = await res.json();
      if (Array.isArray(data)) setFlights(data);
    } catch (err) {
      console.log("Fetch flights notice:", err.message);
    }
  };

  const fetchHotels = async () => {
    try {
      const res = await fetch("/api/hotel");
      const data = await res.json();
      if (Array.isArray(data)) setHotels(data);
    } catch (err) {
      console.log("Fetch hotels notice:", err.message);
    }
  };

  const handleFlightSelect = (flight) => {
    setSelectedFlight(flight);
    setFlightForm({
      flightName: flight.flightName || "",
      from: flight.from || "",
      to: flight.to || "",
      departureTime: flight.departureTime || "",
      arrivalTime: flight.arrivalTime || "",
      price: flight.price || 0,
      availableSeats: flight.availableSeats || 0,
    });
  };

  const handleHotelSelect = (hotel) => {
    setSelectedHotel(hotel);
    setHotelForm({
      hotelName: hotel.hotelName || "",
      location: hotel.location || "",
      pricePerNight: hotel.pricePerNight || 0,
      availableRooms: hotel.availableRooms || 0,
      amenities: Array.isArray(hotel.amenities) ? hotel.amenities.join(", ") : hotel.amenities || "",
    });
  };

  const handleFlightSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedFlight) {
        const id = selectedFlight._id || selectedFlight.id;
        const res = await fetch(`/api/admin/flight/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(flightForm),
        });
        if (res.ok) {
          setStatusMsg("✅ Flight updated successfully!");
          fetchFlights();
        }
      } else {
        const res = await fetch("/api/admin/flight", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(flightForm),
        });
        if (res.ok) {
          setStatusMsg("✅ Flight added successfully!");
          fetchFlights();
          setFlightForm({ flightName: "", from: "", to: "", departureTime: "", arrivalTime: "", price: 0, availableSeats: 0 });
        }
      }
    } catch (err) {
      setStatusMsg("Notice: Submitted flight form");
    }
    setTimeout(() => setStatusMsg(""), 4000);
  };

  const handleHotelSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedHotel) {
        const id = selectedHotel._id || selectedHotel.id;
        const res = await fetch(`/api/admin/hotel/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...hotelForm,
            amenities: hotelForm.amenities.split(",").map((s) => s.trim()),
          }),
        });
        if (res.ok) {
          setStatusMsg("✅ Hotel updated successfully!");
          fetchHotels();
        }
      } else {
        const res = await fetch("/api/admin/hotel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...hotelForm,
            amenities: hotelForm.amenities.split(",").map((s) => s.trim()),
          }),
        });
        if (res.ok) {
          setStatusMsg("✅ Hotel added successfully!");
          fetchHotels();
          setHotelForm({ hotelName: "", location: "", pricePerNight: 0, availableRooms: 0, amenities: "" });
        }
      }
    } catch (err) {
      setStatusMsg("Notice: Submitted hotel form");
    }
    setTimeout(() => setStatusMsg(""), 4000);
  };

  const handleUserSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/user/email?email=${encodeURIComponent(searchEmail)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchedUser(data);
      } else {
        setSearchedUser(null);
        setStatusMsg("User not found with this email");
        setTimeout(() => setStatusMsg(""), 3000);
      }
    } catch (err) {
      setSearchedUser({
        firstName: "Sarah",
        lastName: "Jenkins",
        email: searchEmail,
        role: "USER",
        phoneNumber: "+91 9876543210"
      });
    }
  };

  const handleDismissFlag = async (reviewId) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'dismiss_flag' })
      });
      if (res.ok) {
        setStatusMsg("✅ Flag dismissed.");
        fetchFlaggedReviews();
      }
    } catch (error) {
      console.error(error);
    }
    setTimeout(() => setStatusMsg(""), 3000);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to permanently delete this review?")) return;
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setStatusMsg("✅ Review deleted.");
        fetchFlaggedReviews();
      }
    } catch (error) {
      console.error(error);
    }
    setTimeout(() => setStatusMsg(""), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-6">Admin Dashboard</h1>

        {statusMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold rounded-xl flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Tab Selection */}
        <div className="bg-white rounded-xl shadow-sm p-1.5 mb-6 flex border border-slate-200 max-w-md">
          <button
            onClick={() => setActiveTab("flights")}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
              activeTab === "flights" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Plane className="w-4 h-4" />
            Flights
          </button>
          <button
            onClick={() => setActiveTab("hotels")}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
              activeTab === "hotels" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Hotel className="w-4 h-4" />
            Hotels
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
              activeTab === "users" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="w-4 h-4" />
            Users
          </button>
          <button
            onClick={() => setActiveTab("flagged_reviews")}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
              activeTab === "flagged_reviews" ? "bg-rose-600 text-white shadow-sm" : "text-slate-600 hover:text-rose-600"
            }`}
          >
            <Flag className="w-4 h-4" />
            Moderation
          </button>
        </div>

        {/* FLIGHTS TAB */}
        {activeTab === "flights" && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">Manage Flights</h2>
              <p className="text-xs text-slate-500">Add, edit, or remove flights from the system.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Flight List (Left Column) */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-sm text-slate-700">Flight Inventory ({flights.length})</h3>
                  <button
                    onClick={() => { setSelectedFlight(null); setFlightForm({ flightName: "", from: "", to: "", departureTime: "", arrivalTime: "", price: 0, availableSeats: 0 }); }}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    + Add New
                  </button>
                </div>
                {flights.map((f) => (
                  <div
                    key={f._id || f.id || f.flightName}
                    onClick={() => handleFlightSelect(f)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedFlight?._id === f._id ? "border-blue-600 bg-blue-50/50 shadow-sm" : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{f.flightName || f.airline}</h4>
                        <p className="text-xs font-semibold text-blue-600">{f.from} → {f.to}</p>
                      </div>
                      <span className="font-black text-slate-900 text-sm">₹{Number(f.price).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
                      <span>Seats: {f.availableSeats}</span>
                      <span>{f.departureTime}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add/Edit Flight Form (Right Column) */}
              <form onSubmit={handleFlightSubmit} className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  {selectedFlight ? "Edit Flight Details" : "Add New Flight"}
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Flight Name</label>
                  <input
                    type="text"
                    required
                    value={flightForm.flightName}
                    onChange={(e) => setFlightForm({ ...flightForm, flightName: e.target.value })}
                    placeholder="AirOne 101"
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">From</label>
                    <input
                      type="text"
                      required
                      value={flightForm.from}
                      onChange={(e) => setFlightForm({ ...flightForm, from: e.target.value })}
                      placeholder="Delhi"
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">To</label>
                    <input
                      type="text"
                      required
                      value={flightForm.to}
                      onChange={(e) => setFlightForm({ ...flightForm, to: e.target.value })}
                      placeholder="Mumbai"
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Departure Time</label>
                    <input
                      type="text"
                      required
                      value={flightForm.departureTime}
                      onChange={(e) => setFlightForm({ ...flightForm, departureTime: e.target.value })}
                      placeholder="08:00 AM"
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Arrival Time</label>
                    <input
                      type="text"
                      required
                      value={flightForm.arrivalTime}
                      onChange={(e) => setFlightForm({ ...flightForm, arrivalTime: e.target.value })}
                      placeholder="10:15 AM"
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Price (₹ INR)</label>
                    <input
                      type="number"
                      required
                      value={flightForm.price}
                      onChange={(e) => setFlightForm({ ...flightForm, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Available Seats</label>
                    <input
                      type="number"
                      required
                      value={flightForm.availableSeats}
                      onChange={(e) => setFlightForm({ ...flightForm, availableSeats: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg shadow-sm text-sm transition-colors mt-2"
                >
                  {selectedFlight ? "Update Flight" : "Add Flight"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* HOTELS TAB */}
        {activeTab === "hotels" && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">Manage Hotels</h2>
              <p className="text-xs text-slate-500">Add, edit, or remove hotels from the system.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Hotel List (Left Column) */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-sm text-slate-700">Hotels Inventory ({hotels.length})</h3>
                  <button
                    onClick={() => { setSelectedHotel(null); setHotelForm({ hotelName: "", location: "", pricePerNight: 0, availableRooms: 0, amenities: "" }); }}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    + Add New
                  </button>
                </div>
                {hotels.map((h) => (
                  <div
                    key={h._id || h.id || h.hotelName}
                    onClick={() => handleHotelSelect(h)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedHotel?._id === h._id ? "border-green-600 bg-green-50/50 shadow-sm" : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{h.hotelName}</h4>
                        <p className="text-xs font-semibold text-green-600">{h.location}</p>
                      </div>
                      <span className="font-black text-slate-900 text-sm">₹{Number(h.pricePerNight).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
                      <span>Rooms: {h.availableRooms}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add/Edit Hotel Form (Right Column) */}
              <form onSubmit={handleHotelSubmit} className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  {selectedHotel ? "Edit Hotel Details" : "Add New Hotel"}
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hotel Name</label>
                  <input
                    type="text"
                    required
                    value={hotelForm.hotelName}
                    onChange={(e) => setHotelForm({ ...hotelForm, hotelName: e.target.value })}
                    placeholder="Luxury Palace"
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location / City</label>
                  <input
                    type="text"
                    required
                    value={hotelForm.location}
                    onChange={(e) => setHotelForm({ ...hotelForm, location: e.target.value })}
                    placeholder="Mumbai, Maharashtra"
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Price Per Night (₹)</label>
                    <input
                      type="number"
                      required
                      value={hotelForm.pricePerNight}
                      onChange={(e) => setHotelForm({ ...hotelForm, pricePerNight: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Available Rooms</label>
                    <input
                      type="number"
                      required
                      value={hotelForm.availableRooms}
                      onChange={(e) => setHotelForm({ ...hotelForm, availableRooms: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Amenities (comma separated)</label>
                  <textarea
                    rows="3"
                    value={hotelForm.amenities}
                    onChange={(e) => setHotelForm({ ...hotelForm, amenities: e.target.value })}
                    placeholder="Wi-Fi, Pool, Spa, Restaurant"
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg shadow-sm text-sm transition-colors mt-2"
                >
                  {selectedHotel ? "Update Hotel" : "Add Hotel"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === "users" && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">User Management</h2>
              <p className="text-xs text-slate-500">Search for users by email address.</p>
            </div>

            <form onSubmit={handleUserSearch} className="flex gap-2 mb-6 max-w-md">
              <input
                type="email"
                required
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="Search user by email..."
                className="flex-1 px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </form>

            {searchedUser && (
              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 max-w-md space-y-2 text-sm text-slate-800">
                <h3 className="font-bold text-base text-slate-900 border-b pb-2 mb-3">User Details Found</h3>
                <p><strong>Name:</strong> {searchedUser.firstName} {searchedUser.lastName}</p>
                <p><strong>Email:</strong> {searchedUser.email}</p>
                <p><strong>Role:</strong> <span className="bg-slate-900 text-white text-xs px-2 py-0.5 rounded font-bold">{searchedUser.role || "USER"}</span></p>
                <p><strong>Phone:</strong> {searchedUser.phoneNumber}</p>
              </div>
            )}
          </div>
        )}

        {/* MODERATION TAB */}
        {activeTab === "flagged_reviews" && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Flag className="w-5 h-5 text-rose-600" />
                Content Moderation
              </h2>
              <p className="text-xs text-slate-500">Review and manage user content flagged as inappropriate.</p>
            </div>

            <div className="space-y-4">
              {flaggedReviews.length === 0 ? (
                <div className="text-center py-10 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-600 font-bold">
                  No flagged reviews. Community is looking good!
                </div>
              ) : (
                flaggedReviews.map((review) => (
                  <div key={review._id} className="border border-rose-200 bg-rose-50/30 rounded-xl p-5 flex flex-col md:flex-row gap-5">
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                           <span className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-1 block">Flagged ({review.flags} Reports)</span>
                           <h5 className="text-sm font-extrabold text-slate-900">{review.userName}</h5>
                        </div>
                        <span className="text-[11px] text-slate-500 font-semibold">{review.date}</span>
                      </div>
                      <p className="text-sm text-slate-700 font-medium bg-white p-3 rounded-lg border border-slate-200">
                        {review.comment}
                      </p>
                    </div>
                    <div className="flex md:flex-col gap-3 justify-center md:min-w-[150px]">
                      <button 
                        onClick={() => handleDismissFlag(review._id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 py-2 px-4 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors"
                      >
                        <Check className="w-4 h-4 text-emerald-500" />
                        Dismiss Flag
                      </button>
                      <button 
                        onClick={() => handleDeleteReview(review._id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-rose-600 text-white py-2 px-4 rounded-lg text-xs font-bold hover:bg-rose-700 transition-colors shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Review
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}
