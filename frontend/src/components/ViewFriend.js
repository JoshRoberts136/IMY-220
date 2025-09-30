import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../utils/apiService';

const ViewFriend = ({ userId }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFriends();
  }, [userId]);

  const fetchFriends = async () => {
    try {
      const response = await apiService.getFriends();
      if (response.success) {
        setFriends(response.friends || []);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
      // Fallback to dummy data
      setFriends([
    {
      id: 1,
      username: 'AlexCode92',
      status: 'online',
      avatar: '👨‍💻',
      title: 'Frontend Wizard',
      joined: '2022',
      mutualProjects: 3
    },
    {
      id: 2,
      username: 'SarahScript',
      status: 'offline',
      avatar: '👩‍💼',
      title: 'Full-Stack Dev',
      joined: '2021',
      mutualProjects: 5
    },
    {
      id: 3,
      username: 'DevNinja404',
      status: 'online',
      avatar: '🥷',
      title: 'Backend Master',
      joined: '2020',
      mutualProjects: 2
    },
    {
      id: 4,
      username: 'ReactQueen',
      status: 'away',
      avatar: '👸',
      title: 'UI/UX Expert',
      joined: '2023',
      mutualProjects: 1
    },
    {
      id: 5,
      username: 'CodeWizard',
      status: 'online',
      avatar: '🧙‍♂️',
      title: 'Algorithm Sage',
      joined: '2019',
      mutualProjects: 4
    },
    {
      id: 6,
      username: 'ByteHunter',
      status: 'offline',
      avatar: '🏹',
      title: 'Security Pro',
      joined: '2022',
      mutualProjects: 2
    }
      ]);
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
      <div>
        <div className="section-title">Friends</div>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="section-title">Friends ({friends.length})</div>
      <div className="friends-container">
        {friends.map((friend) => (
          <div
            key={friend.id || friend._id}
            className="friend-item"
            onClick={() => handleFriendClick(friend)}
            style={{ cursor: 'pointer' }}
          >
            <div className="friend-avatar">
              {friend.avatar}
              <div className={`friend-status-indicator friend-status-indicator-${friend.status}`}></div>
            </div>
            
            <div className="friend-info">
              <div className="friend-username">
                {friend.username}
              </div>
              <div className="friend-title">
                {friend.profile?.title || friend.title || 'Developer'}
              </div>
              <div className="friend-status-projects">
                <span className={`friend-status-text-${friend.status}`}>
                  {getStatusText(friend.status)}
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
                  // Handle message action
                  console.log(`Message ${friend.username}`);
                }}
              >
                Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewFriend;