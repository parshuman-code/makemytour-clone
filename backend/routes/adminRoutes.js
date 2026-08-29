import express from 'express';
import { getAllUsers, addFlight, addHotel, editFlight, editHotel } from '../controllers/adminController.js';

const router = express.Router();

router.get('/users', getAllUsers);
router.post('/flight', addFlight);
router.post('/hotel', addHotel);
router.put('/flight/:id', editFlight);
router.put('/hotel/:id', editHotel);

export default router;
