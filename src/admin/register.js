import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import image from '../assets/images/store-5619201_1280.jpg';
import logo from '../assets/images/logoo.jpg';
import { AuthContext } from '../context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { useSettings } from '../context/SettingsContext';

const Register = () => {
  const { settings, isLoading } = useSettings();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!settings?.api_url) {
      setError('Settings not loaded yet. Please try again.');
      return;
    }

    setLoading(true);
    setError('');

    fetch(`${settings.api_url}/api/v1/auth/register.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData),
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.loggedIn) {
          toast.success(`Welcome, ${formData.username || formData.email}`);
          login(data.user);
          setFormData({ username: '', email: '', password: '', role: '' });
          navigate('/admin/dashboard');
        } else {
          setError(data.error || 'Registration failed');
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error('Registration error:', err);
        setError('An unexpected error occurred. Please try again later.');
      });
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 3000); // Hide after 3 seconds

      return () => clearTimeout(timer); // cleanup if component unmounts
    }
  }, [error]);

  if (isLoading || !settings?.api_url) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="row g-0 position-relative" style={{ minHeight: '100vh' }}>
        <div className="position-absolute top-0 start-0 p-3 z-1">
          <img src={logo} alt="Logo" style={{ height: '80px', width: 'auto', borderRadius: '30%' }} />
        </div>

        <div className="col-md-6 d-none d-md-block position-relative">
          <img
            src={image}
            alt="Register visual"
            style={{ width: '100%', height: '100vh', objectFit: 'cover' }}
          />
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
            <h1 className="text-white text-center">Welcome to Our <br />Platform</h1>
          </div>
        </div>

        {/* Scrollable form column */}
        <div className="col-md-6" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
          <div className="p-5 mx-auto" style={{ maxWidth: '400px', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="alert alert-info text-center" role="alert">
              <strong>Note:</strong> You are registering into a <u>demo warehouse system</u> for testing purposes only.
            </div>

            <h3 className="pt-3 text-center">Sign up to your account</h3>
            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="role" className="form-label">Role</label>
                <select
                  className="form-select"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select a role</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="staff">Staff</option>
                </select>
              </div>




              <div className="d-grid mb-3">
                <button type="submit" className="btn btn-primary py-2" disabled={loading}>
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <div className="text-center mb-3">
                <small>
                  Already have an account? <Link to="/admin/login">Login</Link>
                </small>
              </div>

            </form>
          </div>
        </div>
      </div>

      <div className="position-absolute bottom-0 start-0 p-2 small sidebar-header-text text-muted" style={{ zIndex: 10 }}>
        <span className="d-none d-md-inline text-white">&copy; 2025 Spidy Warehouse</span>
        <span className="d-inline d-md-none text-dark sidebar-header-text text-muted">&copy; 2025 Spidy Warehouse</span>
      </div>
    </>
  );
};

export default Register;
