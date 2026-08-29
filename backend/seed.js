import mongoose from 'mongoose';
import Flight from './models/Flight.js';
import Hotel from './models/Hotel.js';
import User from './models/User.js';
import Review from './models/Review.js';
import Blog from './models/Blog.js';

const initialFlights = [
  {
    flightName: "IndiGo 6E-204",
    airline: "IndiGo",
    flightNumber: "6E-204",
    from: "Delhi",
    to: "Mumbai",
    departureTime: "06:30 AM",
    arrivalTime: "08:45 AM",
    price: 5500,
    availableSeats: 45,
    duration: "2h 15m",
    stops: "Non-stop",
    logo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=120&q=80",
    rating: 4.8,
    classType: "Economy"
  },
  {
    flightName: "Air India AI-502",
    airline: "Air India",
    flightNumber: "AI-502",
    from: "Mumbai",
    to: "Bengaluru",
    departureTime: "11:15 AM",
    arrivalTime: "01:00 PM",
    price: 4800,
    availableSeats: 22,
    duration: "1h 45m",
    stops: "Non-stop",
    logo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=120&q=80",
    rating: 4.6,
    classType: "Economy"
  },
  {
    flightName: "Vistara UK-811",
    airline: "Vistara",
    flightNumber: "UK-811",
    from: "Bengaluru",
    to: "Delhi",
    departureTime: "02:30 PM",
    arrivalTime: "05:15 PM",
    price: 6200,
    availableSeats: 38,
    duration: "2h 45m",
    stops: "Non-stop",
    logo: "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=120&q=80",
    rating: 4.9,
    classType: "Premium Economy"
  },
  {
    flightName: "SpiceJet SG-993",
    airline: "SpiceJet",
    flightNumber: "SG-993",
    from: "Delhi",
    to: "Kolkata",
    departureTime: "08:10 PM",
    arrivalTime: "10:30 PM",
    price: 4200,
    availableSeats: 15,
    duration: "2h 20m",
    stops: "Non-stop",
    logo: "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=120&q=80",
    rating: 4.4,
    classType: "Economy"
  },
  {
    flightName: "Emirates EK-501",
    airline: "Emirates",
    flightNumber: "EK-501",
    from: "Mumbai",
    to: "Dubai",
    departureTime: "04:00 PM",
    arrivalTime: "06:15 PM",
    price: 18500,
    availableSeats: 12,
    duration: "3h 45m",
    stops: "Non-stop",
    logo: "https://images.unsplash.com/photo-1519074069444-1ba4fff16be3?auto=format&fit=crop&w=120&q=80",
    rating: 4.9,
    classType: "Business"
  }
];

const initialHotels = [
  {
    hotelName: "Seaside Resort",
    location: "Bali, Indonesia",
    availableRooms: 17,
    pricePerNight: 6000,
    amenities: ["Beach Access", "Wi-Fi", "Restaurant", "Water Sports", "Swimming Pool", "Bar", "Power Backup"],
    rating: 3.8,
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80"
  },
  {
    hotelName: "Luxury Palace Hotel",
    location: "Mumbai",
    availableRooms: 18,
    pricePerNight: 15000,
    amenities: ["Free WiFi", "Infinity Pool", "Spa & Wellness", "Luxury Lounge"],
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
  },
  {
    hotelName: "Comfort Inn & Suites",
    location: "Delhi",
    availableRooms: 25,
    pricePerNight: 8000,
    amenities: ["Free Breakfast", "Airport Shuttle", "Fitness Center"],
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"
  },
  {
    hotelName: "Seaside Resort Goa",
    location: "Goa",
    availableRooms: 12,
    pricePerNight: 12000,
    amenities: ["Beach Access", "Swimming Pool", "Seafood Restaurant"],
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1520454974749-611b7248ffdb?auto=format&fit=crop&w=800&q=80"
  }
];

const initialBlogs = [
  {
    title: "10 Hidden Gems in Himachal Pradesh to Visit This Summer",
    slug: "hidden-gems-himachal-pradesh",
    content: "Discover offbeat valleys, tranquil pine forests, and charming hill villages away from the crowded tourist trails.",
    author: "MakeMyTour Travel Team",
    category: "Travel Guide",
    coverImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
    featured: true,
    publishedAt: "2026-08-20"
  },
  {
    title: "Top Luxury Beach Resorts in Goa for a Relaxing Getaway",
    slug: "luxury-beach-resorts-goa",
    content: "Explore 5-star beachfront properties with private cabanas, sunset lounges, and authentic Goan seafood dining.",
    author: "Ananya Roy",
    category: "Destination Tips",
    coverImage: "https://images.unsplash.com/photo-1520454974749-611b7248ffdb?auto=format&fit=crop&w=800&q=80",
    featured: false,
    publishedAt: "2026-08-22"
  }
];

export const seedDatabase = async () => {
  try {
    const flightCount = await Flight.countDocuments();
    if (flightCount === 0) await Flight.insertMany(initialFlights);

    // Upsert Seaside Resort in Bali, Indonesia if missing
    const seasideExists = await Hotel.findOne({ hotelName: "Seaside Resort" });
    if (!seasideExists) {
      await Hotel.create(initialHotels[0]);
    }

    const hotelCount = await Hotel.countDocuments();
    if (hotelCount === 0) await Hotel.insertMany(initialHotels);

    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) await Blog.insertMany(initialBlogs);

    console.log('✅ Seeded initial database content');
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};
