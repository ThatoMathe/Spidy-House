import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './assets/login-style.css';
import Home from './Home';
import About from './pages/about';
import Contact from './pages/contact';
import Tracking from './pages/order-tracking';
import NotFound from './404';

export default function FrontEnd() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/order-tracking" element={<Tracking />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
