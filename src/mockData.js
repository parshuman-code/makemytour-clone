export const initialFlightsData = [
  {
    id: "FL-202",
    airline: "SkyHigh Airlines",
    code: "SH-202",
    logo: "✈️",
    from: "Paris",
    to: "Tokyo",
    departureTime: "08:30 AM",
    arrivalTime: "11:45 PM",
    duration: "15h 15m",
    stops: "Non-stop",
    price: 850,
    seatsAvailable: 12,
    terminalDep: "Terminal 2E (CDG)",
    terminalArr: "Terminal 3 (NRT)",
    baggage: { cabin: "7 Kgs", checkIn: "25 Kgs" },
    cancellation: "Refundable (Cancellation fee applies up to 24 hrs before departure)",
    rating: 4.8
  },
  {
    id: "FL-305",
    airline: "Air Express",
    code: "AX-305",
    logo: "🌐",
    from: "New York",
    to: "London",
    departureTime: "06:15 PM",
    arrivalTime: "06:30 AM",
    duration: "7h 15m",
    stops: "Non-stop",
    price: 620,
    seatsAvailable: 8,
    terminalDep: "Terminal 4 (JFK)",
    terminalArr: "Terminal 5 (LHR)",
    baggage: { cabin: "7 Kgs", checkIn: "23 Kgs" },
    cancellation: "Flexible Cancellation - Free modification within 48h",
    rating: 4.6
  },
  {
    id: "FL-412",
    airline: "Oceanic Air",
    code: "OA-412",
    logo: "🌊",
    from: "Paris",
    to: "Bali_Indonesia",
    departureTime: "10:00 AM",
    arrivalTime: "07:20 AM",
    duration: "16h 20m",
    stops: "1 Stop (Doha)",
    price: 740,
    seatsAvailable: 5,
    terminalDep: "Terminal 1 (CDG)",
    terminalArr: "Terminal Int (DPS)",
    baggage: { cabin: "8 Kgs", checkIn: "30 Kgs" },
    cancellation: "Non-refundable promo fare",
    rating: 4.7
  },
  {
    id: "FL-508",
    airline: "Tokyo Wings",
    code: "TW-508",
    logo: "🌸",
    from: "Tokyo",
    to: "London",
    departureTime: "11:50 PM",
    arrivalTime: "05:40 AM",
    duration: "12h 50m",
    stops: "Non-stop",
    price: 990,
    seatsAvailable: 15,
    terminalDep: "Terminal 1 (HND)",
    terminalArr: "Terminal 2 (LHR)",
    baggage: { cabin: "10 Kgs", checkIn: "35 Kgs" },
    cancellation: "Full Refund up to 48 hours prior to flight departure",
    rating: 4.9
  },
  {
    id: "FL-119",
    airline: "Global Jet",
    code: "GJ-119",
    logo: "⚡",
    from: "Paris_France",
    to: "New York",
    departureTime: "01:20 PM",
    arrivalTime: "03:45 PM",
    duration: "8h 25m",
    stops: "Non-stop",
    price: 580,
    seatsAvailable: 20,
    terminalDep: "Terminal 2A (CDG)",
    terminalArr: "Terminal 7 (JFK)",
    baggage: { cabin: "7 Kgs", checkIn: "23 Kgs" },
    cancellation: "Refundable with fee",
    rating: 4.5
  }
];

export const bestOffersData = [
  {
    id: 1,
    category: "Domestic Flights",
    title: "Fly High with Flat 20% Off",
    subtitle: "Applicable on top domestic routes & airlines",
    code: "MMTCURE",
    discount: "20% OFF",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    category: "International Hotels",
    title: "Luxury Stays in Paris & Tokyo",
    subtitle: "Save up to $150 on premium resort stays",
    code: "SPECIALUPI",
    discount: "$150 OFF",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    category: "Holiday Packages",
    title: "Bali Tropical Escapes",
    subtitle: "Includes Flights + 5 Star Stay + Airport Transfers",
    code: "HOLIDAYFUN",
    discount: "FLAT $200 OFF",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80"
  }
];

export const userProfileData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 019-2834",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  membership: "MakeMyTour Preferred Gold",
  bookings: [
    {
      bookingId: "MMT-889342",
      flightCode: "SH-202",
      airline: "SkyHigh Airlines",
      route: "Paris (CDG) → Tokyo (NRT)",
      date: "2026-09-15",
      passengers: 2,
      totalAmount: "$1,700",
      status: "Paid",
      paymentMethod: "Credit Card ending 4242"
    },
    {
      bookingId: "MMT-772109",
      flightCode: "AX-305",
      airline: "Air Express",
      route: "New York (JFK) → London (LHR)",
      date: "2026-08-10",
      passengers: 1,
      totalAmount: "$620",
      status: "Paid",
      paymentMethod: "UPI / Net Banking"
    }
  ]
};

export const initialHotelsData = [
  {
    _id: '1',
    hotelName: 'Seaside Resort',
    location: 'Bali, Indonesia',
    pricePerNight: 6000,
    availableRooms: 17,
    amenities: ['Beach Access', 'Wi-Fi', 'Restaurant', 'Water Sports', 'Swimming Pool', 'Bar', 'Power Backup'],
    rating: 3.8,
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80'
  }
];
