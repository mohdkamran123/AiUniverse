// ✅ ToolCard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/ToolCard.css';
import BASE_URL from '../api.js';
import {
  FaArrowUp,
  FaCheckCircle,
  FaExternalLinkAlt,
  FaBookmark,
  FaRegBookmark
} from 'react-icons/fa';

const ToolCard = ({ tool, index }) => {
  const [favorites, setFavorites] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const favIds = Array.isArray(res.data)
        ? res.data.map(fav => fav._id || fav.tool?._id)
        : [];

      setFavorites(favIds);
    } catch (err) {
      if (err.response?.status === 401) {
        console.warn('⚠️ Unauthorized: Please log in.');
      } else {
        console.error('Fetching favorites failed:', err);
      }
    }
  };

  const isFavorited = favorites.includes(tool._id);

  const toggleFavorite = async () => {
    if (!token) return alert('Please log in to use favorites.');

    try {
      if (isFavorited) {
        await axios.delete(`${BASE_URL}/favorites/${tool._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${BASE_URL}/favorites/${tool._id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchFavorites(); // Refresh favorites after toggle
    } catch (err) {
      const msg = err.response?.data?.message || 'Favorite update failed';
      alert(`❌ ${msg}`);
    }
  };

  return (
    <div className="tool-card-ui v2">
      {/* Rank */}
      <div className="rank-badge">{index + 1}</div>

      {/* Top right icons */}
      <div className="top-right">
        {tool.priceType && (
          <span className={`price-tag ${tool.priceType.toLowerCase().replace(' ', '-')}`}>
            {tool.priceType}
          </span>
        )}
        <div className="bookmark-icon" onClick={toggleFavorite}>
          {isFavorited ? (
            <FaBookmark title="Unfavorite" />
          ) : (
            <FaRegBookmark title="Add to favorites" />
          )}
        </div>
      </div>

      {/* Rating & Price */}
      <div className="rating-row">
        <div className="stars">★★★★★</div>
        <span className="price-type-text">{tool.priceType}</span>
      </div>

      {/* Logo + Title + Verified */}
      <div className="tool-header">
        <img
          src={process.env.PUBLIC_URL + '/' + tool.logo}
          className="logo"
          alt={tool.name}
          onError={(e) => (e.target.src = process.env.PUBLIC_URL + '/images/default.png')}
        />
        <div className="tool-title">
          <h3>{tool.name}</h3>
          {tool.isVerified && <FaCheckCircle className="verified" />}
          <div className="underline" />
        </div>
      </div>

      {/* Description */}
      <p className="desc">
        « {tool.description.length > 130 ? tool.description.slice(0, 130) + '...' : tool.description} »
      </p>

      {/* Tags */}
      <div className="tool-tags">
        {(tool.tags || []).slice(0, 2).map((tag, i) => (
          <span key={i} className="tag">#{tag}</span>
        ))}
        {tool.tags.length > 2 && <span className="tag">+{tool.tags.length - 2}</span>}
      </div>

      {/* Footer */}
      <div className="card-footer">
        <a href={tool.toolLink} target="_blank" rel="noreferrer" className="visit-btn">
          <FaExternalLinkAlt /> VISIT
        </a>
        <span className="clicks">
          <FaArrowUp /> {tool.clicks || 0}
        </span>
      </div>
    </div>
  );
};

export default ToolCard;
