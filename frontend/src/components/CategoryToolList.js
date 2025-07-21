import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/CategoryToolList.css';
import BASE_URL from '../api.js';
const CategoryToolList = () => {
    const [groupedTools, setGroupedTools] = useState({});

    useEffect(() => {
        fetchAllTools();
    }, []);

    const fetchAllTools = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/tools`);
            groupByCategory(res.data);
        } catch (err) {
            console.error('Tool fetch error:', err);
        }
    };

    const groupByCategory = (tools) => {
        const grouped = {};
        tools.forEach(tool => {
            const category = tool.category || 'Other';
            if (!grouped[category]) grouped[category] = [];
            grouped[category].push(tool);
        });
        setGroupedTools(grouped);
    };

    // 🔥 render
    return (
        <div className="category-wrapper">
            <div className="scroll-container">
                {Object.entries(groupedTools).map(([category, tools]) => (
                    <div key={category} className="category-card">
                        <div className="category-header">{category}</div>
                        <ul className="tool-name-list">
                            {tools.map((tool, index) => (
                                <li key={tool._id || index}>
                                    <span className="tool-number">{index + 1}.</span>
                                    <a href={tool.toolLink} target="_blank" rel="noreferrer">
                                        <img
                                            src={process.env.PUBLIC_URL + '/' + tool.logo}
                                            alt="logo"
                                            onError={(e) => (e.target.src = process.env.PUBLIC_URL + '/images/default.png')}
                                        />
                                        {tool.name}
                                    </a>
                                </li>
                            ))}

                        </ul>
                        <div className="category-footer">
                            See all category ({tools.length}) →
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryToolList;
