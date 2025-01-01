import express from 'express';
import { register, userLogin } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', register);
router.post('/login', userLogin);

export default router;
