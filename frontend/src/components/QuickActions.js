import React from 'react';

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
      <style jsx>{`
        .quickactions-container { background: #1a1a1a; border-radius: 12px; border: 1px solid #333; padding: 20px; margin: 20px 0; }
        .quickactions-header { margin-bottom: 20px; }
        .section-title { color: #ff3333; font-family: 'Rajdhani', sans-serif; font-weight: 700; margin: 0; }
        .section-subtitle { color: #888; font-size: 14px; margin: 5px 0 0; }
        .actions-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px; }
        .action-button { background: rgba(20, 20, 20, 0.9); border: 2px solid #4a5568; border-radius: 8px; padding: 15px; text-align: left; cursor: pointer; transition: all 0.3s ease; }
        .action-button.primary { border-color: #8b0000; }
        .action-button:hover { border-color: #ff3333; transform: translateY(-2px); }
        .action-icon { font-size: 24px; margin-bottom: 10px; }
        .action-content { text-align: center; }
        .action-label { color: white; font-weight: 600; font-size: 16px; }
        .action-description { color: #888; font-size: 12px; }
        .quick-stats { display: flex; justify-content: space-around; padding: 15px; background: rgba(45, 55, 72, 0.3); border-radius: 8px; }
        .stat-item { text-align: center; }
        .stat-number { color: #ff3333; font-size: 24px; font-weight: 700; }
        .stat-label { color: #888; font-size: 12px; text-transform: uppercase; }
      `}</style>
    </div>
  );
};

export default QuickActions;