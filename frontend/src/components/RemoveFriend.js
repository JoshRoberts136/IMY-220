import React, { useState } from 'react';
import { UserMinus, Check } from 'lucide-react';
import apiService from '../utils/apiService';
import '../styles.css';

const RemoveFriend = ({ targetUserId, onFriendshipChange }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRemoveFriend = async () => {
    if (!window.confirm('Are you sure you want to remove this friend?')) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await apiService.removeFriend(targetUserId);
      
      if (response.success) {
        const currentUser = apiService.getUser();
        const updatedUser = {
          ...currentUser,
          friends: (currentUser.friends || []).filter(id => id !== targetUserId)
        };
        apiService.setUser(updatedUser);
        
        if (onFriendshipChange) {
          onFriendshipChange('none');
        }
      } else {
        setError(response.message || 'Failed to remove friend');
      }
    } catch (error) {
      console.error('Error removing friend:', error);
      setError('Failed to remove friend');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="error-container-inline">
        <span className="error-text">{error}</span>
        <button
          className="btn-secondary"
          onClick={() => setError('')}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <button 
      className="btn btn-secondary btn-with-icon"
      onClick={handleRemoveFriend}
      disabled={loading}
    >
      {loading ? (
        <>
          <Check className="icon-sm" />
          Removing...
        </>
      ) : (
        <>
          <UserMinus className="icon-sm" />
          Remove Friend
        </>
      )}
    </button>
  );
};

export default RemoveFriend;
