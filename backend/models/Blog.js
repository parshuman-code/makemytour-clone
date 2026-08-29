import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  author: { type: String, default: 'MakeMyTour Editorial' },
  category: { type: String, enum: ['Travel Guide', 'Destination Tips', 'Announcements', 'Offers'], default: 'Travel Guide' },
  coverImage: { type: String, default: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  featured: { type: Boolean, default: false },
  publishedAt: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { timestamps: true });

export default mongoose.model('Blog', blogSchema);
