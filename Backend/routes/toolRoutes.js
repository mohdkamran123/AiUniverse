// ✅ routes/toolRoutes.js
import express from 'express';
import {
  createTool,
  getAllTools,
  getToolById,
  updateTool,
  deleteTool,
  bulkAddTools,
  deleteAllTools,
  getUniqueCategories,
  getLatestTools,
  getPopularTools,
  getEditorsPick,
  getSuperTools,
  getToolsByTag,
  updateToolTags,
  getMostClickedTools,
  incrementClickCount
} from '../controller/toolController.js';
import { protect, } from '../middleware/authMiddleware.js';

const router = express.Router();

// 🔓 PUBLIC ROUTES
router.get('/', getAllTools);
router.get('/categories', getUniqueCategories);
router.get('/tags/:tag', getToolsByTag);
router.get('/latest', getLatestTools);
router.get('/popular', getPopularTools);
router.get('/editors-pick', getEditorsPick);
router.get('/supertools', getSuperTools);
router.get('/tag/mostclicked', getMostClickedTools);
router.patch('/:id/click', incrementClickCount);

// 🔐 PROTECTED ROUTES
router.post('/', protect, createTool);
router.get('/:id', protect, getToolById);
router.put('/:id', protect, updateTool);
router.delete('/:id', protect, deleteTool);
router.post('/bulk', protect,  bulkAddTools);
router.delete('/deleteall', protect, deleteAllTools);
router.patch('/:id/tags', protect, updateToolTags);

export default router;
