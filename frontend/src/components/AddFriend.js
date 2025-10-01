import React, { useState, useEffect } from 'react';
import { UserPlus, Check, X, Clock } from 'lucide-react';
import Button from './Button';
import apiService from '../utils/apiService';

const AddFriend = ({ targetUserId, onFriendshipChange }) => {
  const [friendshipStatus, setFriendshipStatus] = useState('none');
  const [requestId, setRequestId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (targetUserId) {
      checkFriendshipStatus();
    }
  }, [targetUserId]);

  const checkFriendshipStatus = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiService.checkFriendshipStatus(targetUserId);
      
      if (response.success) {
        setFriendshipStatus(response.status);
        if (response.requestId) {
          setRequestId(response.requestId);
        }
      }
    } catch (error) {
      console.error('Error checking friendship status:', error);
      setError('Failed to check friendship status');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async () => {
    try {
      setLoading(true);
      setError('');
      
      const currentUser = apiService.getUser();
      
      const response = await apiService.request('/friends/add', {
        method: 'POST',
        body: JSON.stringify({ friendId: targetUserId })
      });
      
      if (response.success) {
        const updatedUser = {
          ...currentUser,
          friends: [...(currentUser.friends || []), targetUserId]
        };
        apiService.setUser(updatedUser);
        
        setFriendshipStatus('friends');
        if (onFriendshipChange) {
          onFriendshipChange('friends');
        }
      } else {
        setError(response.message || 'Failed to add friend');
      }
    } catch (error) {
      console.error('Error adding friend:', error);
      setError('Failed to add friend');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFriend = async () => {
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
        
        setFriendshipStatus('none');
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

  const handleAcceptFriendRequest = async () => {
    if (!requestId) {
      setError('Request ID not found');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await apiService.acceptFriendRequest(requestId);
      
      if (response.success) {
        setFriendshipStatus('friends');
        if (onFriendshipChange) {
          onFriendshipChange('friends');
        }
      } else {
        setError(response.message || 'Failed to accept friend request');
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
      setError('Failed to accept friend request');
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineFriendRequest = async () => {
    if (!requestId) {
      setError('Request ID not found');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await apiService.declineFriendRequest(requestId);
      
      if (response.success) {
        setFriendshipStatus('none');
        if (onFriendshipChange) {
          onFriendshipChange('none');
        }
      } else {
        setError(response.message || 'Failed to decline friend request');
      }
    } catch (error) {
      console.error('Error declining friend request:', error);
      setError('Failed to decline friend request');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Button variant="disabled" icon={Clock} disabled>
        Loading...
      </Button>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2">
        <span className="text-red-400 text-sm">{error}</span>
        <Button variant="secondary" onClick={checkFriendshipStatus}>
          Retry
        </Button>
      </div>
    );
  }

  switch (friendshipStatus) {
    case 'self':
      return null;
    
    case 'friends':
      return (
        <Button
          variant="secondary"
          icon={X}
          onClick={handleRemoveFriend}
          disabled={loading}
        >
          Remove Friend
        </Button>
      );
    
    case 'sent':
      return (
        <Button variant="disabled" icon={Clock} disabled>
          Request Sent
        </Button>
      );
    
    case 'received':
      return (
        <div className="flex gap-2">
          <Button
            variant="primary"
            icon={Check}
            onClick={handleAcceptFriendRequest}
          >
            Accept
          </Button>
          <Button
            variant="secondary"
            icon={X}
            onClick={handleDeclineFriendRequest}
          >
            Decline
          </Button>
        </div>
      );
    
    default:
      return (
        <Button
          variant="primary"
          icon={UserPlus}
          onClick={handleAddFriend}
          disabled={loading}
        >
          Add Friend
        </Button>
      );
  }
};

export default AddFriend;
