import React, { useState, useEffect } from 'react';

const HomeFeed = () => {
  const [activeTab, setActiveTab] = useState('local');
  const [sortBy, setSortBy] = useState('date');
  const [activities, setActivities] = useState([]);

  const mockActivities = [
    { id: 1, user: { name: 'WraithRunner', avatar: '👻', isOnline: true }, action: 'checked in', project: 'Battle Royale Engine', message: 'Fixed hitbox detection', timestamp: '2 hours ago', projectImage: '🎮', likes: 15, type: 'checkin' },
    { id: 2, user: { name: 'OctaneSpeed', avatar: '⚡', isOnline: true }, action: 'created', project: 'Jump Pad Physics', message: 'New project for movement', timestamp: '4 hours ago', projectImage: '🚀', likes: 8, type: 'create' },
    { id: 3, user: { name: 'PathfinderBot', avatar: '🤖', isOnline: false }, action: 'checked out', project: 'Zipline Simulator', message: 'Working on trajectory', timestamp: '6 hours ago', projectImage: '📐', likes: 12, type: 'checkout' },
    { id: 4, user: { name: 'LifelineDoc', avatar: '🏥', isOnline: true }, action: 'updated', project: 'Healing Algorithm', message: 'Optimized health regeneration', timestamp: '8 hours ago', projectImage: '💊', likes: 20, type: 'update' },
    { id: 5, user: { name: 'GibraltarShield', avatar: '🛡️', isOnline: true }, action: 'checked in', project: 'Defense Protocol', message: 'Added dome shield cooldown', timestamp: '12 hours ago', projectImage: '⚡', likes: 18, type: 'checkin' },
    { id: 6, user: { name: 'BloodhoundTracker', avatar: '👁️', isOnline: false }, action: 'forked', project: 'Scan Detection System', message: 'Created improved tracking', timestamp: '1 day ago', projectImage: '🔍', likes: 22, type: 'fork' }
  ];

  useEffect(() => {
    setActivities(mockActivities);
  }, []);

  const filteredActivities = activities
    .filter(activity => activeTab === 'local' ? activity.user.name !== 'BloodhoundTracker' : true)
    .sort((a, b) => sortBy === 'popularity' ? b.likes - a.likes : b.id - a.id);

  const getActionIcon = (type) => ({ checkin: '📥', checkout: '📤', create: '✨', update: '🔄', fork: '🔀' }[type] || '📋');
  const getActionColor = (type) => ({ checkin: '#00ff88', checkout: '#ff6b35', create: '#8b0000', update: '#00bfff', fork: '#ff3333' }[type] || '#666');

  return (
    <div className="homefeed-container">
      <div className="feed-controls">
        <div className="feed-tabs">
          <button className={`feed-tab ${activeTab === 'local' ? 'active' : ''}`} onClick={() => setActiveTab('local')}>Squad Feed</button>
          <button className={`feed-tab ${activeTab === 'global' ? 'active' : ''}`} onClick={() => setActiveTab('global')}>Arena Feed</button>
        </div>
        <div className="sort-controls">
          <label htmlFor="sort-select">Sort by:</label>
          <select id="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
            <option value="date">Latest Activity</option>
            <option value="popularity">Most Popular</option>
          </select>
        </div>
      </div>
      <div className="activity-feed">
        {filteredActivities.map((activity) => (
          <div key={activity.id} className="activity-item">
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
              <div className="action-badge" style={{ backgroundColor: getActionColor(activity.type) }}>
                {getActionIcon(activity.type)} {activity.action}
              </div>
            </div>
            <div className="activity-content">
              <div className="project-info">
                <div className="project-image">{activity.projectImage}</div>
                <div className="project-details">
                  <div className="project-name">{activity.project}</div>
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
        ))}
      </div>
      <style jsx>{`
        .homefeed-container { background: #1a1a1a; border-radius: 12px; border: 1px solid #333; overflow: hidden; margin: 20px 0; }
        .feed-controls { display: flex; justify-content: space-between; align-items: center; padding: 20px; background: rgba(20, 20, 20, 0.9); border-bottom: 2px solid #8b0000; }
        .feed-tabs { display: flex; gap: 2px; }
        .feed-tab { padding: 12px 24px; background: transparent; border: 2px solid #4a5568; color: #888; font-family: 'Rajdhani', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 1px; clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%); }
        .feed-tab.active { background: #8b0000; border-color: #8b0000; color: white; }
        .feed-tab:hover:not(.active) { border-color: #8b0000; color: white; }
        .sort-controls { display: flex; align-items: center; gap: 10px; color: #8b0000; font-family: 'Rajdhani', sans-serif; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
        .sort-select { background: rgba(20, 20, 20, 0.9); border: 2px solid #4a5568; border-radius: 6px; color: white; padding: 8px 12px; font-family: 'Rajdhani', sans-serif; font-weight: 600; }
        .sort-select:focus { outline: none; border-color: #8b0000; }
        .activity-feed { padding: 20px; max-height: 600px; overflow-y: auto; }
        .activity-item { background: rgba(45, 55, 72, 0.3); border-left: 4px solid #8b0000; border-radius: 8px; padding: 20px; margin-bottom: 15px; transition: all 0.3s ease; }
        .activity-item:hover { background: rgba(45, 55, 72, 0.5); transform: translateX(5px); }
        .activity-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .user-info { display: flex; align-items: center; gap: 12px; }
        .user-avatar { position: relative; width: 45px; height: 45px; background: rgba(139, 0, 0, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #8b0000; }
        .avatar-emoji { font-size: 20px; }
        .online-indicator { position: absolute; bottom: 2px; right: 2px; width: 12px; height: 12px; background: #00ff88; border-radius: 50%; border: 2px solid #1a1a1a; }
        .user-name { color: white; font-weight: 700; font-size: 16px; }
        .activity-time { color: #888; font-size: 14px; }
        .action-badge { padding: 6px 12px; border-radius: 20px; color: white; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
        .activity-content { margin-bottom: 15px; }
        .project-info { display: flex; gap: 15px; align-items: center; }
        .project-image { width: 60px; height: 60px; background: rgba(139, 0, 0, 0.2); border: 2px solid #8b0000; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
        .project-name { color: #ff3333; font-weight: 700; font-size: 18px; margin-bottom: 5px; cursor: pointer; }
        .project-name:hover { text-decoration: underline; }
        .activity-message { color: #cbd5e0; line-height: 1.5; }
        .activity-footer { display: flex; gap: 20px; }
        .activity-footer button { background: transparent; border: none; color: #888; cursor: pointer; transition: color 0.2s ease; font-family: 'Rajdhani', sans-serif; font-weight: 600; }
        .like-button:hover { color: #ff6b6b; }
        .comment-button:hover { color: #4ecdc4; }
        .share-button:hover { color: #45b7d1; }
        .activity-feed::-webkit-scrollbar { width: 8px; }
        .activity-feed::-webkit-scrollbar-track { background: rgba(20, 20, 20, 0.5); border-radius: 4px; }
        .activity-feed::-webkit-scrollbar-thumb { background: #8b0000; border-radius: 4px; }
        .activity-feed::-webkit-scrollbar-thumb:hover { background: #ff3333; }
        @media (max-width: 768px) { .feed-controls { flex-direction: column; gap: 15px; } .activity-header { flex-direction: column; align-items: flex-start; gap: 10px; } .project-info { flex-direction: column; text-align: center; } .activity-footer { justify-content: center; } }
      `}</style>
    </div>
  );
};

export default HomeFeed;