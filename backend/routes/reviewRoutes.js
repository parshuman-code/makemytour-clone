import express from 'express';
import { getReviews, addReview, updateReview, getFlaggedReviews, deleteReview } from '../controllers/reviewController.js';

const router = express.Router();

router.get('/', getReviews);
router.post('/', addReview);
router.get('/flagged', getFlaggedReviews);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

export default router;
