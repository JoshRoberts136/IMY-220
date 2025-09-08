import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../styles.css';

function Header() {
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Navigate anyway since we cleared local auth
      navigate('/');
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <div className="logo-icon"></div>
        <div className="logo-text">ApexCoding</div>
      </div>
      <div className="nav-buttons">
        <Link to="/home" className={`btn ${location.pathname === '/home' ? 'btn-primary' : ''}`}>Feed</Link>
        <Link to="/profile" className={`btn ${location.pathname === '/profile' ? 'btn-primary' : ''}`}>Profile</Link>
        {currentUser && (
          <span className="user-greeting user-greeting-inline">
            Welcome, {currentUser.legendName}!
          </span>
        )}
        <button onClick={handleSignOut} className="btn">Sign out</button>
      </div>
    </header>
  );
}

export default Header;