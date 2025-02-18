import express from 'express';
import { protect } from '../middlewares/authMiddleware.js'; 
import { create, finalize, updatePaid } from '../controllers/checkoutController.js';

const router = express.Router();

router.post('/', protect, create);
router.put('/:id/pay', protect, updatePaid);
router.post('/:id/finalize', protect, finalize);


export default router;