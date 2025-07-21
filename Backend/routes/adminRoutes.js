import express from 'express';
import {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser
} from '../controller/adminController.js';

import {
  getAllTools,
  createTool,
  updateTool,
  deleteTool,
  bulkAddTools
} from '../controller/toolController.js';

import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin stats and user management (existing)
router.get('/stats', protect, isAdmin, getAdminStats);
router.get('/users', protect, isAdmin, getAllUsers);
router.patch('/users/:id/role', protect, isAdmin, updateUserRole);
router.delete('/users/:id', protect, isAdmin, deleteUser);

// Admin tools management routes
router.get('/tools', protect, isAdmin, getAllTools);
router.post('/tools', protect, isAdmin, createTool);
router.patch('/tools/:id', protect, isAdmin, updateTool);
router.delete('/tools/:id', protect, isAdmin, deleteTool);
router.post('/bulk', protect,isAdmin,bulkAddTools);
export default router;
