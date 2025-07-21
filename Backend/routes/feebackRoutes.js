// ✅ routes/feedbackRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  addFeedback,
  getToolFeedback,
  deleteFeedback,
  getAverageRating
} from '../controller/feedbackController.js';

const router = express.Router();

// Add/update feedback
router.post('/:toolId', protect, addFeedback);

// Get all feedback for a tool
router.get('/:toolId', getToolFeedback);

// Get average rating of a tool
router.get('/:toolId/average', getAverageRating);

// Delete feedback
router.delete('/:id', protect, deleteFeedback);

export default router;
