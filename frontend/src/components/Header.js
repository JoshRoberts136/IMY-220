import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext'; // Create this context file

function Header() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext); // Access auth state

  const handleSignOut = () => {
    setIsAuthenticated(false); // Reset authentication state
    navigate('/'); // Redirect to splash page
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

export { Header };