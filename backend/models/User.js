import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true },
  type: { type: String, enum: ['flight', 'hotel'], default: 'flight' },
  itemId: { type: String },
  itemDetails: {
    title: String,
    route: String,
    date: String,
    time: String,
    airline: String,
    hotelName: String,
    location: String
  },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  quantity: { type: Number, default: 1 },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['Confirmed', 'Paid', 'Cancelled'], default: 'Paid' },
  paymentMethod: { type: String, default: 'Credit Card / UPI' },
  cancellationDetails: {
    cancelledAt: { type: Date },
    reason: { type: String },
    comments: { type: String },
    refundAmount: { type: Number, default: 0 },
    refundPercentage: { type: Number, default: 0 },
    cancellationFee: { type: Number, default: 0 },
    refundStatus: { type: String, enum: ['Initiated', 'Processing', 'Completed'], default: 'Initiated' },
    refundTxnId: { type: String },
    expectedCompletionDate: { type: String }
  }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  phoneNumber: { type: String, default: '+91 9876543210' },
  profilePic: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
  bookings: [bookingSchema]
}, { timestamps: true });

export default mongoose.model('User', userSchema);
