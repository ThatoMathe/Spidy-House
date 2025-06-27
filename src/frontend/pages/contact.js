import { useState } from 'react';
import { Link } from 'react-router-dom';

import Header from '../components/header';
import Footer from '../components/footer';
import '../assets/contact.css';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success(`Thank you, ${formData.name}! We’ve received your message.`);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <>
    {/* Navbar */}
    <Header />

    <section className="nav-section text-center">
      <div className="overlay">
        <h1 className="text-center mb-3 font-weight-bold">Get In Touch</h1>
        <div className="nav-links">
          <Link className="nav-link" to="../">Home</Link>
          <span className="separator">/</span>
          <span >Contact</span>
        </div>
      </div>
    </section>

    <div className="container my-5">
  
  <div className="row justify-content-center">
    {/* Contact Form Section */}
    <div className="col-md-6 col-lg-5">
      <form onSubmit={handleSubmit} className="p-5">
        
        <div className="mb-2">
          <label htmlFor="name" className="form-label text-muted">Your Name</label>
          <input
            type="text"
            className="form-control rounded-0 shadow-sm"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-2">
          <label htmlFor="email" className="form-label text-muted">Your Email</label>
          <input
            type="email"
            className="form-control rounded-0 shadow-sm"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-2">
          <label htmlFor="message" className="form-label text-muted">Your Message</label>
          <textarea
            className="form-control rounded-1 shadow-sm"
            id="message"
            name="message"
            rows="6"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary rounded-0 py-2">Send Message</button>
        </div>
      </form>
    </div>

    {/* Contact Information and Social Media Links Section */}
    <div className="col-md-6 col-lg-5 mt-5 mt-md-0">
      <div className="p-5">
        <h3 className="mb-4 text-primary">Our Information</h3>
        <p><strong className="text-muted">Company Name:</strong> Spidy Warehouse</p>
        <p><strong className="text-muted">Email:</strong> info@spidywarehouse.com</p>
        <p><strong className="text-muted">Description:</strong> Our team is dedicated to improving your experience. We're always happy to hear from you, whether it's feedback or inquiries about our services.</p>

        <h3 className="mt-4 mb-3 text-primary">Follow Us</h3>
        <ul className="list-unstyled">
  <li>
    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"
       className="text-decoration-none text-muted d-inline-block link-primary-hover">
      <i className="fab fa-facebook me-2"></i> Facebook
    </a>
  </li>
  <li>
    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"
       className="text-decoration-none text-muted d-inline-block link-primary-hover">
      <i className="fab fa-instagram me-2"></i> Instagram
    </a>
  </li>
  <li>
    <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"
       className="text-decoration-none text-muted d-inline-block link-primary-hover">
      <i className="fab fa-twitter me-2"></i> Twitter
    </a>
  </li>
  <li>
    <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer"
       className="text-decoration-none text-muted d-inline-block link-primary-hover">
      <i className="fab fa-linkedin me-2"></i> LinkedIn
    </a>
  </li>
</ul>

      </div>
    </div>
  </div>

</div>


    <iframe
      className=" top-0 start-0"
      title='spidyhouse'
      src="https://www.openstreetmap.org/export/embed.html?bbox=-74.0125%2C40.7032%2C-73.978%2C40.7178&layer=mapnik&marker=40.7105%2C-73.995"
      style={{ pointerEvents: "none", border: 0, height:"300px", width:"100%" }}
      allowFullScreen=""
      loading="lazy"
    ></iframe>



      {/* Footer */}
      <Footer />
    </>
  );
};

export default Contact;
