import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import apiService from '../utils/apiService';
import '../styles.css';

function Signup() {
  const [legendName, setLegendName] = useState('');
  const [legendId, setLegendId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (passcode !== confirmPasscode) {
      setError('Passcodes do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.signup({
        username: legendName,
        email: legendId,
        password: passcode,
        profile: {
          firstName: legendName.split(' ')[0] || legendName,
          lastName: legendName.split(' ')[1] || ''
        }
      });

      if (response.success) {
        console.log('Signup successful with:', { legendName, legendId });
        setIsAuthenticated(true);
        navigate('/home');
      } else {
        setError(response.message || 'Signup failed');
      }
    } catch (error) {
      setError(error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form active" onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}
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
          disabled={loading}
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
          disabled={loading}
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
          disabled={loading}
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
          disabled={loading}
        />
      </div>
      <button type="submit" className="form-submit" disabled={loading}>
        {loading ? 'Creating Legend...' : 'Become Champion'}
      </button>
    </form>
  );
}

export default Signup;