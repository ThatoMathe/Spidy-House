import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center px-3">
      <div>
        <i className="fas fa-exclamation-triangle text-warning display-1 mb-4"></i>
        <h1 className="display-2 fw-bold text-dark">404</h1>
        <p className="lead text-muted">Oops! The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-dark mt-3 px-4 py-2">
          <i className="fas fa-home me-2"></i>Go Back Home
        </Link>
      </div>
    </div>
  );
}
