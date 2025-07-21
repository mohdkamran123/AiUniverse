import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/ChatbotAuth.css';
import BASE_URL from '../api';
const Login = () => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    { from: 'bot', text: '👋 Welcome back! What is your email?' }
  ]);
  const [step, setStep] = useState(1);
  const [input, setInput] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextMessages = [...messages, { from: 'user', text: input }];
    setMessages(nextMessages);

    if (step === 1) {
      setFormData({ ...formData, email: input });
      setMessages([...nextMessages, { from: 'bot', text: '🔐 Please enter your password.' }]);
      setStep(2);
    } else if (step === 2) {
      try {
        const res = await axios.post(`${BASE_URL}/auth/login`, {
          email: formData.email,
          password: input
        });

        const { token, role } = res.data;

        localStorage.setItem('token', token);
        localStorage.setItem('role', role);

        setMessages([
          ...nextMessages,
          { from: 'bot', text: '✅ Login successful! Redirecting...' }
        ]);

        setTimeout(() => {
          if (role === 'admin') navigate('/admin-dashboard');
          else navigate('/home');
        }, 1500);
      } catch (err) {
        const msg = err.response?.data?.message || 'Login failed';
        setMessages([...nextMessages, { from: 'bot', text: '❌ ' + msg }]);
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

      {/* ✅ Register Link */}
      <div className="register-link">
        <p>Don’t have an account? <span onClick={() => navigate('/register')}>Register</span></p>
      </div>
    </div>
  );
};

export default Login;
