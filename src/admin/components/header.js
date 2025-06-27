import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';

// Helper to format date like "April 29th, 2025"
const formatDate = (date) => {
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  const getOrdinal = (n) => {
    if (n > 3 && n < 21) return 'th';
    switch (n % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return `${month} ${day}${getOrdinal(day)}, ${year}`;
};

const Header = ({ title }) => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Toggle dark mode class
    document.body.classList.toggle("dark-mode", darkMode);

    // Save theme preference to localStorage
    localStorage.setItem("theme", darkMode ? "dark" : "light");

    // Update the <meta name="theme-color">
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", darkMode ? "#000000" : "#ffffff");
    }
  }, [darkMode]);




  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error("Failed to enter fullscreen:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const formattedDate = formatDate(currentTime); // Custom formatted date
  const formattedTime = currentTime.toLocaleTimeString('en-GB'); // 24-hour format like "23:57:24"

  return (
    <div className="d-flex justify-content-between align-items-center position-relative px-3 py-2" style={{ width: '100%' }}>
      {/* Left: Title */}
      <h3 className="m-0 text-truncate" style={{ maxWidth: '250px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
        {title}
      </h3>


      {/* Center: Date and Time */}
      <div
        className="position-absolute top-50 start-50 translate-middle d-none d-md-block text-center px-2 py-1 rounded border-2"
        style={{ lineHeight: 1.1, minWidth: '130px' }}
      >
        <div className="small" style={{ fontSize: '0.9rem' }}>{formattedDate}</div>
        <div className="text-primary" style={{ fontSize: '0.9rem' }}>{formattedTime}</div>
      </div>

      {/* Right: Buttons */}
      <div className="d-flex align-items-center gap-2">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="btn btn-outline-secondary btn-sm p-2 d-flex align-items-center"
        >
          <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="btn btn-outline-secondary btn-sm p-2 d-flex align-items-center"
        >
          <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
        </button>

        {/* Account Dropdown */}
        <div className="nav-item dropdown btn btn-outline-secondary btn-sm">
          <span
            className="dropdown-toggle text-muted"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            aria-label="Account Menu"
          >
            <i className="fas fa-user text-primary me-2"></i>
            Account
          </span>

          <ul
            className="dropdown-menu dropdown-menu-dark"
            style={{ zIndex: 9999, position: 'relative' }}
          >
            <li><Link className="dropdown-item" to="/admin/">Dashboard</Link></li>
            <li><Link className="dropdown-item" to="/account/profile">Profile</Link></li>
            <li><Link className="dropdown-item" to="/account/settings">Settings</Link></li>
            <li><LogoutButton /></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
