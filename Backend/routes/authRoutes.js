import { protect } from '../middleware/authMiddleware.js';
import express from 'express'
import { registerUser,loginUser, sendRegisterOTP,verifyRegisterOTP } from '../controller/authController.js';

const router = express.Router();
router.get('/me', protect, (req, res) => {
  res.json({ message: 'Welcome!', user: req.user });
});

router.post('/register',registerUser);
router.post("/login",loginUser)
router.post('/send-otp', sendRegisterOTP);             // 🔐 Step 1
router.post('/verify-registration', verifyRegisterOTP)
export default router;