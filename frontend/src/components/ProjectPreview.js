import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

// Export mock data for use in other components
export const defaultActivities = [
  { id: 1, user: { name: 'WraithRunner', avatar: '👻', isOnline: true }, action: 'checked in', project: { id: '1', name: 'Battle Royale Engine', description: 'Fixed hitbox detection', stars: 15, forks: 5, lastUpdated: '2 hours ago' }, message: 'Fixed hitbox detection', timestamp: '2 hours ago', projectImage: '🎮', likes: 15, type: 'checkin' },
  { id: 2, user: { name: 'OctaneSpeed', avatar: '⚡', isOnline: true }, action: 'created', project: { id: '2', name: 'Jump Pad Physics', description: 'New project for movement', stars: 8, forks: 3, lastUpdated: '4 hours ago' }, message: 'New project for movement', timestamp: '4 hours ago', projectImage: '🚀', likes: 8, type: 'create' },
  { id: 3, user: { name: 'PathfinderBot', avatar: '🤖', isOnline: false }, action: 'checked out', project: { id: '3', name: 'Zipline Simulator', description: 'Working on trajectory', stars: 12, forks: 4, lastUpdated: '6 hours ago' }, message: 'Working on trajectory', timestamp: '6 hours ago', projectImage: '📐', likes: 12, type: 'checkout' },
  { id: 4, user: { name: 'LifelineDoc', avatar: '🏥', isOnline: true }, action: 'updated', project: { id: '4', name: 'Healing Algorithm', description: 'Optimized health regeneration', stars: 20, forks: 6, lastUpdated: '8 hours ago' }, message: 'Optimized health regeneration', timestamp: '8 hours ago', projectImage: '💊', likes: 20, type: 'update' },
  { id: 5, user: { name: 'GibraltarShield', avatar: '🛡️', isOnline: true }, action: 'checked in', project: { id: '5', name: 'Defense Protocol', description: 'Added dome shield cooldown', stars: 18, forks: 5, lastUpdated: '12 hours ago' }, message: 'Added dome shield cooldown', timestamp: '12 hours ago', projectImage: '⚡', likes: 18, type: 'checkin' },
  { id: 6, user: { name: 'BloodhoundTracker', avatar: '👁️', isOnline: false }, action: 'forked', project: { id: '6', name: 'Scan Detection System', description: 'Created improved tracking', stars: 22, forks: 7, lastUpdated: '1 day ago' }, message: 'Created improved tracking', timestamp: '1 day ago', projectImage: '🔍', likes: 22, type: 'fork' }
];

const ProjectPreview = ({ activity }) => {
  const navigate = useNavigate();

  // Use provided activity or first default activity
  const currentActivity = activity || defaultActivities[0];

  const handleProjectClick = () => {
    navigate(`/projects/${currentActivity.project.id}`);
  };

  const handleUserClick = (e) => {
    e.stopPropagation(); // Prevent project navigation when clicking user
    // Navigate to user profile when implemented
    // navigate(`/profile/${currentActivity.user.id}`);
  };

  const formatTimeAgo = (timestamp) => {
    return timestamp; // Already formatted in mock data
  };

  const getActionColor = (type) => {
    const colors = {
      checkin: '#00ff88',
      checkout: '#ff6b35', 
      create: '#8b0000',
      update: '#00bfff',
      fork: '#ff3333'
    };
    return colors[type] || '#666';
  };

  const getActionIcon = (type) => {
    const icons = {
      checkin: '📥',
      checkout: '📤',
      create: '✨',
      update: '🔄',
      fork: '🔀'
    };
    return icons[type] || '📋';
  };

  return (
    <div className="activity-item" onClick={handleProjectClick} style={{ cursor: 'pointer' }}>
      {/* Activity Header */}
      <div className="activity-header">
        <div className="user-info" onClick={handleUserClick}>
          <div className="user-avatar">
            <span className="avatar-emoji">{currentActivity.user.avatar}</span>
            {currentActivity.user.isOnline && <div className="online-indicator"></div>}
          </div>
          <div className="user-details">
            <div className="user-name">{currentActivity.user.name}</div>
            <div className="activity-time">{formatTimeAgo(currentActivity.timestamp)}</div>
          </div>
        </div>
        <div 
          className="action-badge" 
          style={{ backgroundColor: getActionColor(currentActivity.type) }}
        >
          {getActionIcon(currentActivity.type)} {currentActivity.action}
        </div>
      </div>

      {/* Project Information */}
      <div className="activity-content">
        <div className="project-info">
          <div className="project-image">{currentActivity.projectImage}</div>
          <div className="project-details">
            <div className="project-name">{currentActivity.project.name}</div>
            <div className="activity-message">{currentActivity.message}</div>
          </div>
        </div>
      </div>

      {/* Activity Footer */}
      <div className="activity-footer">
        <button 
          className="like-button"
          onClick={(e) => {
            e.stopPropagation();
            console.log('Liked project:', currentActivity.project.id);
          }}
        >
          ❤️ {currentActivity.likes}
        </button>
        <button 
          className="comment-button"
          onClick={(e) => {
            e.stopPropagation();
            console.log('Comment on:', currentActivity.project.id);
          }}
        >
          💬 Comment
        </button>
        <button 
          className="share-button"
          onClick={(e) => {
            e.stopPropagation();
            console.log('Share project:', currentActivity.project.id);
          }}
        >
          🔗 Share
        </button>
        
        {/* Quick Action Buttons */}
        <div className="quick-actions">
          <button 
            className="quick-action-btn view-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleProjectClick();
            }}
            title="View Project"
          >
            👁️ View
          </button>
          
          {currentActivity.type !== 'fork' && (
            <button 
              className="quick-action-btn fork-btn"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Fork project:', currentActivity.project.id);
              }}
              title="Fork Project"
            >
              🔀 Fork
            </button>
          )}
        </div>
      </div>

      {/* Hover Effect Indicator */}
      <div className="project-hover-indicator">
        <span>Click to view project details</span>
      </div>
    </div>
  );
};

export default ProjectPreview;