import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../utils/apiService';
import '../styles.css';

const ViewFriend = ({ userId }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFriends();
  }, [userId]);

  const fetchFriends = async () => {
    try {
      
      setLoading(true);
      
      const currentUser = apiService.getUser();
      const currentUserId = currentUser?.id;
      
      const isOwnProfile = !userId || userId === currentUserId;
      
      let friendIds = [];
      
      if (isOwnProfile) {
        const response = await apiService.getFriends();
        
        
        if (response.success) {
          setFriends(response.friends || []);
          return;
        }
      } else {
        const response = await apiService.getUserById(userId);
        
        
        if (response.success) {
          friendIds = response.friends || [];
        }
      }
      
      if (friendIds.length > 0) {
        const friendDetails = [];
        
        for (const friendId of friendIds) {
          try {
            const friendResponse = await apiService.getUserById(friendId);
            if (friendResponse && friendResponse.success !== false) {
              friendDetails.push({
                id: friendResponse.id,
                username: friendResponse.username,
                avatar: friendResponse.profile?.avatar || '👤',
                title: friendResponse.profile?.title || 'Developer',
                status: friendResponse.isActive ? 'online' : 'offline',
                mutualProjects: 0
              });
            }
          } catch (err) {
            
          }
        }
        
        setFriends(friendDetails);
      } else if (!isOwnProfile) {
        setFriends([]);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
      setFriends([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFriendClick = (friend) => {
    const friendId = friend.id || friend._id || friend.username;
    navigate(`/profile/${friendId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#00ff88';
      case 'away': return '#ffa500';
      case 'offline': return '#666666';
      default: return '#666666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'Online';
      case 'away': return 'Away';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="content-section view-friend-section">
        <div className="section-title">Friends</div>
        <div className="loading-friends-message">Loading friends...</div>
      </div>
    );
  }

  return (
    <div className="content-section view-friend-section">
      <div className="section-title">Friends ({friends.length})</div>
      <div className="friends-container">
        {friends.length === 0 ? (
          <div className="no-friends-message">
            No friends yet. Start connecting with other developers!
          </div>
        ) : (
          friends.map((friend) => (
            <div
              key={friend.id || friend._id}
              className="friend-item"
              onClick={() => handleFriendClick(friend)}
            >
              <div className="friend-avatar">
                {friend.avatar || friend.profile?.avatar || '👤'}
                <div 
                  className={`friend-status-indicator friend-status-dot ${friend.status === 'online' ? 'status-online' : friend.status === 'away' ? 'status-away' : 'status-offline'}`}
                ></div>
              </div>
              
              <div className="friend-info">
                <div className="friend-username">
                  {friend.username}
                </div>
                <div className="friend-title">
                  {friend.profile?.title || friend.title || 'Developer'}
                </div>
                <div className="friend-status-projects">
                  <span className={`status-text ${friend.status === 'online' ? 'text-online' : friend.status === 'away' ? 'text-away' : 'text-offline'}`}>
                    {getStatusText(friend.status || 'offline')}
                  </span>
                  <span className="friend-separator">•</span>
                  <span className="friend-projects-count">
                    {friend.mutualProjects || 0} mutual projects
                  </span>
                </div>
              </div>

              <div className="friend-actions">
                <button
                  className="message-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    
                  }}
                >
                  Message
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewFriend;
