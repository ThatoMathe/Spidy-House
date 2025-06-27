import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo-s.svg';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5">
      <div className="container">
        <div className="row g-2">
          {/* Logo & About */}
          <div className="col-12 col-md-3 mb-4">
            <img src={logo} alt="Logo" style={{ height: '50px' }} className="mb-2" />
            <p className="mb-0">Spidy Warehouse is a smart solution for inventory tracking and warehouse productivity.</p>
          </div>

          {/* Quick Links */}
          <div className="col-12 col-md-3 mb-4">
            <h5 className="text-uppercase">Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-white text-decoration-none">Home</Link></li>
              <li><Link to="/features" className="text-white text-decoration-none">Features</Link></li>
              <li><Link to="/admin/login" className="text-white text-decoration-none">Try Demo</Link></li>
              <li className="nav-item">
                <Link className="nav-link" to="../#faq">FAQ</Link>
              </li>
              <li><Link to="/contact" className="text-white text-decoration-none">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-12 col-md-3 mb-4">
            <h5 className="text-uppercase">Contact</h5>
            <p className="mb-1"><i className="fas fa-map-marker-alt me-2"></i>135 Musgrave Road, Durban, SA</p>
            <p className="mb-1"><i className="fas fa-phone me-2"></i>+27 12 345 6789</p>
            <p className="mb-0"><i className="fas fa-envelope me-2"></i>support@spidywarehouse.com</p>
          </div>

          {/* Social & Subscription */}
          <div className="col-12 col-md-3 mb-4">
            <h5 className="text-uppercase">Follow Us</h5>
            <div className="mb-3">
              <a href="#" className="text-white me-3"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-white me-3"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-white me-3"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" className="text-white"><i className="fab fa-instagram"></i></a>
            </div>

            <h6 className="text-uppercase">Subscribe</h6>
            <form className="d-flex">
              <input 
                type="email" 
                className="form-control me-2 rounded-1" 
                placeholder="Your email" 
                aria-label="Email"
              />
              <button className="btn btn-primary rounded-1" type="submit">Go</button>
            </form>
          </div>
        </div>

        <div className="border-top border-secondary pt-3 mt-3 pb-3 text-center">
          &copy; {new Date().getFullYear()} Spidy Warehouse. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
