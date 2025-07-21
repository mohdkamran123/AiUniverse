import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ToolCard from '../components/ToolCard';
import ToolFilterHeader from '../components/ToolFilterHeader';
import BASE_URL from '../api.js';
const ToolsPage = () => {
  const [tools, setTools] = useState([]);

  const fetchTools = async (filters = {}) => {
    let query = [];
    if (filters.search) query.push(`search=${filters.search}`);
    if (filters.category) query.push(`category=${filters.category}`);
    if (filters.priceType) query.push(`priceType=${filters.priceType}`);
    if (filters.isVerified !== null) query.push(`isVerified=${filters.isVerified}`);
    const finalURL = `${BASE_URL}/api/tools${query.length ? '?' + query.join('&') : ''}`;

    const res = await axios.get(finalURL);
    setTools(res.data);
  };

  useEffect(() => {
    fetchTools(); 
  }, []);

  return (
    <div>
      <ToolFilterHeader onFilterChange={fetchTools} />
      <div className="tools-grid">
        {tools.map(tool => (
          <ToolCard key={tool._id} tool={tool} />
        ))}
      </div>
    </div>
  );
};

export default ToolsPage;
