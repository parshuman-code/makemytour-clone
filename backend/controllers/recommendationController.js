import User from '../models/User.js';
import Flight from '../models/Flight.js';
import Hotel from '../models/Hotel.js';
import RecommendationFeedback from '../models/RecommendationFeedback.js';

export const getRecommendations = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get irrelevant feedbacks
    const feedbacks = await RecommendationFeedback.find({ userId, feedback: 'irrelevant' });
    const irrelevantIds = feedbacks.map(f => f.itemId);

    // Fetch all items
    const allFlights = await Flight.find({});
    const allHotels = await Hotel.find({});

    let recommendations = [];
    
    // Simple heuristic: based on past bookings
    const pastLocations = user.bookings.map(b => 
      b.itemDetails?.route ? b.itemDetails.route.split(' to ')[1] : 
      b.itemDetails?.location ? b.itemDetails.location : null
    ).filter(Boolean);

    const beachDestinations = ['Goa', 'Bali', 'Maldives', 'Phuket', 'Andaman', 'Maldives'];
    const mountainDestinations = ['Shimla', 'Manali', 'Leh', 'Darjeeling', 'Srinagar'];
    const metroDestinations = ['Delhi', 'Mumbai', 'Bengaluru', 'Dubai', 'London'];

    let userPrefersBeach = false;
    let userPrefersMountains = false;
    let userPrefersMetro = false;

    pastLocations.forEach(loc => {
      const lowerLoc = loc.toLowerCase();
      if (beachDestinations.some(d => lowerLoc.includes(d.toLowerCase()))) userPrefersBeach = true;
      if (mountainDestinations.some(d => lowerLoc.includes(d.toLowerCase()))) userPrefersMountains = true;
      if (metroDestinations.some(d => lowerLoc.includes(d.toLowerCase()))) userPrefersMetro = true;
    });

    // Score flights
    for (const flight of allFlights) {
      if (irrelevantIds.includes(flight._id.toString())) continue;
      
      let score = 0;
      let reason = '';

      if (userPrefersBeach && beachDestinations.some(d => flight.to.toLowerCase().includes(d.toLowerCase()))) {
        score += 10;
        reason = `You liked beaches! Try a flight to ${flight.to}.`;
      } else if (userPrefersMountains && mountainDestinations.some(d => flight.to.toLowerCase().includes(d.toLowerCase()))) {
        score += 10;
        reason = `You like the mountains. Check out flights to ${flight.to}.`;
      } else if (userPrefersMetro && metroDestinations.some(d => flight.to.toLowerCase().includes(d.toLowerCase()))) {
        score += 5;
        reason = `Because you often visit major cities like ${flight.to}.`;
      }

      if (score > 0) {
        recommendations.push({ ...flight.toObject(), itemType: 'flight', score, reason });
      }
    }

    // Score hotels
    for (const hotel of allHotels) {
      if (irrelevantIds.includes(hotel._id.toString())) continue;
      
      let score = 0;
      let reason = '';

      if (userPrefersBeach && beachDestinations.some(d => hotel.location.toLowerCase().includes(d.toLowerCase()))) {
        score += 10;
        reason = `Because you love beaches, stay at ${hotel.hotelName} in ${hotel.location}.`;
      } else if (userPrefersMountains && mountainDestinations.some(d => hotel.location.toLowerCase().includes(d.toLowerCase()))) {
        score += 10;
        reason = `A great mountain retreat based on your past stays.`;
      } else if (userPrefersMetro && metroDestinations.some(d => hotel.location.toLowerCase().includes(d.toLowerCase()))) {
        score += 5;
        reason = `A highly-rated hotel in a major city you frequent.`;
      }

      if (score > 0) {
        recommendations.push({ ...hotel.toObject(), itemType: 'hotel', score, reason });
      }
    }

    // Default recommendations if no history matches
    if (recommendations.length === 0) {
       const randomHotel = allHotels.find(h => !irrelevantIds.includes(h._id.toString()));
       const randomFlight = allFlights.find(f => !irrelevantIds.includes(f._id.toString()));
       if (randomHotel) {
          recommendations.push({ ...randomHotel.toObject(), itemType: 'hotel', score: 1, reason: "Trending destination right now." });
       }
       if (randomFlight) {
          recommendations.push({ ...randomFlight.toObject(), itemType: 'flight', score: 1, reason: "Popular flight booked by many travelers this week." });
       }
    }

    recommendations.sort((a, b) => b.score - a.score);
    // Limit to top 4 recommendations
    res.json(recommendations.slice(0, 4));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitFeedback = async (req, res) => {
  try {
    const { userId, itemId, itemType, feedback } = req.body;
    if (!userId || !itemId || !itemType || !feedback) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await RecommendationFeedback.findOne({ userId, itemId });
    if (existing) {
      existing.feedback = feedback;
      await existing.save();
      return res.json(existing);
    }

    const newFeedback = new RecommendationFeedback({ userId, itemId, itemType, feedback });
    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
