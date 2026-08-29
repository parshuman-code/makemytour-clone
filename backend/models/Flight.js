import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
  flightName: { type: String, required: true },
  airline: { type: String, required: true },
  flightNumber: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  price: { type: Number, required: true },
  availableSeats: { type: Number, required: true, default: 60 },
  duration: { type: String, default: '2h 15m' },
  stops: { type: String, default: 'Non-stop' },
  logo: { type: String },
  rating: { type: Number, default: 4.8 },
  classType: { type: String, default: 'Economy' }
}, { timestamps: true });

export default mongoose.model('Flight', flightSchema);
