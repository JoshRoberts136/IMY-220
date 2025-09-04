import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../styles.css';

function Login() {
  const [legendId, setLegendId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login({
        legendId: legendId.trim(),
        passcode: passcode
      });

      if (result.success) {
        console.log('✅ Login successful:', result.message);
        navigate('/home');
      } else {
        setError(result.error || 'Login failed');
        console.error('❌ Login failed:', result.error);
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="auth-form active" onSubmit={handleSubmit}>
      {error && (
        <div className="error-message" style={{ 
          color: '#ff6b6b', 
          background: '#ffe0e0', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '15px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}
      
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
          disabled={isLoading}
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
          disabled={isLoading}
        />
      </div>
      
      <button 
        type="submit" 
        className="form-submit" 
        disabled={isLoading}
        style={{
          opacity: isLoading ? 0.7 : 1,
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoading ? 'Entering Arena...' : 'Drop Into Arena'}
      </button>
      
      <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
        <strong>Demo Credentials:</strong><br />
        Email: test@example.com<br />
        Password: password123
      </div>
    </form>
  );
}

export default Login;