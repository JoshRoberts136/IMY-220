import React from 'react';
import '../styles.css'; // Import CSS

const QuickActions = ({ onActionClick }) => {
  const actions = [
    { id: 'create-project', label: 'New Arsenal', icon: '⚡', description: 'Create a new project', primary: true },
    { id: 'join-project', label: 'Join Squad', icon: '🤝', description: 'Join an existing project', primary: false },
    { id: 'find-teammates', label: 'Find Legends', icon: '🔍', description: 'Search for teammates', primary: false },
    { id: 'view-profile', label: 'Legend Stats', icon: '📊', description: 'View your profile', primary: false }
  ];

  const handleActionClick = (action) => {
    if (onActionClick) onActionClick(action);
  };

  return (
    <div className="quickactions-container">
      <div className="quickactions-header">
        <h3 className="section-title">Legend Actions</h3>
        <p className="section-subtitle">Quick access to core features</p>
      </div>
      <div className="actions-grid">
        {actions.map((action) => (
          <button
            key={action.id}
            className={`action-button ${action.primary ? 'primary' : 'secondary'}`}
            onClick={() => handleActionClick(action)}
          >
            <div className="action-icon">{action.icon}</div>
            <div className="action-content">
              <div className="action-label">{action.label}</div>
              <div className="action-description">{action.description}</div>
            </div>
          </button>
        ))}
      </div>
      <div className="quick-stats">
        <div className="stat-item">
          <div className="stat-number">12</div>
          <div className="stat-label">Projects</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">45</div>
          <div className="stat-label">Check-ins</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">8</div>
          <div className="stat-label">Squad Members</div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;