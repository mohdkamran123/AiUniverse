import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import connectDB from './config/db.js';
import toolRoutes from './routes/toolRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import feedbackRoutes from './routes/feebackRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

// Middlewares
app.use(cors({
  origin: 'http://localhost:3001', // Your React app
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use("/tools", toolRoutes);
app.use('/admin', adminRoutes);
app.use('/ai', aiRoutes);
app.use('/feedback', feedbackRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('AI Universe Backend API is running...');
});
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});

