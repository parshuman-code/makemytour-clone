import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plane, Hotel, HomeIcon, Umbrella, Train, Bus, Car, CreditCard, Shield, 
  MapPin, Calendar, Users, QrCode, Sparkles, Flame, ShieldCheck, Lock, TrendingUp 
} from 'lucide-react';
import Footer from '../components/Footer';
import { SearchSelect } from '../components/SearchSelect';
import FlightCard from '../components/FlightCard';
import HotelCard from '../components/HotelCard';
import { calculateDynamicPrice } from '../utils/pricingEngine';
import { initialHotelsData } from '../mockData';
import RecommendationEngine from '../components/RecommendationEngine';

export default function HomePage({ flights = [], bestOffers, onBookFlight, user }) {
  const [bookingtype, setbookingtype] = useState("flights");
  const [from, setfrom] = useState("");
  const [to, setto] = useState("");
  const [date, setdate] = useState("");
  const [travelers, settravelers] = useState(1);
  const [searchresults, setsearchresults] = useState([]);
  const [flightList, setFlightList] = useState(flights || []);
  const [hotelList, setHotelList] = useState(initialHotelsData || []);
  const [isHolidayPeak, setIsHolidayPeak] = useState(false);

  useEffect(() => {
    // Fetch live flights from backend API with holiday surge query parameter
    const url = `/api/flight?holidayPeak=${isHolidayPeak}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setFlightList(data);
        } else {
          // Calculate client-side fallback
          setFlightList(flights.map(f => ({
            ...f,
            dynamicPricing: calculateDynamicPrice(f.price || 5500, {
              seatsAvailable: f.availableSeats || f.seatsAvailable || 20,
              isHolidaySeason: isHolidayPeak
            })
          })));
        }
      })
      .catch(err => {
        setFlightList(flights.map(f => ({
          ...f,
          dynamicPricing: calculateDynamicPrice(f.price || 5500, {
            seatsAvailable: f.availableSeats || f.seatsAvailable || 20,
            isHolidaySeason: isHolidayPeak
          })
        })));
      });

    // Fetch live hotels from backend API
    fetch('/api/hotel')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setHotelList(data);
        } else {
          setHotelList(initialHotelsData);
        }
      })
      .catch(err => {
        console.log('Hotel fetch notice:', err.message);
        setHotelList(initialHotelsData);
      });
  }, [isHolidayPeak]);

  const defaultCityOptions = [
    { value: "Delhi", label: "Delhi" },
    { value: "Mumbai", label: "Mumbai" },
    { value: "Bengaluru", label: "Bengaluru" },
    { value: "Kolkata", label: "Kolkata" },
    { value: "Goa", label: "Goa" },
    { value: "Chennai", label: "Chennai" },
    { value: "Hyderabad", label: "Hyderabad" },
    { value: "Jaipur", label: "Jaipur" },
    { value: "Dubai", label: "Dubai" },
    { value: "London", label: "London" }
  ];

  const cityOptions = useMemo(() => {
    const cities = new Set();
    flightList.forEach((f) => {
      if (f.from) cities.add(f.from);
      if (f.to) cities.add(f.to);
    });
    hotelList.forEach((h) => {
      if (h.location) cities.add(h.location);
    });
    if (cities.size === 0) return defaultCityOptions;
    return Array.from(cities).map((city) => ({ value: city, label: city }));
  }, [flightList, hotelList]);

  const offers = [
    {
      title: "Domestic Flights",
      description: "Get up to 20% off on domestic flights",
      imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800",
    },
    {
      title: "International Hotels",
      description: "Book luxury hotels worldwide",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800",
    },
    {
      title: "Holiday Packages",
      description: "Exclusive deals on holiday packages",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800",
    },
  ];

  const collections = [
    {
      title: "Stays in & Around Delhi",
      imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800",
      tag: "TOP 8",
    },
    {
      title: "Stays in & Around Mumbai",
      imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800",
      tag: "TOP 8",
    },
    {
      title: "Stays in & Around Bangalore",
      imageUrl: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800",
      tag: "TOP 9",
    },
    {
      title: "Beach Destinations",
      imageUrl: "https://images.unsplash.com/photo-1520454974749-611b7248ffdb?auto=format&fit=crop&w=800",
      tag: "TOP 11",
    },
  ];

  const wonders = [
    {
      title: "Shimla's Best Kept Secret",
      imageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800",
    },
    {
      title: "Tamil Nadu's Charming Hill Town",
      imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800",
    },
    {
      title: "Quaint Little Hill Station in Gujarat",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800",
    },
    {
      title: "A pleasant summer retreat",
      imageUrl: "https://images.unsplash.com/photo-1593181629936-11c609b8db9b?auto=format&fit=crop&w=800",
    },
  ];

  const handlesearch = () => {
    if (bookingtype === "flights") {
      const results = flightList.filter(
        (f) =>
          (!from || f.from.toLowerCase().includes(from.toLowerCase())) &&
          (!to || f.to.toLowerCase().includes(to.toLowerCase()))
      );
      setsearchresults(results);
    } else if (bookingtype === "hotels") {
      if (to) {
        const results = hotelList.filter(
          (h) => h.location.toLowerCase().includes(to.toLowerCase())
        );
        setsearchresults(results);
      } else {
        // If no city is entered, show all hotels or prompt to enter city
        setsearchresults(hotelList);
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Blurred Background Image Layer */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          filter: 'blur(3px)',
          transform: 'scale(1.05)',
        }}
      />
      <main className="container mx-auto px-4 py-6">
        
        {/* Nav Categories Bar */}
        <nav className="bg-white rounded-xl shadow-lg mx-auto max-w-5xl mb-6 p-4 overflow-x-auto">
          <div className="flex justify-between items-center min-w-max space-x-8">
            <NavItem
              icon={<Plane />}
              text="Flights"
              active={bookingtype === "flights"}
              onClick={() => { setbookingtype("flights"); setsearchresults([]); }}
            />
            <NavItem
              icon={<Hotel />}
              text="Hotels"
              active={bookingtype === "hotels"}
              onClick={() => { setbookingtype("hotels"); setsearchresults([]); }}
            />
            <NavItem icon={<HomeIcon />} text="Homestays" />
            <NavItem icon={<Umbrella />} text="Holiday" />
            <NavItem icon={<Train />} text="Trains" />
            <NavItem icon={<Bus />} text="Buses" />
            <NavItem icon={<Car />} text="Cabs" />
            <NavItem icon={<CreditCard />} text="Forex" />
            <NavItem icon={<Shield />} text="Insurance" />
          </div>
        </nav>

        {/* Search Box Card with SearchSelect Dropdowns */}
        <div className="bg-white rounded-xl shadow-lg mx-auto max-w-5xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {bookingtype === "flights" && (
              <div className="col-span-1">
                <SearchSelect
                  options={cityOptions}
                  placeholder="From"
                  value={from}
                  onChange={setfrom}
                  icon={<MapPin className="text-gray-400" />}
                  subtitle="Enter city or airport"
                />
              </div>
            )}

            <div className="col-span-1">
              <SearchSelect
                options={cityOptions}
                placeholder={bookingtype === "flights" ? "To" : "City"}
                value={to}
                onChange={setto}
                icon={<MapPin className="text-gray-400" />}
                subtitle={
                  bookingtype === "flights"
                    ? "Enter city or airport"
                    : "Enter city"
                }
              />
            </div>

            <div className="col-span-1">
              <SearchInput
                icon={<Calendar className="text-gray-400" />}
                placeholder="Date"
                value={date}
                onChange={(e) => setdate(e.target.value)}
                subtitle="Select a date"
                type="date"
              />
            </div>

            <div className="col-span-1">
              <SearchInput
                icon={<Users className="text-gray-400" />}
                placeholder="Travelers"
                value={travelers.toString()}
                onChange={(e) => settravelers(parseInt(e.target.value) || 1)}
                subtitle="Number of travelers"
                type="number"
              />
            </div>

            <button 
              className="col-span-1 h-full bg-[#1a1a1a] hover:bg-black text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md text-sm tracking-wider"
              onClick={handlesearch}
            >
              SEARCH
            </button>
          </div>

          {/* Dynamic Pricing Engine Interactive Toggle Banner */}
          {bookingtype === "flights" && (
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-wrap items-center justify-between gap-4 border border-indigo-900/40 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-indigo-300 uppercase tracking-widest flex items-center gap-1.5">
                    <span>Dynamic Pricing Engine</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[10px] text-emerald-300 font-bold lowercase">real-time active</span>
                  </h4>
                  <p className="text-xs text-slate-300 font-semibold mt-0.5">
                    Automatic dynamic pricing factors in seat demand, seasonal peak periods, and proximity.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700">
                <span className="text-xs font-bold text-slate-200">Simulate Peak Holiday Surge (+20%)</span>
                <button
                  onClick={() => setIsHolidayPeak(!isHolidayPeak)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                    isHolidayPeak ? 'bg-rose-600 justify-end' : 'bg-slate-600 justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-md"></span>
                </button>
              </div>
            </div>
          )}

          {/* Search Results Display */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">
                {bookingtype === "flights" ? "Available Flights" : "Hotels"}
              </h2>
              {bookingtype === "flights" && (
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
                  Showing real-time dynamic fares with price graph & price freeze protection
                </span>
              )}
            </div>
            
            {bookingtype === "flights" ? (
              <div className="space-y-4">
                {(searchresults.length > 0 ? searchresults : flightList).map((flight) => (
                  <FlightCard
                    key={flight._id || flight.id || flight.flightName}
                    flight={flight}
                    onBookFlight={(f) => onBookFlight(f, travelers)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-4">
                {searchresults.length > 0 ? (
                  searchresults.map((result) => (
                    <div
                      key={result._id || result.id || result.hotelName}
                      className="bg-white rounded-xl shadow-sm p-5 border border-slate-200 w-full sm:w-72 flex flex-col justify-between hover:shadow-md transition-shadow"
                    >
                      <div>
                        <h3 className="font-extrabold text-lg text-slate-900 mb-1">{result.hotelName}</h3>
                        <p className="text-xs text-slate-500 font-medium mb-3">City: {result.location}</p>
                        <p className="text-base font-extrabold text-slate-900 mb-4">
                          ₹{Number(result.pricePerNight).toLocaleString("en-IN")} per night
                        </p>
                      </div>
                      <button
                        className="w-full bg-[#222222] hover:bg-black text-white font-bold py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
                        onClick={() => onBookFlight({ ...result, isHotel: true }, travelers)}
                      >
                        Book Now
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-sm py-8 w-full text-center">
                    Enter a city and click search to view available hotels.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content Sections container matching reference */}
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Personalized Recommendations Engine */}
          <RecommendationEngine user={user} />
          
          {/* Offers Section */}
          <section className="my-16">
            <h2 className="text-2xl font-bold mb-8 text-white">Best Offers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {offers.map((offer, index) => (
                <OfferCard key={index} {...offer} onBook={() => onBookFlight(flightList[0] || {}, 1)} />
              ))}
            </div>
          </section>

          {/* Collections Section */}
          <section className="my-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">
                Handpicked Collections for You
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {collections.map((collection, index) => (
                <CollectionCard key={index} {...collection} />
              ))}
            </div>
          </section>

          {/* Wonders Section */}
          <section className="my-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">
                Unlock Lesser-Known Wonders of India
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wonders.map((wonder, index) => (
                <WonderCard key={index} {...wonder} />
              ))}
            </div>
          </section>

          {/* Download App Section */}
          <DownloadApp />
        </div>

      </main>

      {/* Footer matching reference */}
      <Footer />
    </div>
  );
}

const OfferCard = ({ title, description, imageUrl, onBook }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col justify-between">
      <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-lg mb-2 text-slate-900">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
        <button 
          onClick={onBook}
          className="mt-4 w-full px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors shadow-sm"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

const CollectionCard = ({ title, imageUrl, tag }) => {
  return (
    <div className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80">
        <div className="absolute top-4 left-4">
          <span className="bg-white text-black text-xs font-bold px-2 py-1 rounded shadow-sm">
            {tag}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white text-lg font-semibold">{title}</h3>
        </div>
      </div>
    </div>
  );
};

const WonderCard = ({ title, imageUrl }) => {
  return (
    <div className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80">
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white text-lg font-semibold">{title}</h3>
        </div>
      </div>
    </div>
  );
};

const DownloadApp = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-7xl mx-auto my-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-bold mb-2 text-slate-900">Download App Now!</h3>
          <p className="text-gray-600 mb-4 text-sm">
            Get India's #1 travel super app with best deals on flights
          </p>
          <div className="flex space-x-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
              alt="App Store"
              className="h-10 cursor-pointer"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Play Store"
              className="h-10 cursor-pointer"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <QrCode className="w-24 h-24 text-slate-800" />
          <p className="text-sm text-gray-600 max-w-[150px]">
            Scan QR code to download the app
          </p>
        </div>
      </div>
    </div>
  );
};

function NavItem({ icon, text, active = false, onClick }) {
  return (
    <button
      className={`flex flex-col items-center p-2 rounded-lg transition-colors cursor-pointer ${
        active ? "text-blue-500 font-bold" : "text-gray-600 hover:text-blue-500"
      }`}
      onClick={onClick}
    >
      {icon}
      <span className="text-sm mt-1 whitespace-nowrap">{text}</span>
    </button>
  );
}

function SearchInput({
  icon,
  placeholder,
  value,
  onChange,
  subtitle,
  type = "text",
}) {
  return (
    <div className="border rounded-lg p-3 hover:border-blue-500 cursor-pointer h-full bg-white transition-colors">
      <div className="flex items-center space-x-2">
        {icon}
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-500 truncate font-medium">{placeholder}</div>
          <input
            type={type}
            value={value}
            onChange={onChange}
            className="font-bold text-slate-900 w-full bg-transparent outline-none text-sm"
            placeholder={placeholder}
          />
          <div className="text-xs text-gray-400 truncate">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}
