import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Navbar.css';
import { FaBookmark, FaGlobe, FaMoon, FaSun } from 'react-icons/fa';

const Nav = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-theme', !darkMode);
  };

  return (
    <nav className="custom-navbar">
      <div className="navbar-left">
        <img src="/logo.png" alt="Logo" className="navbar-logo" />
      </div>

      <div className="navbar-center">
         <Link to="/register" className="nav-link">Register</Link>
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/tools" className="nav-link"><FaBookmark /> Full List</Link>
        {/* <Link to="/categories" className="nav-link">AI Categories</Link> */}
        <Link to="/tutorials" className="nav-link">AI Tutorials</Link>
        <Link to="/more" className="nav-link">+ More</Link>
        <Link to="/run-ai" className='nav-link'>AI</Link>
      </div>

      <div className="navbar-right">
        <FaGlobe className="lang-icon" title="Translate" />
        <div className="theme-toggle" onClick={toggleTheme}>
          <div className={`toggle-thumb ${darkMode ? 'dark' : ''}`}>
            {darkMode ? <FaMoon /> : <FaSun />}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
