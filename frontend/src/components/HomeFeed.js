import React, { useState, useEffect } from 'react';
import Search from '../components/Search';
import ProjectPreview, { defaultActivities } from './ProjectPreview';
import '../styles.css';

const HomeFeed = () => {
  const [activeTab, setActiveTab] = useState('local');
  const [sortBy, setSortBy] = useState('date');
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Use defaultActivities from ProjectPreview
    setActivities(defaultActivities);
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