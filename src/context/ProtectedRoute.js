import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ children, redirectTo = "/admin/login", allowedRoles }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Block if not logged in
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Force 2FA check if required
  if (
    user.is_2fa_enabled === 1 &&
    user.is_2fa_verified !== 1 &&
    location.pathname !== '/admin/verify'
  ) {
    return <Navigate to="/admin/verify" state={{ user }} replace />;
  }

  // Auto-redirect if 2FA is already verified and user is on the verify page
  if (
    user.is_2fa_enabled === 1 &&
    user.is_2fa_verified === 1 &&
    location.pathname === '/admin/verify'
  ) {
    return <Navigate to="/admin/dashboard" state={{ user }} replace />;
  }

  // Only apply role check if allowedRoles is explicitly set
  if (allowedRoles) {
    const allowed = allowedRoles.split(',').map(role => role.trim().toLowerCase());
    const userRole = (user.Role || '').toLowerCase();

    if (!allowed.includes(userRole)) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <div className="text-center">
            <h1 className="display-4 text-danger">
              <i className="fas fa-ban me-2"></i> Access Denied
            </h1>
            <p className="lead">You do not have permission to access this page.</p>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;
