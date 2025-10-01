import React, { useState, useEffect } from 'react';
import { UserPlus, Check, X, Clock } from 'lucide-react';
import apiService from '../utils/apiService';
import '../styles.css';

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
      
      // Use the add friend endpoint that directly adds to friends array
      const response = await apiService.request('/friends/add', {
        method: 'POST',
        body: JSON.stringify({ friendId: targetUserId })
      });
      
      if (response.success) {
        // Update both users' friends arrays directly
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
        // Update current user's friends array
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
      <button className="btn btn-loading" disabled>
        <Clock className="icon-sm" />
        Loading...
      </button>
    );
  }

  if (error) {
    return (
      <div className="error-container-inline">
        <span className="error-text">{error}</span>
        <button
          className="btn-secondary"
          onClick={checkFriendshipStatus}
        >
          Retry
        </button>
      </div>
    );
  }

  switch (friendshipStatus) {
    case 'self':
      return null;
    
    case 'friends':
      return (
        <button 
          className="btn btn-secondary btn-with-icon"
          onClick={handleRemoveFriend}
          disabled={loading}
        >
          <X className="icon-sm" />
          Remove Friend
        </button>
      );
    
    case 'sent':
      return (
        <button className="btn btn-disabled" disabled>
          <Clock className="icon-sm" />
          Request Sent
        </button>
      );
    
    case 'received':
      return (
        <div className="button-group">
          <button
            className="btn btn-primary btn-with-icon"
            onClick={handleAcceptFriendRequest}
          >
            <Check className="icon-sm" />
            Accept
          </button>
          <button
            className="btn btn-secondary btn-with-icon"
            onClick={handleDeclineFriendRequest}
          >
            <X className="icon-sm" />
            Decline
          </button>
        </div>
      );
    
    default:
      return (
        <button
          className="btn btn-primary btn-with-icon"
          onClick={handleAddFriend}
          disabled={loading}
        >
          <UserPlus className="icon-sm" />
          Add Friend
        </button>
      );
  }
};

export default AddFriend;
