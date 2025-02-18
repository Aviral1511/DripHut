import express from 'express';
import { protect } from '../middlewares/authMiddleware.js'; 
import { getMyOrders, getOrderDetails } from '../controllers/orderController.js';

const router = express.Router();

router.get("/my-orders", protect, getMyOrders);
router.get(":id", protect, getOrderDetails);

export default router;