import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import '../styles.css';

function Signup() {
  const [legendName, setLegendName] = useState('');
  const [legendId, setLegendId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passcode !== confirmPasscode) {
      console.log('Passcodes do not match');
      return;
    }
    if (legendId && passcode && legendName) {
      console.log('Signup successful with:', { legendName, legendId, passcode });
      setIsAuthenticated(true);
      navigate('/home');
    } else {
      console.log('Signup failed');
    }
  };

  return (
    <form className="auth-form active" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="regUsername">Legend Name</label>
        <input 
          type="text" 
          className="form-input" 
          id="regUsername" 
          placeholder="Choose your legend name" 
          value={legendName} 
          onChange={(e) => setLegendName(e.target.value)} 
          required 
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="regEmail">Legend ID</label>
        <input 
          type="email" 
          className="form-input" 
          id="regEmail" 
          placeholder="your@email.com" 
          value={legendId} 
          onChange={(e) => setLegendId(e.target.value)} 
          required 
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="regPassword">Passcode</label>
        <input 
          type="password" 
          className="form-input" 
          id="regPassword" 
          placeholder="Create secure passcode" 
          value={passcode} 
          onChange={(e) => setPasscode(e.target.value)} 
          required 
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="regConfirmPassword">Confirm Passcode</label>
        <input 
          type="password" 
          className="form-input" 
          id="regConfirmPassword" 
          placeholder="Confirm your passcode" 
          value={confirmPasscode} 
          onChange={(e) => setConfirmPasscode(e.target.value)} 
          required 
        />
      </div>
      <button type="submit" className="form-submit">Become Champion</button>
    </form>
  );
}

export default Signup;