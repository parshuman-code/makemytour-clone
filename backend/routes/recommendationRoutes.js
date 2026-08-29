import express from 'express';
import { getRecommendations, submitFeedback } from '../controllers/recommendationController.js';

const router = express.Router();

router.get('/', getRecommendations);
router.post('/feedback', submitFeedback);

export default router;
