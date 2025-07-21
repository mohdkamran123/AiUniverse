import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/FilterHeader.css';
import BASE_URL from '../api.js';
const ToolFilterHeader = ({ onFilterChange }) => {
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceType, setPriceType] = useState('');
  const [isVerified, setIsVerified] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/tools/categories`)
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  const applyFilters = () => {
    onFilterChange({
      search,
      category: selectedCategory,
      priceType,
      isVerified
    });
  };

  return (
    <div className="header-container">
      <h1 className="main-heading">🧠 <span>AI Tools Directory</span></h1>
      {/* <p className="sub-heading">Access the largest list of top-quality AI tools available on the web ★</p> */}

      <div className="filter-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search over 5000+ AI tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
        />
        
        <select
          className="dropdown"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">-- Select a category --</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>

        <button className={`filter-btn ${isVerified ? 'active' : ''}`} onClick={() => setIsVerified(prev => prev === true ? null : true)}>
          ✅ Verified
        </button>

        {['Free', 'Freemium', 'Paid', 'Free Trial'].map((type) => (
          <button
            key={type}
            className={`filter-btn ${priceType === type ? 'active' : ''}`}
            onClick={() => setPriceType(prev => prev === type ? '' : type)}
          >
            {type}
          </button>
        ))}

        <button className="apply-btn" onClick={applyFilters}>🔍 Apply</button>
      </div>
    </div>
  );
};

export default ToolFilterHeader;
