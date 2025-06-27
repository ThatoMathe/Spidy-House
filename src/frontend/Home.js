import { Link } from 'react-router-dom';

import logo from '../assets/images/logoo.jpg';
import screenshot1 from '../assets/images/desktop2.png';
import screenshot2 from '../assets/images/desktop1.png';
import screenshot3 from '../assets/images/desktop3.png';

import ScrollToHash from './components/ScrollToHash';
import Header from './components/header';
import Footer from './components/footer';

import TeamMembers from './components/team'

import 'swiper/css'; // core styles
import 'swiper/css/autoplay';

import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

function Home() {

  return (
    <div>
      {/* Navbar */}
      <Header />
      <ScrollToHash />

      {/* Hero Section */}
      <section className="hero-section text-white text-center py-5 d-flex align-items-center" >
        <div className="container">
          <h1>📦 Welcome to <strong>Spidy House</strong></h1>
          <h1>Warehouse Management System</h1>
          <p className="lead">Track inventory, manage reports, and stay productive — even offline.</p>
          <Link to="/admin/login" className="btn btn-light btn-lg mt-3">Try Demo</Link>
        </div>
      </section>

      <section className="bg-light py-5 stats_section">
        <div className="container">
          <div className="row text-center">
            <div className="col-3">
              <h2 className="text-dark fw-bold">200+</h2>
              <p className="mb-0">Company</p>
            </div>
            <div className="col-3">
              <h2 className="text-dark fw-bold">340+</h2>
              <p className="mb-0">Active Warehouses</p>
            </div>
            <div className="col-3">
              <h2 className="text-dark fw-bold">98%</h2>
              <p className="mb-0">Accuracy Rate</p>
            </div>
            <div className="col-3">
              <h2 className="text-dark fw-bold">24/7</h2>
              <p className="mb-0">System Availability</p>
            </div>
          </div>
        </div>
      </section>

      <section id='about-us' className="py-3 bg-light">
        <div className="container">
          <div className="row align-items-center">
            {/* Left Text */}
            <div className="col-md-6 mb-4 mb-md-0">
              <h2 className="fw-bold">About Spidy Warehouse</h2>
              <p className="lead">
                Spidy Warehouse is an intelligent, offline-capable warehouse management system that empowers businesses to take full control of their inventory.
              </p>
              <p>
                Whether you're tracking shipments, managing reports, or monitoring low stock levels, Spidy Warehouse delivers powerful tools in a simple and secure platform.
                The system is designed to help you improve efficiency, reduce human error, and optimize your warehouse workflows.
              </p>
              <ul className="list-unstyled">
                <li><i className="fas fa-check-circle text-primary me-2"></i>Real-time inventory tracking</li>
                <li><i className="fas fa-check-circle text-primary me-2"></i>Offline support for seamless operation</li>
                <li><i className="fas fa-check-circle text-primary me-2"></i>Role-based admin & staff access</li>
                <li><i className="fas fa-check-circle text-primary me-2"></i>Insightful reports & notifications</li>
              </ul>
            </div>

            {/* Right Image or Illustration */}
            <div className="col-md-6 text-center">

              <img src={logo} alt="Logo" style={{ width: "60%", borderRadius: "30%" }} />

            </div>
          </div>
        </div>
      </section>

      {/* Screenshots */}
      <section id="screenshots" className="bg-light py-5 screenshots">
        <div className="container text-center">
          <h2 className="mb-3">Screenshots</h2>
          <PhotoProvider>
            <div className="image-grid-wrapper">
              <div className="image-grid">

                {/* Large left image */}
                <div className="image-wrapper large-image border border-dark rounded">
                  <PhotoView src={screenshot1}>
                    <img
                      src={screenshot1}
                      className="gallery h-100 w-100"
                      alt="Dashboard"
                      style={{ cursor: 'zoom-in' }}
                    />
                  </PhotoView>
                  <div className="image-text text-center mt-2">Dashboard</div>
                </div>

                {/* Right column - top */}
                <div className="image-wrapper small-image border border-dark rounded">
                  <PhotoView src={screenshot2}>
                    <img
                      src={screenshot2}
                      className="gallery w-100"
                      alt="Tracking Order"
                      style={{ cursor: 'zoom-in' }}
                    />
                  </PhotoView>
                  <div className="image-text">AI + Inventory</div>
                </div>

                {/* Right column - bottom */}
                <div className="image-wrapper small-image border border-dark rounded">
                  <PhotoView src={screenshot3}>
                    <img
                      src={screenshot3}
                      className="gallery w-100"
                      alt="Contact Form"
                      style={{ cursor: 'zoom-in' }}
                    />
                  </PhotoView>
                  <div className="image-text">General Settings</div>
                </div>

              </div>
            </div>
          </PhotoProvider>
        </div>
      </section>


      {/* Features / Benefits */}
      <section id="features" className="py-5 bg-dark text-white">
        <div className="container text-center">
          <h2 className="mb-5">Features & Benefits</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="p-4 bg-black bg-opacity-10 rounded-4 h-100">
                <i className="fas fa-boxes fa-3x mb-3"></i>
                <h5 className="fw-bold">Inventory Tracking</h5>
                <p className="mb-0">Real-time tracking of all your stock across multiple locations.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-black bg-opacity-10 rounded-4 h-100">
                <i className="fas  fa-chart-line fa-3x mb-3"></i>
                <h5 className="fw-bold">Smart Reports</h5>
                <p className="mb-0">Generate reports that help you make better business decisions.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-black bg-opacity-10 rounded-4 h-100">
                <i className="fas fa-cloud fa-3x mb-3"></i>
                <h5 className="fw-bold">Offline Access</h5>
                <p className="mb-0">Work uninterrupted even when your internet goes down.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-black bg-opacity-10 rounded-4 h-100">
                <i className="fas fa-bell fa-3x mb-3"></i>
                <h5 className="fw-bold">Low Stock Alerts</h5>
                <p className="mb-0">Get instant alerts when items are running low to avoid stockouts.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-black bg-opacity-10 rounded-4 h-100">
                <i className="fas fa-users-cog fa-3x mb-3"></i>
                <h5 className="fw-bold">User Roles & Permissions</h5>
                <p className="mb-0">Control who can view, edit, or manage specific inventory sections.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-black bg-opacity-10 rounded-4 h-100">
                <i className="fas fa-robot fa-3x mb-3"></i>
                <h5 className="fw-bold">AI Assistance</h5>
                <p className="mb-0">Get intelligent suggestions for restocking, sales forecasting, and optimizing inventory based on trends.</p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Product Highlights */}
      <section className="py-5">
        <div className="container text-center">
          <h2 className="mb-4">Why Choose Us?</h2>
          <div className="row">
            <div className="col-md-4">
              <div className="feature-box">
                <h4>Comprehensive Dashboard</h4>
                <p>All your data in one place, with intuitive charts, insights, and management tools to streamline your operations.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-box">
                <h4>24/7 Support</h4>
                <p>Our dedicated support team is always available to assist with any queries or technical issues you may face.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-box">
                <h4>Customizable Settings</h4>
                <p>Tailor the system to fit your specific business needs with customizable preferences and options.</p>
              </div>
            </div>
          </div>
        </div>
      </section>






      {/* Pricing Plans */}
      <section id="pricing" className="bg-light py-5">
        <div className="container text-center">
          <h2 className="mb-4">Pricing Plans</h2>
          <div className="row">


            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-lg border-0 rounded-4 animate__animated animate__fadeInUp" style={{ transition: 'transform 0.3s ease' }}>
                <div className="card-body text-center p-5 d-flex flex-column">
                  <h4 className="card-title fw-bold display-6 mb-3 text-primary">Basic</h4>
                  <p className="card-text fs-4 mb-4 text-dark">
                    R199<span className="fs-6 text-muted">/month</span>
                  </p>
                  <ul className="list-unstyled mb-4">
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>1 Warehouse
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>Inventory Reports
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>Email Support
                    </li>
                  </ul>
                  <hr
                    className="mt-auto"
                    style={{
                      backgroundImage: "linear-gradient(to right, transparent, rgb(62, 62, 62), transparent)",
                      height: "1px",
                      border: "none"
                    }}
                  />
                  <a href="#" className="btn btn-lg btn-outline-primary px-4 py-2 rounded-pill">
                    Choose Plan
                  </a>
                </div>
              </div>
            </div>


            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-lg border-0 rounded-4 animate__animated animate__fadeInUp" style={{ transition: 'transform 0.3s ease' }}>
                <div className="card-body text-center p-5 d-flex flex-column">
                  <h4 className="card-title fw-bold display-6 mb-3 text-primary">Pro</h4>
                  <p className="card-text fs-4 mb-4 text-dark">
                    R499<span className="fs-6 text-muted">/month</span>
                  </p>
                  <ul className="list-unstyled mb-4">
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>Up to 5 Warehouses
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>Advanced Reports
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>Priority Support
                    </li>
                  </ul>
                  <hr
                    className="mt-auto"
                    style={{
                      backgroundImage: "linear-gradient(to right, transparent, rgb(62, 62, 62), transparent)",
                      height: "1px",
                      border: "none"
                    }}
                  />
                  <a href="#" className="btn btn-lg btn-outline-primary px-4 py-2 rounded-pill">
                    Choose Plan
                  </a>
                </div>
              </div>
            </div>




            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-lg border-0 rounded-4 animate__animated animate__fadeInUp" style={{ transition: 'transform 0.3s ease' }}>
                <div className="card-body text-center p-5 d-flex flex-column">
                  <h4 className="card-title fw-bold display-6 mb-3 text-primary">Enterprise</h4>

                  <ul className="list-unstyled mb-4">
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>Unlimited Warehouses
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>Custom Integrations
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>Dedicated Manager
                    </li>
                  </ul>
                  <hr
                    className="mt-auto"
                    style={{
                      backgroundImage: "linear-gradient(to right, transparent, rgb(62, 62, 62), transparent)",
                      height: "1px",
                      border: "none"
                    }}
                  />
                  <a href="#" className="btn btn-lg btn-outline-primary px-4 py-2 rounded-pill">
                    Contact Sales
                  </a>
                </div>
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* Team Section */}
      <TeamMembers />


      {/* FAQs */}
      <section id="faq" className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">FAQs</h2>
          <div className="accordion" id="faqAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                  Can I use the system offline?
                </button>
              </h2>
              <div id="faq1" className="accordion-collapse collapse show">
                <div className="accordion-body">Yes, Spidy House supports offline mode for uninterrupted access.</div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingTwo">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                  Is there a free trial?
                </button>
              </h2>
              <div id="faq2" className="accordion-collapse collapse">
                <div className="accordion-body">Yes, we offer a 14-day free trial for all plans.</div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingThree">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                  Does it support barcode scanning?
                </button>
              </h2>
              <div id="faq3" className="accordion-collapse collapse">
                <div className="accordion-body">Yes, our system is fully compatible with barcode scanners for faster inventory management.</div>
              </div>
            </div>



            <div className="accordion-item">
              <h2 className="accordion-header" id="headingFive">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq5">
                  Is the system customizable?
                </button>
              </h2>
              <div id="faq5" className="accordion-collapse collapse">
                <div className="accordion-body">Absolutely! We offer custom features to fit your business needs and workflows.</div>
              </div>
            </div>



            <div className="accordion-item">
              <h2 className="accordion-header" id="headingSeven">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq7">
                  Can I access the system from mobile devices?
                </button>
              </h2>
              <div id="faq7" className="accordion-collapse collapse">
                <div className="accordion-body">Yes, the system is fully responsive and has mobile apps for iOS and Android.</div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="headingEight">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq8">
                  What kind of support do you provide?
                </button>
              </h2>
              <div id="faq8" className="accordion-collapse collapse">
                <div className="accordion-body">We offer 24/7 support through email, chat, and phone. Plus, you get a dedicated account manager.</div>
              </div>
            </div>

          </div>
        </div>
      </section>




      {/* Footer */}
      <Footer />

    </div>
  );
}

export default Home;
