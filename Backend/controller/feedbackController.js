// ✅ controllers/feedbackController.js
import Feedback from '../model/Feedback.js';
import Tool from '../model/Tool.js';

// Add or update feedback
export const addFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const toolId = req.params.toolId;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const existing = await Feedback.findOne({ user: req.user._id, tool: toolId });

    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      await existing.save();
      return res.json({ message: 'Feedback updated', feedback: existing });
    }

    const feedback = await Feedback.create({
      user: req.user._id,
      tool: toolId,
      rating,
      comment
    });

    res.status(201).json({ message: 'Feedback added', feedback });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all feedback for a tool
export const getToolFeedback = async (req, res) => {
  try {
    const toolId = req.params.toolId;
    const feedbacks = await Feedback.find({ tool: toolId })
      .populate('user', 'name');
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete feedback (admin or user who posted)
export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });

    if (feedback.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this feedback' });
    }

    await feedback.remove();
    res.json({ message: 'Feedback deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get average rating for a tool
export const getAverageRating = async (req, res) => {
  try {
    const toolId = req.params.toolId;
    const stats = await Feedback.aggregate([
      { $match: { tool: new mongoose.Types.ObjectId(toolId) } },
      {        $group: {
          _id: '$tool',
          avgRating: { $avg: '$rating' },
          count: { $sum: 1 }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.json({ avgRating: 0, count: 0 });
    }

    res.json({ avgRating: stats[0].avgRating.toFixed(1), count: stats[0].count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
