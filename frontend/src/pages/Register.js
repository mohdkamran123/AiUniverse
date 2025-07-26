import React, { useState } from 'react';
import axios from 'axios';
import '../css/ChatbotAuth.css';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../api';

const Register = () => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    { from: 'bot', text: '👋 Welcome! Let’s get you registered.' },
    { from: 'bot', text: 'What is your name?' }
  ]);
  const [step, setStep] = useState(1);
  const [input, setInput] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [otpData, setOtpData] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextMessages = [...messages, { from: 'user', text: input }];
    setMessages(nextMessages);

    if (step === 1) {
      setFormData({ ...formData, name: input });
      setMessages([...nextMessages, { from: 'bot', text: 'Great! Your email?' }]);
      setStep(2);
    } else if (step === 2) {
      setFormData({ ...formData, email: input });
      setMessages([...nextMessages, { from: 'bot', text: 'Cool! Now choose a password.' }]);
      setStep(3);
    } else if (step === 3) {
      const updated = { ...formData, password: input };
      setFormData(updated);
      try {
        const res = await axios.post(`${BASE_URL}/auth/send-otp`, updated);
        setOtpData(res.data.tempData);
        setMessages([...nextMessages, {
          from: 'bot',
          text: '📩 OTP sent to your email. Please enter the OTP.'
        }]);
        setStep(4);
      } catch (err) {
        const msg = err.response?.data?.message || 'Something went wrong';
        setMessages([...nextMessages, { from: 'bot', text: `❌ Error: ${msg}` }]);
      }
    } else if (step === 4) {
      try {
        const res = await axios.post(`${BASE_URL}/auth/verify-registration`, {
          ...formData,
          role: 'user',
          otp: input,
          originalOtp: otpData.otp,
          expiresAt: otpData.expiresAt
        });

        const { token, role } = res.data;

        localStorage.setItem('token', token);
        localStorage.setItem('role', role);

        setMessages([...nextMessages, {
          from: 'bot',
          text: '✅ Registration successful! Redirecting...'
        }]);

        setTimeout(() => {
          navigate('/home');
        }, 1500);
      } catch (err) {
        const msg = err.response?.data?.message || 'Invalid or expired OTP';
        setMessages([...nextMessages, { from: 'bot', text: `❌ ${msg}` }]);
      }
    }

    setInput('');
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-msg ${msg.from}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type here..."
          autoFocus
        />
        <button type="submit">➤</button>
      </form>

      {/* ✅ Login Redirect Link */}
      <div className="register-link">
        <p>Already have an account? <span onClick={() => navigate('/')}>Login</span></p>
      </div>
    </div>
  );
};

export default Register;
