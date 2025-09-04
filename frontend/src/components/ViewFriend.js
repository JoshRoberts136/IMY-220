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
      <div style={{
        maxHeight: '240px',
        overflowY: 'auto',
        paddingRight: '8px',
        marginBottom: '20px'
      }}>
        {friends.map((friend) => (
          <div
            key={friend.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: 'rgba(45, 55, 72, 0.3)',
              borderRadius: '8px',
              marginBottom: '8px',
              border: '1px solid rgba(139, 0, 0, 0.2)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(45, 55, 72, 0.5)';
              e.target.style.borderColor = 'var(--apex-orange)';
              e.target.style.transform = 'translateX(4px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(45, 55, 72, 0.3)';
              e.target.style.borderColor = 'rgba(139, 0, 0, 0.2)';
              e.target.style.transform = 'translateX(0px)';
            }}
          >
            <div style={{
              position: 'relative',
              width: '40px',
              height: '40px',
              background: 'rgba(139, 0, 0, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--apex-orange)',
              fontSize: '18px',
              flexShrink: 0
            }}>
              {friend.avatar}
              <div style={{
                position: 'absolute',
                bottom: '0px',
                right: '0px',
                width: '12px',
                height: '12px',
                background: getStatusColor(friend.status),
                borderRadius: '50%',
                border: '2px solid #1a1a1a',
                boxShadow: friend.status === 'online' ? '0 0 8px #00ff88' : 'none'
              }}></div>
            </div>
            
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                color: 'white',
                fontWeight: '700',
                fontSize: '14px',
                marginBottom: '2px',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap'
              }}>
                {friend.username}
              </div>
              <div style={{
                color: '#888',
                fontSize: '12px',
                marginBottom: '1px'
              }}>
                {friend.title}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px'
              }}>
                <span style={{ color: getStatusColor(friend.status) }}>
                  {getStatusText(friend.status)}
                </span>
                <span style={{ color: '#666' }}>•</span>
                <span style={{ color: '#888' }}>
                  {friend.mutualProjects} mutual projects
                </span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              alignItems: 'flex-end'
            }}>
              <button
                style={{
                  background: 'rgba(139, 0, 0, 0.1)',
                  border: '1px solid var(--apex-orange)',
                  color: 'var(--apex-orange)',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--apex-orange)';
                  e.target.style.color = 'white';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(139, 0, 0, 0.1)';
                  e.target.style.color = 'var(--apex-orange)';
                  e.target.style.transform = 'translateY(0px)';
                }}
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