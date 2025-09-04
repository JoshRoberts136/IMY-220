import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../styles.css';

function Signup() {
  const [formData, setFormData] = useState({
    legendName: '',
    legendId: '',
    passcode: '',
    confirmPasscode: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const { legendName, legendId, passcode, confirmPasscode } = formData;
    
    if (!legendName.trim()) {
      return 'Legend Name is required';
    }
    
    if (!legendId.trim()) {
      return 'Legend ID is required';
    }
    
    if (!legendId.includes('@')) {
      return 'Please enter a valid email address';
    }
    
    if (passcode.length < 6) {
      return 'Passcode must be at least 6 characters long';
    }
    
    if (passcode !== confirmPasscode) {
      return 'Passcodes do not match';
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setIsLoading(true);

    try {
      const result = await signup({
        legendName: formData.legendName.trim(),
        legendId: formData.legendId.trim(),
        passcode: formData.passcode
      });

      if (result.success) {
        console.log('✅ Signup successful:', result.message);
        navigate('/home');
      } else {
        setError(result.error || 'Signup failed');
        console.error('❌ Signup failed:', result.error);
      }
    } catch (error) {
      console.error('❌ Signup error:', error);
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
        <label className="form-label" htmlFor="regUsername">Legend Name</label>
        <input 
          type="text" 
          className="form-input" 
          id="regUsername" 
          name="legendName"
          placeholder="Choose your legend name" 
          value={formData.legendName} 
          onChange={handleInputChange} 
          required 
          disabled={isLoading}
        />
      </div>
      
      <div className="form-group">
        <label className="form-label" htmlFor="regEmail">Legend ID</label>
        <input 
          type="email" 
          className="form-input" 
          id="regEmail" 
          name="legendId"
          placeholder="your@email.com" 
          value={formData.legendId} 
          onChange={handleInputChange} 
          required 
          disabled={isLoading}
        />
      </div>
      
      <div className="form-group">
        <label className="form-label" htmlFor="regPassword">Passcode</label>
        <input 
          type="password" 
          className="form-input" 
          id="regPassword" 
          name="passcode"
          placeholder="Create secure passcode (min 6 characters)" 
          value={formData.passcode} 
          onChange={handleInputChange} 
          required 
          disabled={isLoading}
          minLength="6"
        />
      </div>
      
      <div className="form-group">
        <label className="form-label" htmlFor="regConfirmPassword">Confirm Passcode</label>
        <input 
          type="password" 
          className="form-input" 
          id="regConfirmPassword" 
          name="confirmPasscode"
          placeholder="Confirm your passcode" 
          value={formData.confirmPasscode} 
          onChange={handleInputChange} 
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
        {isLoading ? 'Creating Legend...' : 'Become Champion'}
      </button>
    </form>
  );
}

export default Signup;