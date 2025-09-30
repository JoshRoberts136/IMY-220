import React, { useState, useEffect } from 'react';
import Search from '../components/Search';
import ProjectPreview from './ProjectPreview';
import apiService from '../utils/apiService';
import '../styles.css';

const HomeFeed = () => {
  const [activeTab, setActiveTab] = useState('local');
  const [sortBy, setSortBy] = useState('date');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    fetchProjects();
    fetchFriends();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await apiService.getProjects();
      if (response.success) {
        setProjects(response.projects || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await apiService.getFriends();
      if (response.success) {
        setFriends(response.friends || []);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const getFilteredProjects = () => {
    if (activeTab === 'global') {
      // Arena Feed - show all projects
      return projects;
    } else {
      // Squad Feed - show only friends' projects
      const friendIds = friends.map(friend => friend.id || friend._id);
      return projects.filter(project => friendIds.includes(project.ownedBy));
    }
  };

  if (loading) {
    return <div className="homefeed-container">Loading projects...</div>;
  }

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
        {getFilteredProjects().map((project) => {
          const activity = {
            id: project._id,
            user: { 
              name: project.ownerName || 'Unknown', 
              avatar: project.ownerAvatar || '👤', 
              isOnline: true 
            },
            action: 'created',
            project: {
              id: project._id,
              name: project.name,
              description: project.description
            },
            message: project.description,
            timestamp: '1 day ago',
            projectImage: '💻',
            likes: project.likes || 0,
            type: 'create'
          };
          return <ProjectPreview key={project._id} activity={activity} />;
        })}
      </div>
    </div>
  );
};

export default HomeFeed;