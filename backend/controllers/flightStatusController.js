// Mock API for Live Flight Status Updates

const mockStatuses = [
  {
    flightNumber: "6E-204",
    airline: "IndiGo",
    from: "Delhi (DEL)",
    to: "Mumbai (BOM)",
    status: "On Time",
    delayMinutes: 0,
    delayReason: null,
    gate: "Gate 4B",
    terminal: "Terminal 3",
    scheduledDeparture: "06:30 AM",
    revisedDeparture: "06:30 AM",
    scheduledArrival: "08:45 AM",
    revisedArrival: "08:45 AM",
    progressPercentage: 45,
    altitude: "32,000 ft",
    speed: "780 km/h",
    aircraft: "Airbus A320neo",
    lastUpdated: "Just now"
  },
  {
    flightNumber: "AI-502",
    airline: "Air India",
    from: "Mumbai (BOM)",
    to: "Bengaluru (BLR)",
    status: "Delayed",
    delayMinutes: 45,
    delayReason: "Adverse Weather & Heavy Rain in Mumbai Airspace",
    gate: "Gate 12A",
    terminal: "Terminal 2",
    scheduledDeparture: "11:15 AM",
    revisedDeparture: "12:00 PM",
    scheduledArrival: "01:00 PM",
    revisedArrival: "01:45 PM",
    progressPercentage: 15,
    altitude: "12,000 ft",
    speed: "540 km/h",
    aircraft: "Boeing 787 Dreamliner",
    lastUpdated: "2 mins ago"
  },
  {
    flightNumber: "UK-811",
    airline: "Vistara",
    from: "Bengaluru (BLR)",
    to: "Delhi (DEL)",
    status: "Boarding",
    delayMinutes: 0,
    delayReason: null,
    gate: "Gate 7C",
    terminal: "Terminal 2",
    scheduledDeparture: "02:30 PM",
    revisedDeparture: "02:30 PM",
    scheduledArrival: "05:15 PM",
    revisedArrival: "05:15 PM",
    progressPercentage: 5,
    altitude: "On Ground",
    speed: "0 km/h",
    aircraft: "Airbus A321neo",
    lastUpdated: "Just now"
  },
  {
    flightNumber: "SG-993",
    airline: "SpiceJet",
    from: "Delhi (DEL)",
    to: "Kolkata (CCU)",
    status: "Gate Changed",
    delayMinutes: 15,
    delayReason: "Late Arrival of Inbound Aircraft",
    gate: "Gate 18 (Changed from 14)",
    terminal: "Terminal 1D",
    scheduledDeparture: "08:10 PM",
    revisedDeparture: "08:25 PM",
    scheduledArrival: "10:30 PM",
    revisedArrival: "10:45 PM",
    progressPercentage: 0,
    altitude: "On Ground",
    speed: "0 km/h",
    aircraft: "Boeing 737 MAX",
    lastUpdated: "1 min ago"
  },
  {
    flightNumber: "EK-501",
    airline: "Emirates",
    from: "Mumbai (BOM)",
    to: "Dubai (DXB)",
    status: "In Flight",
    delayMinutes: 0,
    delayReason: null,
    gate: "Gate 1",
    terminal: "Terminal 2",
    scheduledDeparture: "04:00 PM",
    revisedDeparture: "04:00 PM",
    scheduledArrival: "06:15 PM",
    revisedArrival: "06:15 PM",
    progressPercentage: 75,
    altitude: "38,000 ft",
    speed: "890 km/h",
    aircraft: "Boeing 777-300ER",
    lastUpdated: "Just now"
  }
];

export const getLiveFlightStatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const match = mockStatuses.find(s => s.flightNumber.toLowerCase() === id.toLowerCase());
      if (match) return res.json(match);
    }
    res.json(mockStatuses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
