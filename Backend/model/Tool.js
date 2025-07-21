import mongoose from 'mongoose';

const toolSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  logo: { type: String },
  category: { type: String, required: true },
  description: { type: String },
  
  priceType: {
    type: String,
    enum: ['Free', 'Freemium', 'Paid', 'Free Trial'],
    required: true
  },

  clicks: { type: Number, default: 0 },

  toolLink: { type: String, required: true },

  // 🔖 Tags for Featured Tabs
  tags: {
    type: [String],
    enum: ['EditorsPick', 'SuperTool', 'Trending', 'Recommended'],
    default: []
  },

  isVerified: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },

  // 🔌 For AI execution
  toolType: { type: String, default: 'text-gen' },
  integrationType: { type: String },  // gemini, openai, groq, etc.
  apiURL: { type: String },
  apiKey: { type: String },
  model: { type: String }
});

const Tool = mongoose.model('Tool', toolSchema);
export default Tool;
