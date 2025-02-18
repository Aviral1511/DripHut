import express from 'express';
import { protect } from '../middlewares/authMiddleware.js'; 
import { addProduct , deleteProduct, getUserCart, mergeGuestCart, updateProduct} from '../controllers/cartController.js';

const router = express.Router();

router.post("/", addProduct);
router.put("/", updateProduct);
router.delete("/", deleteProduct);
router.get("/", getUserCart);
router.post("/merge", mergeGuestCart);

export default router;