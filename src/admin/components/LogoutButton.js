import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useSettings } from '../../context/SettingsContext';

const LogoutButton = () => {
  const { settings } = useSettings();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${settings.api_url}/api/v1/auth/logout.php`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      if (data.success) {
        logout();

        navigate('/admin/login');
      } else {
        toast.error(data.message || 'Logout failed');
      }
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('An error occurred. Please try again later.');
    }
  };

  return (
    <button className="dropdown-item" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
