import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const ProjectPreview = ({ activity }) => {
  const navigate = useNavigate();

  return (
    <div className="activity-item">
      <div className="activity-header">
        <div className="user-info">
          <div className="user-avatar">
            <span className="avatar-emoji">{activity.user.avatar}</span>
            {activity.user.isOnline && <div className="online-indicator"></div>}
          </div>
          <div className="user-details">
            <div className="user-name">{activity.user.name}</div>
            <div className="activity-time">{activity.timestamp}</div>
          </div>
        </div>
        <div className="action-badge" style={{ backgroundColor: ({ checkin: '#00ff88', checkout: '#ff6b35', create: '#8b0000', update: '#00bfff', fork: '#ff3333' }[activity.type] || '#666') }}>
          {({ checkin: '📥', checkout: '📤', create: '✨', update: '🔄', fork: '🔀' }[activity.type] || '📋')} {activity.action}
        </div>
      </div>
      <div className="activity-content">
        <div className="project-info">
          <div className="project-image">{activity.projectImage}</div>
          <div className="project-details">
            <div className="project-name">{activity.project.name}</div>
            <div className="activity-message">{activity.message}</div>
          </div>
        </div>
      </div>
      <div className="activity-footer">
        <button className="like-button">❤️ {activity.likes}</button>
        <button className="comment-button">💬 Comment</button>
        <button className="share-button">🔗 Share</button>
      </div>
    </div>
  );
};

export default ProjectPreview;