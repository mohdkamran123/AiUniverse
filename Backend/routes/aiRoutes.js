import express from 'express';
import { runToolAI } from '../controller/ai.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// User must be logged in
router.post('/run', protect, runToolAI);

export default router;
