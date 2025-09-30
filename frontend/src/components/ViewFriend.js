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
      console.log('Fetching friends...');
      const response = await apiService.getFriends();
      console.log('Friends API response:', response);
      
      if (response.success) {
        setFriends(response.friends || []);
      } else {
        // If API fails, use dummy data
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
          }
        ]);
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
      <div className="content-section" style={{ marginBottom: '20px' }}>
        <div className="section-title">Friends</div>
        <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Loading friends...</div>
      </div>
    );
  }

  return (
    <div className="content-section" style={{ marginBottom: '20px' }}>
      <div className="section-title">Friends ({friends.length})</div>
      <div className="friends-container">
        {friends.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
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
                  className="friend-status-indicator"
                  style={{ 
                    backgroundColor: getStatusColor(friend.status || 'offline'),
                    boxShadow: friend.status === 'online' ? '0 0 8px #00ff88' : 'none'
                  }}
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
                  <span style={{ color: getStatusColor(friend.status || 'offline') }}>
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
                    console.log(`Message ${friend.username}`);
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
