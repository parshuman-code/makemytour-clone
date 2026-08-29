import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  hotelName: { type: String, required: true },
  location: { type: String, required: true },
  availableRooms: { type: Number, required: true, default: 20 },
  pricePerNight: { type: Number, required: true },
  amenities: [{ type: String }],
  rating: { type: Number, default: 4.5 },
  image: { type: String }
}, { timestamps: true });

export default mongoose.model('Hotel', hotelSchema);
