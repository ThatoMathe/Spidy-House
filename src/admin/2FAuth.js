import { useRef, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import image from '../assets/images/store-5619201_1280.jpg';
import logo from '../assets/images/logoo.jpg';
import { toast } from 'react-toastify';
import { useSettings } from '../context/SettingsContext';
import { AuthContext } from '../context/AuthContext';

const VerifyPage = () => {
  const { settings } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);
  const user = location.state?.user;
  const { login } = useContext(AuthContext);

  const [codes, setCodes] = useState(Array(6).fill(''));
  const inputsRef = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // allow only numbers
    const newCodes = [...codes];
    newCodes[index] = value;
    setCodes(newCodes);
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !codes[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredCode = codes.join('');

    if (!user?.Email) {
      toast.error('User email not found. Please log in again.');
      navigate('/admin/login');
      return;
    }

    try {
      const res = await fetch(`${settings.api_url}/api/v1/auth/verify-2fa-code.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Send cookies/session with request
        body: JSON.stringify({
          email: user.Email,
          code: enteredCode,
        }),
      });

      const result = await res.json();

      if (result.success) {
        user.is_2fa_verified = 1;       // manually update in-place
        login(user);                    // your custom context login
        toast.success(`Welcome back, ${user.UserName}`);
        setTimeout(() => {
          navigate('/admin/dashboard', { replace: true });
        }, 100); // short delay to allow state/context updates
      }

    } catch (error) {
      toast.error('Verification failed. Please try again.');
      console.error('Verification error:', error);
    }
  };



  const handleResend = async () => {
    setResending(true);

    try {
      const res = await fetch(`${settings.api_url}/api/v1/auth/send-2fa-code.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: user.Email }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success("Verification code resent!");
      } else {
        toast.error("Failed to resend code.");
      }
    } catch (error) {
      toast.error("Error resending code.");
    }

    setResending(false);
  };


  return (
    <>
      <div className="row g-0 position-relative" style={{ minHeight: '100vh' }}>
        <div className="position-absolute top-0 start-0 p-3 z-1">
          <img src={logo} alt="Logo" style={{ height: '80px', width: 'auto', borderRadius: '30%' }} />
        </div>

        <div className="col-md-6 d-none d-md-block position-relative">
          <img src={image} alt="Login visual" style={{ width: '100%', height: '100vh', objectFit: 'cover' }} />
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
            <h1 className="text-white text-center">Welcome to Our <br />Platform</h1>
          </div>
        </div>

        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="p-5 w-100" style={{ maxWidth: '400px' }}>
            <h3 className="mb-4 text-center">Two-Factor Authentication</h3>

            <div className="text-center">
              <p>Enter the 6-digit code sent to your email</p>
              <div className="d-flex justify-content-center gap-2 mb-3">
                {codes.map((val, i) => (
                  <input
                    key={i}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="form-control text-center"
                    style={{ width: '40px', fontSize: '1.5rem' }}
                    value={val}
                    ref={(el) => (inputsRef.current[i] = el)}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                  />
                ))}
              </div>

              <div className="d-grid mb-2">
                <button className="btn btn-success" onClick={handleVerify}>Verify</button>
              </div>

              <div>
                <button
                  className="btn btn-link p-0 text-primary"
                  style={{ textDecoration: 'underline', fontSize: '0.9rem' }}
                  onClick={handleResend}
                  disabled={resending}
                >
                  {resending ? 'Sending...' : 'Resend Code'}
                </button>

              </div>
            </div>
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

export default VerifyPage;
