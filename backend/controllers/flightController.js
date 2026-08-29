import Flight from '../models/Flight.js';
import { calculateDynamicPrice, generatePriceHistory } from '../utils/pricingEngine.js';

// Get all flights with dynamic pricing details
export const getAllFlights = async (req, res) => {
  try {
    const { holidayPeak } = req.query;
    const isHolidaySeason = holidayPeak === 'true';

    const rawFlights = await Flight.find();

    const flights = rawFlights.map(flightDoc => {
      const flight = flightDoc.toObject();
      const dynamic = calculateDynamicPrice(flight.price, {
        seatsAvailable: flight.availableSeats || flight.seatsAvailable || 30,
        totalSeats: 60,
        isHolidaySeason
      });

      return {
        ...flight,
        basePrice: flight.price,
        price: dynamic.finalPrice,
        dynamicPricing: dynamic
      };
    });

    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search flights with origin, destination, date, passengers & dynamic pricing
export const searchFlights = async (req, res) => {
  try {
    const { from, to, minPrice, maxPrice, airline, holidayPeak } = req.query;
    let query = {};

    if (from && from !== 'ALL') {
      query.from = new RegExp(from, 'i');
    }
    if (to && to !== 'ALL') {
      query.to = new RegExp(to, 'i');
    }
    if (airline && airline !== 'ALL') {
      query.airline = new RegExp(airline, 'i');
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const rawFlights = await Flight.find(query);
    const isHolidaySeason = holidayPeak === 'true';

    const flights = rawFlights.map(flightDoc => {
      const flight = flightDoc.toObject();
      const dynamic = calculateDynamicPrice(flight.price, {
        seatsAvailable: flight.availableSeats || flight.seatsAvailable || 30,
        totalSeats: 60,
        isHolidaySeason
      });

      return {
        ...flight,
        basePrice: flight.price,
        price: dynamic.finalPrice,
        dynamicPricing: dynamic
      };
    });

    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single flight by ID with dynamic pricing
export const getFlightById = async (req, res) => {
  try {
    const { holidayPeak } = req.query;
    const flightDoc = await Flight.findById(req.params.id);
    if (!flightDoc) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    const flight = flightDoc.toObject();
    const dynamic = calculateDynamicPrice(flight.price, {
      seatsAvailable: flight.availableSeats || flight.seatsAvailable || 30,
      totalSeats: 60,
      isHolidaySeason: holidayPeak === 'true'
    });

    res.json({
      ...flight,
      basePrice: flight.price,
      price: dynamic.finalPrice,
      dynamicPricing: dynamic
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get flight price history graph data
export const getFlightPriceHistory = async (req, res) => {
  try {
    const { id } = req.params;
    let basePrice = 5000;
    
    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      const flightDoc = await Flight.findById(id);
      if (flightDoc) basePrice = flightDoc.price;
    }

    const historyData = generatePriceHistory(id, basePrice);
    res.json(historyData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

