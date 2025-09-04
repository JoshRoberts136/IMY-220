import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import '../styles.css';

function Header() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  const handleSignOut = () => {
    setIsAuthenticated(false);
    navigate('/');
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
        <Link to="/projects" className={`btn ${location.pathname === '/projects' ? 'btn-primary' : ''}`}>Projects</Link>
        <button onClick={handleSignOut} className="btn">Sign out</button>
      </div>
    </header>
  );
}

export default Header;