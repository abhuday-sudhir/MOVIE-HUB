import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header({ currentUser, onLogout }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <h1>MovieHub</h1>
          {currentUser && (
            <div className="location-selector">
              <span className="location-pin"></span>
              <span className="user-name">Hi, {currentUser.name}</span>
            </div>
          )}
        </div>
        
        {currentUser && (
          <div className="header-right">
            <nav className="nav">
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
              >
                For you
              </Link>
              <Link 
                to="/bookings" 
                className={`nav-link ${isActive('/bookings') ? 'active' : ''}`}
              >
                My Bookings
              </Link>
            </nav>
            <div className="user-section">
              <button 
                onClick={onLogout}
                className="logout-btn"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;