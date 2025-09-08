import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import '../styles.css';

function Login() {
  const [legendId, setLegendId] = useState('');
  const [passcode, setPasscode] = useState('');
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (legendId === 'test@example.com' && passcode === 'password123') {
      console.log('Login successful with:', { legendId, passcode });
      setIsAuthenticated(true);
      navigate('/home');
    } else {
      console.log('Login failed');
    }
  };

  return (
    <form className="auth-form active" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="loginEmail">Legend ID</label>
        <input 
          type="email" 
          className="form-input" 
          id="loginEmail" 
          placeholder="your@email.com" 
          value={legendId} 
          onChange={(e) => setLegendId(e.target.value)} 
          required 
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="loginPassword">Passcode</label>
        <input 
          type="password" 
          className="form-input" 
          id="loginPassword" 
          placeholder="Enter your passcode" 
          value={passcode} 
          onChange={(e) => setPasscode(e.target.value)} 
          required 
        />
      </div>
      <button type="submit" className="form-submit">Drop Into Arena</button>
    </form>
  );
}

export default Login;