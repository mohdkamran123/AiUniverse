import jwt from 'jsonwebtoken';
import User from '../model/User.js';
import { sendOTPEmail } from '../utils/mailer.js';

// ✅ Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// ✅ Standard Login (No OTP)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user);

    res.status(200).json({
      message: 'Login successful',
      token,
      userId: user._id,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ✅ Traditional Register Controller (No OTP)
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user'
    });

    const token = generateToken(user);

    res.status(201).json({
      message: 'Registered successfully',
      token,
      userId: user._id,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

///////////////////////////////////////////////////////////////////////////////////////////
// ✅ STEP 1: Send OTP during Registration
export const sendRegisterOTP = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    // Send OTP to email
    await sendOTPEmail(email, otp);

    // ⚠️ In production, store temp user & OTP in Redis or DB (not in client)
    res.status(200).json({
      message: 'OTP sent to email',
      tempData: { name, email, password, otp, expiresAt } // for demo purposes only
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

///////////////////////////////////////////////////////////////////////////////////////////
// ✅ STEP 2: Verify OTP and Create User
export const verifyRegisterOTP = async (req, res) => {
  try {
    const { name, email, password, otp, originalOtp, expiresAt, role } = req.body;

    if (!originalOtp || !otp)
      return res.status(400).json({ message: 'OTP missing' });

    if (String(otp) !== String(originalOtp))
      return res.status(400).json({ message: 'Invalid OTP' });

    if (new Date() > new Date(expiresAt))
      return res.status(400).json({ message: 'OTP expired' });

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user'
    });

    const token = generateToken(user);

    res.status(201).json({
      message: 'Registered successfully',
      token,
      userId: user._id,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
