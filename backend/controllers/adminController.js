import User from '../models/User.js';
import Flight from '../models/Flight.js';
import Hotel from '../models/Hotel.js';

// Get all users (Admin)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new flight (Admin)
export const addFlight = async (req, res) => {
  try {
    const newFlight = new Flight(req.body);
    await newFlight.save();
    res.status(201).json(newFlight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new hotel (Admin)
export const addHotel = async (req, res) => {
  try {
    const newHotel = new Hotel(req.body);
    await newHotel.save();
    res.status(201).json(newHotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit existing flight (Admin)
export const editFlight = async (req, res) => {
  try {
    const updatedFlight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedFlight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    res.json(updatedFlight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit existing hotel (Admin)
export const editHotel = async (req, res) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedHotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.json(updatedHotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
