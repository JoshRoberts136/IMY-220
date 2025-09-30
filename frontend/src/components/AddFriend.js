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
      <button className="btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.7, cursor: 'not-allowed' }} disabled>
        <Clock style={{ width: '16px', height: '16px' }} />
        Loading...
      </button>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ color: '#ff6b6b', fontSize: '14px' }}>{error}</span>
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
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.7, cursor: 'not-allowed' }} disabled>
          <Check style={{ width: '16px', height: '16px' }} />
          Friends
        </button>
      );
    
    case 'sent':
      return (
        <button className="btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.7, cursor: 'not-allowed' }} disabled>
          <Clock style={{ width: '16px', height: '16px' }} />
          Request Sent
        </button>
      );
    
    case 'received':
      return (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={handleAcceptFriendRequest}
          >
            <Check style={{ width: '16px', height: '16px' }} />
            Accept
          </button>
          <button
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={handleDeclineFriendRequest}
          >
            <X style={{ width: '16px', height: '16px' }} />
            Decline
          </button>
        </div>
      );
    
    default:
      return (
        <button
          className="btn"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          onClick={handleSendFriendRequest}
          disabled={loading}
        >
          <UserPlus style={{ width: '16px', height: '16px' }} />
          Add Friend
        </button>
      );
  }
};

export default AddFriend;
