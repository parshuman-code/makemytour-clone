import Review from '../models/Review.js';

// Get reviews by target ID (flightId or hotelId)
export const getReviews = async (req, res) => {
  try {
    const { targetId } = req.query;
    let query = {};
    if (targetId) query.targetId = targetId;

    const reviews = await Review.find(query).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new review
export const addReview = async (req, res) => {
  try {
    const { targetId, targetType, userName, userAvatar, rating, comment, photos } = req.body;
    const newReview = new Review({
      targetId,
      targetType: targetType || 'flight',
      userName,
      userAvatar: userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      rating,
      comment,
      photos: photos || [],
      date: new Date().toISOString().split('T')[0]
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update review (helpful, flag, reply, dismiss flag)
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, reply } = req.body;

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (action === 'helpful') {
      review.helpfulCount = (review.helpfulCount || 0) + 1;
    } else if (action === 'flag') {
      review.flags = (review.flags || 0) + 1;
      if (review.flags >= 1) review.isFlagged = true;
    } else if (action === 'dismiss_flag') {
      review.flags = 0;
      review.isFlagged = false;
    } else if (action === 'reply' && reply) {
      review.replies.push(reply);
    }

    await review.save();
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get flagged reviews for admin
export const getFlaggedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isFlagged: true }).sort({ flags: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete review (Admin)
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
