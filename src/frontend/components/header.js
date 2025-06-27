import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/header.css'; // We'll style the header separately
import logo from '../../assets/images/logoo.jpg';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Info Bar */}
<div className="top-bar bg-dark text-white p-3">
  <div className="container">
    {/* Desktop layout (hidden on mobile) */}
    <div className="d-none d-md-flex justify-content-between align-items-center small">
      <div className="d-flex align-items-center gap-3">
        <div className="d-flex align-items-center">
          <i className="fas fa-map-marker-alt me-2"></i>
          <span> 135 Musgrave Road, Durban, South Africa</span>
        </div>
        <div className="d-flex align-items-center">
          <i className="fas fa-clock me-2"></i>
          <span>Mon–Fri 8am–5pm</span>
        </div>
        <div className="d-flex align-items-center">
          <i className="fas fa-phone-alt me-2"></i>
          <a href="tel:+27783083676" className="text-white text-decoration-none">+27 83 000 0000</a>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        <div className="social-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i></a>
          <a href="https://wa.me/27783083676" target="_blank" rel="noopener noreferrer"><i className="fab fa-whatsapp"></i></a>
        </div>
        {/* <div className="nav-item">
          <Link className="nav-link text-white" to="/order-tracking">
            <i className="fas fa-box me-1"></i>Track Your Order
          </Link>
        </div> */}
      </div>
    </div>

    {/* Mobile layout only */}
    <div className="d-flex d-md-none justify-content-between align-items-center small">
      {/* Left side: social icons */}
      <div className="social-icons">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i></a>
        <a href="https://wa.me/27783083676" target="_blank" rel="noopener noreferrer"><i className="fab fa-whatsapp"></i></a>
      </div>

      {/* Right side: track order link */}
      {/* <div className="nav-item">
        <Link className="nav-link text-white" to="/order-tracking">
          <i className="fas fa-box me-1"></i>Track Order
        </Link>
      </div> */}
    </div>
  </div>
</div>



      <hr className="fading-line" />

      {/* Main Navbar */}
      <nav className={`navbar navbar-expand-lg navbar-dark bg-dark shadow transition sticky-top`}>
        <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
          <img src={logo} alt="Logo" style={{ height: "9vmin", width: "9vmin", borderRadius: "30%"}} />
          <span
            style={{
              display: "inline-block",
              width: "200px",
              fontSize: "1.5rem",
              fontWeight: "bold",
              letterSpacing: "1px",
            }}
          >
      Spidy Warehouse
    </span>

        </Link>


          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="../">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="../#features">Features</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="../#pricing">Pricing</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="../#about-us">About Us</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="../contact">Contact Us</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="../admin/login">Try Demo</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Back to Top Button */}
      {scrolled && (
        <a href="#top" className="back-to-top-btn">
          <i className="fas fa-arrow-up"></i>
        </a>
      )}
    </>
  );
};

export default Header;
