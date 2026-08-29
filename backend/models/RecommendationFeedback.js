import mongoose from 'mongoose';

const recommendationFeedbackSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  itemId: { type: String, required: true },
  itemType: { type: String, enum: ['flight', 'hotel'], required: true },
  feedback: { type: String, enum: ['helpful', 'irrelevant'], required: true }
}, { timestamps: true });

export default mongoose.model('RecommendationFeedback', recommendationFeedbackSchema);
