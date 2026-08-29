import express from 'express';
import { bookFlight, bookHotel, cancelBooking, getRefundStatus } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/flight', bookFlight);
router.post('/hotel', bookHotel);
router.post('/cancel', cancelBooking);
router.get('/refund-status/:bookingId', getRefundStatus);

export default router;
