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

  const handleSendFriendRequest = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiService.sendFriendRequest(targetUserId);
      
      if (response.success) {
        setFriendshipStatus('sent');
        if (onFriendshipChange) {
          onFriendshipChange('sent');
        }
      } else {
        setError(response.message || 'Failed to send friend request');
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      setError('Failed to send friend request');
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
        <button className="btn btn-primary btn-disabled" disabled>
          <Check className="icon-sm" />
          Friends
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
            className="btn btn-primary"
            className="btn-with-icon"
            onClick={handleAcceptFriendRequest}
          >
            <Check className="icon-sm" />
            Accept
          </button>
          <button
            className="btn-secondary"
            className="btn-with-icon"
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
          className="btn"
          className="btn-with-icon"
          onClick={handleSendFriendRequest}
          disabled={loading}
        >
          <UserPlus className="icon-sm" />
          Add Friend
        </button>
      );
  }
};

export default AddFriend;
