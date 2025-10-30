import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { Mail, Lock } from 'lucide-react';
import FormInput from './FormInput';
import Button from './Button';
import apiService from '../utils/apiService';

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

      if (response.success) {
        setIsAuthenticated(true);
        navigate('/home');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (error) {
      setError(error.message || 'Login failed');
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
        label="Legend Email"
        icon={Mail}
        type="email"
        id="loginEmail"
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
        id="loginPassword"
        placeholder="Enter your passcode"
        value={passcode}
        onChange={(e) => setPasscode(e.target.value)}
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
          {loading ? 'Dropping In...' : 'Drop Into Arena'}
        </span>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
      </Button>
    </form>
  );
}

export default Login;
