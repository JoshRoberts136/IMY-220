import React, { useState, useEffect } from 'react';
import Search from '../components/Search';
import ProjectPreview from './ProjectPreview';
import PageContainer from './PageContainer';
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
      console.log('Projects response:', response);
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
      console.log('Friends response:', response);
      if (response.success) {
        setFriends(response.friends || []);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const getFilteredProjects = () => {
    if (activeTab === 'global') {
      return projects;
    } else {
      const friendIds = friends.map(friend => friend.id || friend._id?.toString());
      const filtered = projects.filter(project => {
        const projectOwnerId = project.ownedBy || project.id;
        return friendIds.includes(projectOwnerId);
      });
      return filtered;
    }
  };

  if (loading) {
    return <PageContainer>Loading projects...</PageContainer>;
  }

  const filteredProjects = getFilteredProjects();

  return (
    <PageContainer>
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
      
      <div className="flex flex-col gap-4 mt-5">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            {activeTab === 'local' ? 
              'No projects from your squad yet. Add some friends or switch to Arena Feed!' : 
              'No projects available yet.'}
          </div>
        ) : (
          filteredProjects.map((project) => {
            const activity = {
              id: project._id || project.id,
              user: { 
                name: project.ownerName || 'Unknown', 
                avatar: project.ownerAvatar || '👤', 
                isOnline: true 
              },
              action: 'created',
              project: {
                id: project._id || project.id,
                name: project.name,
                description: project.description
              },
              message: project.description,
              timestamp: '1 day ago',
              projectImage: '💻',
              likes: project.likes || 0,
              type: 'create'
            };
            return <ProjectPreview key={project._id || project.id} activity={activity} />;
          })
        )}
      </div>
    </PageContainer>
  );
};

export default HomeFeed;
