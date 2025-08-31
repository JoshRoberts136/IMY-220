import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';

function Header() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleSignOut = () => {
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <header>
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        <li><a href="#" onClick={handleSignOut}>Sign out</a></li>
      </ul>
    </header>
  );
}

export default Header; 