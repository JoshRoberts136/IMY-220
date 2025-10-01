import React, { useState } from 'react';
import { UserMinus, Check } from 'lucide-react';
import Button from './Button';
import apiService from '../utils/apiService';

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
      <div className="flex flex-col gap-2">
        <span className="text-red-400 text-sm">{error}</span>
        <Button
          variant="secondary"
          onClick={() => setError('')}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <Button 
      variant="secondary"
      icon={loading ? Check : UserMinus}
      onClick={handleRemoveFriend}
      disabled={loading}
    >
      {loading ? 'Removing...' : 'Remove Friend'}
    </Button>
  );
};

export default RemoveFriend;
