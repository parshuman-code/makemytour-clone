import express from 'express';
import { loginUser, signupUser, getUserByEmail, editUserProfile } from '../controllers/userController.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/signup', signupUser);
router.get('/email', getUserByEmail);
router.post('/edit', editUserProfile);
router.put('/edit/:id', editUserProfile);

export default router;
