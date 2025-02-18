import express from 'express';
import { protect, admin } from '../middlewares/authMiddleware.js';
import { deleteOrder, getAdminOrders, updateOrders } from '../controllers/adminOrderController.js';

const router = express.Router();
router.get('/', protect, admin, getAdminOrders);
router.put('/:id', protect, admin, updateOrders);
router.delete('/:id', protect, admin, deleteOrder);

export default router;