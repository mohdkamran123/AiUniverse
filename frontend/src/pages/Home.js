import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ToolCard from '../components/ToolCard';
import '../css/Home.css';
import CategoryToolList from '../components/CategoryToolList';
import Nav from '../components/Nav';
import BASE_URL from '../api';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    priceType: '',
    isVerified: null
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchTools();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/tools/categories`);
      setCategories(res.data);
    } catch (error) {
      console.error('Category fetch error:', error);
    }
  };

  const fetchTools = async () => {
    const query = [];
    if (filters.search) query.push(`search=${filters.search}`);
    if (filters.category) query.push(`category=${filters.category}`);
    if (filters.priceType) query.push(`priceType=${filters.priceType}`);
    if (filters.isVerified !== null) query.push(`isVerified=${filters.isVerified}`);
    const res = await axios.get(`${BASE_URL}/tools${query.length ? '?' + query.join('&') : ''}`);
    setTools(res.data);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') fetchTools();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="home">
      

      
      {localStorage.getItem('token') && (
        <div className="logout-container">
          <button className="logout-button" onClick={handleLogout}>
            🔓 Logout
          </button>
        </div>
      )}

      <div className="hero-section">
        <h1>🤖 <span className="highlight">AI Tools Directory</span></h1>
        <p>Access the largest list of top-quality AI tools available on the web ★</p>

        <div className="filters">
          <input
            type="text"
            placeholder="Search over 5000+ AI tools..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            onKeyDown={handleSearch}
          />

          <select
            value={filters.category}
            onChange={(e) => {
              setFilters({ ...filters, category: e.target.value });
              fetchTools();
            }}
          >
            <option value="">-- Select a category --</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>

          <button
            className={filters.isVerified ? 'active' : ''}
            onClick={() => {
              setFilters({ ...filters, isVerified: filters.isVerified ? null : true });
              fetchTools();
            }}
          >
            ✅ Verified
          </button>

          {['Free', 'Freemium', 'Paid', 'Free Trial'].map(type => (
            <button
              key={type}
              className={filters.priceType === type ? 'active' : ''}
              onClick={() => {
                setFilters({ ...filters, priceType: filters.priceType === type ? '' : type });
                fetchTools();
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="tool-card-grid">
        {tools.map(tool => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      <CategoryToolList />
    </div>
  );
};

export default Home;
