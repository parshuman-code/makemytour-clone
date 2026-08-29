import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  targetId: { type: String, required: true }, // flightId or hotelId
  targetType: { type: String, enum: ['flight', 'hotel'], default: 'flight' },
  userName: { type: String, required: true },
  userAvatar: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  photos: [{ type: String }],
  helpfulCount: { type: Number, default: 0 },
  flags: { type: Number, default: 0 },
  isFlagged: { type: Boolean, default: false },
  replies: [{
    userName: String,
    text: String,
    date: { type: String, default: () => new Date().toISOString().split('T')[0] }
  }],
  date: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);
