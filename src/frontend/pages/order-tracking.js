import React, { useState, useRef, useEffect } from "react";
import Header from '../components/header';
import Footer from '../components/footer';
import { Link } from 'react-router-dom';

const TrackingOrder = () => {
  const [showDetails, setShowDetails] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  const toggleDetails = (e) => {
    e.preventDefault();
    setShowDetails((prev) => !prev);
  };

  useEffect(() => {
    if (showDetails) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [showDetails]);

  return (
    <>
        {/* Navbar */}
        <Header />

        <section className="nav-section text-center">
      <div className="overlay">
        <h1 className="text-center mb-3 font-weight-bold">Track order</h1>
        <div className="nav-links">
          <Link className="nav-link" to="../">Home</Link>
          <span className="separator">/</span>
          <span >Track order</span>
        </div>
      </div>
    </section>


      <div className="tracking container padding-bottom-3x mb-1 py-5">
        <div className="card mb-3">
          <div className="p-4 text-center text-white text-lg bg-dark rounded-top">
            <span className="text-uppercase">Tracking Order No - </span>
            <span className="text-medium">34VB5540K83</span>
          </div>
          <div className="d-flex flex-wrap flex-sm-nowrap justify-content-between py-3 px-2 bg-secondary">
            <div className="w-100 text-center py-1 px-2">
              <span className="text-medium">Shipped Via:</span> UPS Ground
            </div>
            <div className="w-100 text-center py-1 px-2">
              <span className="text-medium">Status:</span> Checking Quality
            </div>
            <div className="w-100 text-center py-1 px-2">
              <span className="text-medium">Expected Date:</span> JUL 03, 2025
            </div>
          </div>
          <div className="card-body">
            <div className="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
              <div className="step completed">
                <div className="step-icon-wrap">
                  <div className="step-icon">
                    <i className="pe-7s-cart"></i>
                  </div>
                </div>
                <h4 className="step-title">Confirmed Order</h4>
              </div>
              <div className="step completed">
                <div className="step-icon-wrap">
                  <div className="step-icon">
                    <i className="pe-7s-config"></i>
                  </div>
                </div>
                <h4 className="step-title">Processing Order</h4>
              </div>
              <div className="step completed">
                <div className="step-icon-wrap">
                  <div className="step-icon">
                    <i className="pe-7s-medal"></i>
                  </div>
                </div>
                <h4 className="step-title">Quality Check</h4>
              </div>
              <div className="step">
                <div className="step-icon-wrap">
                  <div className="step-icon">
                    <i className="pe-7s-car"></i>
                  </div>
                </div>
                <h4 className="step-title">Product Dispatched</h4>
              </div>
              <div className="step">
                <div className="step-icon-wrap">
                  <div className="step-icon">
                    <i className="pe-7s-home"></i>
                  </div>
                </div>
                <h4 className="step-title">Product Delivered</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle button */}
        <div className="d-flex flex-wrap flex-md-nowrap justify-content-center justify-content-sm-between align-items-center">
          <div className="custom-control custom-checkbox mr-3">
            <input
              className="custom-control-input"
              type="checkbox"
              id="notify_me"
              defaultChecked
            />
            <label className="custom-control-label" htmlFor="notify_me">
              Notify me when order is delivered
            </label>
          </div>
          <div className="text-left text-sm-right">
            <a
              href="#orderDetails"
              className="btn btn-outline-primary btn-rounded btn-sm"
              onClick={toggleDetails}
            >
              {showDetails ? "Hide Order Details" : "View Order Details"}
            </a>
          </div>
        </div>

        {/* Smooth collapsible content */}
        <div
          ref={contentRef}
          style={{
            height: `${height}px`,
            overflow: "hidden",
            transition: "height 0.5s ease"
          }}
        >
          <div className="card card-body mt-3">
            <p><strong>Tracking ID:</strong> 34VB5540K83</p>
            <p><strong>Shipping Method:</strong> UPS Ground</p>
            <p><strong>Status:</strong> Checking Quality</p>
            <p><strong>Expected Delivery:</strong> SEP 09, 2017</p>
            <p><strong>Address:</strong> 1234 Delivery St, Cape Town, South Africa</p>
          </div>
        </div>
      </div>

      
      {/* Footer */}
      <Footer />

    </>
  );
};

export default TrackingOrder;
