import User from '../models/User.js';
import Flight from '../models/Flight.js';
import Hotel from '../models/Hotel.js';

// Book Flight Endpoint
export const bookFlight = async (req, res) => {
  try {
    const userId = req.body.userId || req.query.userId;
    const flightId = req.body.flightId || req.query.flightId;
    const seats = Number(req.body.seats || req.query.seats || 1);
    const price = Number(req.body.price || req.query.price || 0);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    if (flight.availableSeats < seats) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    // Deduct available seats
    flight.availableSeats -= seats;
    await flight.save();

    const bookingId = `MMT-FL-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking = {
      bookingId,
      type: 'flight',
      itemId: flightId,
      itemDetails: {
        title: flight.flightName,
        route: `${flight.from} → ${flight.to}`,
        date: req.body.date || new Date().toISOString().split('T')[0],
        time: `${flight.departureTime} - ${flight.arrivalTime}`,
        airline: flight.airline || flight.flightName
      },
      date: req.body.date || new Date().toISOString().split('T')[0],
      quantity: seats,
      totalPrice: price > 0 ? price : flight.price * seats,
      status: 'Paid',
      paymentMethod: req.body.paymentMethod || 'Credit Card ending 8812'
    };

    user.bookings.unshift(newBooking);
    await user.save();

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Book Hotel Endpoint
export const bookHotel = async (req, res) => {
  try {
    const userId = req.body.userId || req.query.userId;
    const hotelId = req.body.hotelId || req.query.hotelId;
    const rooms = Number(req.body.rooms || req.query.rooms || 1);
    const price = Number(req.body.price || req.query.price || 0);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    if (hotel.availableRooms < rooms) {
      return res.status(400).json({ message: 'Not enough rooms available' });
    }

    hotel.availableRooms -= rooms;
    await hotel.save();

    const bookingId = `MMT-HT-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking = {
      bookingId,
      type: 'hotel',
      itemId: hotelId,
      itemDetails: {
        title: hotel.hotelName,
        location: hotel.location,
        date: req.body.date || new Date().toISOString().split('T')[0],
        hotelName: hotel.hotelName
      },
      date: req.body.date || new Date().toISOString().split('T')[0],
      quantity: rooms,
      totalPrice: price > 0 ? price : hotel.pricePerNight * rooms,
      status: 'Paid',
      paymentMethod: req.body.paymentMethod || 'Credit Card ending 8812'
    };

    user.bookings.unshift(newBooking);
    await user.save();

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel Booking & Process Automated Refund
export const cancelBooking = async (req, res) => {
  try {
    const { userId, bookingId, reason, comments } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: 'Booking ID is required' });
    }

    // Find user by ID or search by bookingId if userId is generic/demo
    let user = null;
    if (userId && userId !== 'demo-user') {
      user = await User.findById(userId);
    }
    if (!user) {
      user = await User.findOne({ 'bookings.bookingId': bookingId });
    }

    if (!user) {
      return res.status(404).json({ message: 'User or booking record not found' });
    }

    const booking = user.bookings.find(b => b.bookingId === bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({ message: 'Booking has already been cancelled' });
    }

    // Calculate Automated Refund based on predefined policy
    const bookingTotal = booking.totalPrice || 5000;
    const createdAt = booking.createdAt ? new Date(booking.createdAt) : new Date();
    const now = new Date();
    const hoursSinceReservation = (now - createdAt) / (1000 * 60 * 60);

    let refundPercentage = 50; // Policy default: 50% within 24h reservation
    if (hoursSinceReservation > 24 && hoursSinceReservation <= 48) {
      refundPercentage = 75;
    } else if (hoursSinceReservation > 48) {
      refundPercentage = 85;
    }

    const refundAmount = Math.round((bookingTotal * refundPercentage) / 100);
    const cancellationFee = bookingTotal - refundAmount;

    // Expected refund completion timestamp (3 business days from now)
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() + 3);
    const expectedCompletionDate = expectedDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const refundTxnId = `RFD-${Math.floor(100000 + Math.random() * 900000)}`;

    booking.status = 'Cancelled';
    booking.cancellationDetails = {
      cancelledAt: now,
      reason: reason || 'Change of travel plans',
      comments: comments || '',
      refundAmount,
      refundPercentage,
      cancellationFee,
      refundStatus: 'Initiated',
      refundTxnId,
      expectedCompletionDate
    };

    await user.save();

    // Inventory Restoration: Release seats or rooms
    if (booking.type === 'flight' && booking.itemId) {
      try {
        const flight = await Flight.findById(booking.itemId);
        if (flight) {
          flight.availableSeats = (flight.availableSeats || 0) + (booking.quantity || 1);
          await flight.save();
        }
      } catch (e) {
        console.log('Flight inventory release notice:', e.message);
      }
    } else if (booking.type === 'hotel' && booking.itemId) {
      try {
        const hotel = await Hotel.findById(booking.itemId);
        if (hotel) {
          hotel.availableRooms = (hotel.availableRooms || 0) + (booking.quantity || 1);
          await hotel.save();
        }
      } catch (e) {
        console.log('Hotel inventory release notice:', e.message);
      }
    }

    res.json({
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Refund Status Tracker Endpoint
export const getRefundStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const user = await User.findOne({ 'bookings.bookingId': bookingId });
    if (!user) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const booking = user.bookings.find(b => b.bookingId === bookingId);
    if (!booking || !booking.cancellationDetails) {
      return res.status(404).json({ message: 'No active cancellation or refund details found for this booking' });
    }

    res.json({
      bookingId: booking.bookingId,
      type: booking.type,
      itemDetails: booking.itemDetails,
      totalPrice: booking.totalPrice,
      status: booking.status,
      cancellationDetails: booking.cancellationDetails
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

