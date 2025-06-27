import React from 'react';
import Header from '../components/header';

const About = () => {
  return (
    <>
    {/* Navbar */}
    <Header />

    <div className="container my-5">
      <h1 className="text-center mb-4">About Our Warehouse Management System</h1>
      <div className="row">
        <div className="col-md-6">
          <p>
            Our Warehouse Management System is designed to help you streamline your inventory,
            track products, generate reports, and improve efficiency. Whether you're managing a small storage facility or a large warehouse, our system adapts to your needs.
          </p>
          <p>
            With real-time updates and offline-first functionality, you can continue working even without an internet connection — your data syncs automatically once you're back online.
          </p>
        </div>
        <div className="col-md-6">
          <img
            src="https://store.qwa2music.co.za/spidy/logo.jpg"
            alt="Warehouse"
            style={{maxHeight:'250px'}}
            className="img-fluid rounded shadow"
          />
        </div>
      </div>
    </div>
    </>
  );
};

export default About;
