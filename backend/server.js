import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import userRoutes from './routes/userRoutes.js';
import flightRoutes from './routes/flightRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import { seedDatabase } from './seed.js';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/makemytrip';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.get('/', (req, res) => {
  res.json({ message: "✅ MakeMyTrip Full-Stack Express-MongoDB API is running!", port: PORT });
});

// Reference endpoint compatibility
app.get('/flight', async (req, res) => {
  try {
    const Flight = (await import('./models/Flight.js')).default;
    const flights = await Flight.find();
    res.json(flights);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/hotel', async (req, res) => {
  try {
    const Hotel = (await import('./models/Hotel.js')).default;
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/api/user', userRoutes);
app.use('/user', userRoutes);
app.use('/api/flight', flightRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/booking', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Database Connection & Server Start
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB database successfully!');
    await seedDatabase();
  })
  .catch((err) => {
    console.warn('⚠️ MongoDB connection warning:', err.message);
    console.log('💡 Starting server with active API routes...');
  });

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 MakeMyTrip Backend Server running on http://localhost:${PORT}`);
  });
}

export default app;
