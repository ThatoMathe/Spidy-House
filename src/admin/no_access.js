import React from 'react';
import { Link } from 'react-router-dom';

const NoAccess = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#f8f9fa' }}>
      <div className="text-center">
        <h1 className="display-4 text-danger">
            <i className="fas fa-ban me-2"></i> Access Denied
        </h1>

        <p className="lead mt-3">You do not have permission to view this page.</p>
        <p>Please contact an administrator if you believe this is a mistake.</p>
        <Link to="/" className="btn btn-primary mt-3">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NoAccess;
