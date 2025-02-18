import express from 'express';
import { handleSubscriber } from '../controllers/subscriberController.js';

const router = express.Router();

router.post('/subscribe', handleSubscriber);

export default router;