import express from 'express';
import {protect, admin} from '../middlewares/authMiddleware.js';
import { bestSeller, createProduct, deleteProduct, getProducts, getSingleProduct, newArrivals, similarProducts, updateProduct} from '../controllers/productController.js';

const router = express.Router();

router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);
router.get("/",  getProducts);
router.get("/best-seller", bestSeller);
router.get("/new-arrivals", newArrivals);
router.get("/:id", getSingleProduct);
router.get("/similar/:id",  similarProducts);

export default router;