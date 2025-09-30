import React, { useState, useEffect } from 'react';
import { UserPlus, Check, X, Clock } from 'lucide-react';
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
      <button className="apex-button flex items-center gap-2 opacity-70 cursor-not-allowed" disabled>
        <Clock className="w-4 h-4 animate-spin" />
        Loading...
      </button>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2">
        <span className="text-red-500 text-sm">{error}</span>
        <button
          className="apex-button-secondary"
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
        <button className="apex-button apex-button-primary flex items-center gap-2 opacity-70 cursor-not-allowed" disabled>
          <Check className="w-4 h-4" />
          Friends
        </button>
      );
    
    case 'sent':
      return (
        <button className="apex-button flex items-center gap-2 opacity-70 cursor-not-allowed" disabled>
          <Clock className="w-4 h-4" />
          Request Sent
        </button>
      );
    
    case 'received':
      return (
        <div className="flex gap-2">
          <button
            className="apex-button apex-button-primary flex items-center gap-2"
            onClick={handleAcceptFriendRequest}
          >
            <Check className="w-4 h-4" />
            Accept
          </button>
          <button
            className="apex-button-secondary flex items-center gap-2"
            onClick={handleDeclineFriendRequest}
          >
            <X className="w-4 h-4" />
            Decline
          </button>
        </div>
      );
    
    default:
      return (
        <button
          className="apex-button flex items-center gap-2"
          onClick={handleSendFriendRequest}
          disabled={loading}
        >
          <UserPlus className="w-4 h-4" />
          Add Friend
        </button>
      );
  }
};

export default AddFriend;
