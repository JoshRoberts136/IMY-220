import React, { createContext, useState, useEffect, useContext } from 'react';
import apiService from '../utils/apiService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on app load
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Check if we have a token
      if (apiService.isAuthenticated()) {
        // Verify the token with the server
        const user = await apiService.verifyToken();
        if (user) {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      // Clear any invalid auth data
      apiService.clearAuth();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await apiService.login(credentials);
      
      if (response.success) {
        setCurrentUser(response.user);
        setIsAuthenticated(true);
        return { success: true, message: response.message };
      } else {
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message || 'Network error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      const response = await apiService.signup(userData);
      
      if (response.success) {
        setCurrentUser(response.user);
        setIsAuthenticated(true);
        return { success: true, message: response.message };
      } else {
        return { success: false, error: response.error || 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup failed:', error);
      return { success: false, error: error.message || 'Network error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if API call fails
    } finally {
      setCurrentUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    currentUser,
    loading,
    login,
    signup,
    logout,
    setIsAuthenticated, // Keep for backward compatibility
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};