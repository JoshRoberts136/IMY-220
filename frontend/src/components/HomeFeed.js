import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Search from '../components/Search';
import ActivityFeed from '../components/ActivityFeed';
import ProjectCard from '../components/ProjectCard';
import '../styles.css';
import ProjectPreview from './ProjectPreview';

const HomeFeed = () => {
  const [activeTab, setActiveTab] = useState('local');
  const [sortBy, setSortBy] = useState('date');
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  const mockActivities = [
    { id: 1, user: { name: 'WraithRunner', avatar: '👻', isOnline: true }, action: 'checked in', project: { id: '1', name: 'Battle Royale Engine', description: 'Fixed hitbox detection', stars: 15, forks: 5, lastUpdated: '2 hours ago' }, message: 'Fixed hitbox detection', timestamp: '2 hours ago', projectImage: '🎮', likes: 15, type: 'checkin' },
    { id: 2, user: { name: 'OctaneSpeed', avatar: '⚡', isOnline: true }, action: 'created', project: { id: '2', name: 'Jump Pad Physics', description: 'New project for movement', stars: 8, forks: 3, lastUpdated: '4 hours ago' }, message: 'New project for movement', timestamp: '4 hours ago', projectImage: '🚀', likes: 8, type: 'create' },
    { id: 3, user: { name: 'PathfinderBot', avatar: '🤖', isOnline: false }, action: 'checked out', project: { id: '3', name: 'Zipline Simulator', description: 'Working on trajectory', stars: 12, forks: 4, lastUpdated: '6 hours ago' }, message: 'Working on trajectory', timestamp: '6 hours ago', projectImage: '📐', likes: 12, type: 'checkout' },
    { id: 4, user: { name: 'LifelineDoc', avatar: '🏥', isOnline: true }, action: 'updated', project: { id: '4', name: 'Healing Algorithm', description: 'Optimized health regeneration', stars: 20, forks: 6, lastUpdated: '8 hours ago' }, message: 'Optimized health regeneration', timestamp: '8 hours ago', projectImage: '💊', likes: 20, type: 'update' },
    { id: 5, user: { name: 'GibraltarShield', avatar: '🛡️', isOnline: true }, action: 'checked in', project: { id: '5', name: 'Defense Protocol', description: 'Added dome shield cooldown', stars: 18, forks: 5, lastUpdated: '12 hours ago' }, message: 'Added dome shield cooldown', timestamp: '12 hours ago', projectImage: '⚡', likes: 18, type: 'checkin' },
    { id: 6, user: { name: 'BloodhoundTracker', avatar: '👁️', isOnline: false }, action: 'forked', project: { id: '6', name: 'Scan Detection System', description: 'Created improved tracking', stars: 22, forks: 7, lastUpdated: '1 day ago' }, message: 'Created improved tracking', timestamp: '1 day ago', projectImage: '🔍', likes: 22, type: 'fork' }
  ];

  useEffect(() => {
    setActivities(mockActivities);
  }, []);

  const filteredActivities = activities
    .filter(activity => activeTab === 'local' ? activity.user.name !== 'BloodhoundTracker' : true)
    .sort((a, b) => sortBy === 'popularity' ? b.likes - a.likes : b.id - a.id);

  return (
    <div className="homefeed-container">
      <div className="feed-controls">
        <div className="feed-tabs">
          <button className={`feed-tab ${activeTab === 'local' ? 'active' : ''}`} onClick={() => setActiveTab('local')}>Squad Feed</button>
          <button className={`feed-tab ${activeTab === 'global' ? 'active' : ''}`} onClick={() => setActiveTab('global')}>Arena Feed</button>
        </div>
        <Search />
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
          <ProjectPreview key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
};

export default HomeFeed;