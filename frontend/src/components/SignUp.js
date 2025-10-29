import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { User, Mail, Lock, CheckCircle } from 'lucide-react';
import FormInput from './FormInput';
import Button from './Button';
import apiService from '../utils/apiService';

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
    <form className="block" onSubmit={handleSubmit}>
      {error && (
        <div className="text-red-400 bg-red-900/20 px-4 py-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}
      
      <FormInput
        label="Legend Name"
        icon={User}
        type="text"
        id="regUsername"
        placeholder="Choose your legend name"
        value={legendName}
        onChange={(e) => setLegendName(e.target.value)}
        required
        disabled={loading}
      />
      
      <FormInput
        label="Legend Email"
        icon={Mail}
        type="email"
        id="regEmail"
        placeholder="your@email.com"
        value={legendId}
        onChange={(e) => setLegendId(e.target.value)}
        required
        disabled={loading}
      />
      
      <FormInput
        label="Passcode"
        icon={Lock}
        type="password"
        id="regPassword"
        placeholder="Create secure passcode"
        value={passcode}
        onChange={(e) => setPasscode(e.target.value)}
        required
        disabled={loading}
      />
      
      <FormInput
        label="Confirm Passcode"
        icon={CheckCircle}
        type="password"
        id="regConfirmPassword"
        placeholder="Confirm your passcode"
        value={confirmPasscode}
        onChange={(e) => setConfirmPasscode(e.target.value)}
        required
        disabled={loading}
      />
      
      <Button 
        type="submit" 
        variant="primary" 
        disabled={loading}
        className="w-full !py-5 !text-lg relative overflow-hidden group"
      >
        <span className="relative z-10">
          {loading ? 'Creating Legend...' : 'Become Champion'}
        </span>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
      </Button>
    </form>
  );
}

export default Signup;
