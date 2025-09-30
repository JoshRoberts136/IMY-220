import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import apiService from '../utils/apiService';
import '../styles.css';

function Login() {
  const [legendId, setLegendId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiService.login({
        email: legendId,
        password: passcode
      });

      console.log('API Response:', response);
      if (response.success) {
        console.log('Login successful, navigating to /home');
        setIsAuthenticated(true);
        navigate('/home');
      } else {
        setError(response.message || 'Login failed');
        console.log('Login failed:', response.message);
      }
    } catch (error) {
      setError(error.message || 'Login failed');
      console.log('Login failed:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form active" onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}
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
          disabled={loading}
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
          disabled={loading}
        />
      </div>
      <button type="submit" className="form-submit" disabled={loading}>
        {loading ? 'Dropping In...' : 'Drop Into Arena'}
      </button>
    </form>
  );
}

export default Login;