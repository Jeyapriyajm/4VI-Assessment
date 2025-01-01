import express from 'express';
import { submitRental, getUserRentals, updateRental, deleteRental } from '../controllers/rentalController.js';
import { authenticateToken } from '../services/authService.js';

const router = express.Router();

router.post('/', authenticateToken, submitRental); 

router.get('/', authenticateToken, getUserRentals);

router.put('/:id', authenticateToken, updateRental); 

router.delete('/:id', authenticateToken, deleteRental);

export default router;
