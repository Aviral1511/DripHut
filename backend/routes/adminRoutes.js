import express from 'express';
import { protect, admin } from '../middlewares/authMiddleware.js';
import { addAdmin, deleteUser, getAllAdmins, updateUser } from '../controllers/adminController.js';

const router = express.Router();

router.get("/", protect, admin, getAllAdmins);
router.post("/", protect, admin, addAdmin);
router.put("/:id", protect, admin, updateUser);
router.delete("/:id", protect, admin, deleteUser);

export default router;