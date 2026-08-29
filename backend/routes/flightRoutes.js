import express from 'express';
import { getAllFlights, searchFlights, getFlightById, getFlightPriceHistory } from '../controllers/flightController.js';
import { getLiveFlightStatus } from '../controllers/flightStatusController.js';

const router = express.Router();

router.get('/', getAllFlights);
router.get('/status', getLiveFlightStatus);
router.get('/status/:id', getLiveFlightStatus);
router.get('/search', searchFlights);
router.get('/price-history/:id', getFlightPriceHistory);
router.get('/:id', getFlightById);

export default router;
