import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import image from '../assets/images/store-5619201_1280.jpg';
import logo from '../assets/images/logoo.jpg';
import { toast } from 'react-toastify';
import { useSettings } from '../context/SettingsContext';

const Login = () => {
  const { settings, isLoading } = useSettings();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

    const LoadingSpinner = () => (
    <div className="loading-container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="ms-3">Please wait...</p>
    </div>
  );
  if (isLoading || !settings?.api_url) return <LoadingSpinner />;


  const handleSubmit = (e) => {
    e.preventDefault();
  
    fetch(`${settings.api_url}/api/v1/auth/check-session.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.loggedIn) {
          // Check if 2FA is enabled
          if (data.user.is_2fa_enabled === true || data.user.is_2fa_enabled === 1 || data.user.is_2fa_enabled === '1') {
            navigate('/admin/verify', { state: { user: data.user } });
          } else {
            toast.success(`Welcome back, ${data.user.UserName}`);
            setFormData({ email: '', password: '' });
            navigate('/admin/dashboard');
          }

        } else {
          toast.error('Login failed');
        }
      })
      .catch((err) => console.error('Login error:', err));
  };

  if (isLoading || !settings?.api_url) {
    return <div>Loading settings...</div>; // return comes after hooks
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
            alt="Login visual"
            style={{ width: '100%', height: '100vh', objectFit: 'cover' }}
          />
          <div
            className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
          >
            <h1 className="text-white text-center">Welcome to Our <br />Platform</h1>
          </div>
        </div>

        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="p-5 w-100" style={{ maxWidth: '400px' }}>
          <div className="alert alert-info text-center" role="alert">
          <strong>Note:</strong> You are registering into a <u>demo warehouse system</u> for testing purposes only.
          </div>

            <h3 className="mb-4 pt-3 text-center">Sign in to your account</h3>
            <form onSubmit={handleSubmit}>
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

              <div className="mb-4">
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

              <div className="d-grid mb-3">
                <button type="submit" className="btn btn-primary py-2">Login</button>
              </div>

              <div className="text-center mb-3">
                <small>
                  Don’t have an account? <Link to="../register">Register</Link>
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

export default Login;
