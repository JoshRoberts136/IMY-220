import React, { useState } from 'react';

const ViewFriend = () => {
  const [friends] = useState([
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

  return (
    <div>
      <div className="section-title">Friends ({friends.length})</div>
      <div className="friends-container">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className="friend-item"
          >
            <div className="friend-avatar">
              {friend.avatar}
              <div className="friend-status-indicator" style={{
                background: getStatusColor(friend.status),
                boxShadow: friend.status === 'online' ? '0 0 8px #00ff88' : 'none'
              }}></div>
            </div>
            
            <div className="friend-info">
              <div className="friend-username">
                {friend.username}
              </div>
              <div className="friend-title">
                {friend.title}
              </div>
              <div className="friend-status-projects">
                <span style={{ color: getStatusColor(friend.status) }}>
                  {getStatusText(friend.status)}
                </span>
                <span style={{ color: '#666' }}>•</span>
                <span style={{ color: '#888' }}>
                  {friend.mutualProjects} mutual projects
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