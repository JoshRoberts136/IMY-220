import React, { useState, useEffect, useMemo } from 'react';
import { ArrowUpDown } from 'lucide-react';
import Search from '../components/Search';
import ProjectPreview from './ProjectPreview';
import PageContainer from './PageContainer';
import apiService from '../utils/apiService';
import '../styles.css';

const HomeFeed = () => {
  const [activeTab, setActiveTab] = useState('local');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
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

  // Memoize filtered and sorted projects
  const sortedProjects = useMemo(() => {
    // Filter projects
    let filtered = projects;
    if (activeTab === 'local') {
      const friendIds = friends.map(friend => friend.id || friend._id?.toString());
      filtered = projects.filter(project => {
        const projectOwnerId = project.ownedBy || project.id;
        return friendIds.includes(projectOwnerId);
      });
    }
    
    // Sort projects
    const sorted = [...filtered];
    
    switch (sortBy) {
      case 'alphabetical':
        sorted.sort((a, b) => {
          const nameA = (a.name || '').toLowerCase();
          const nameB = (b.name || '').toLowerCase();
          return sortOrder === 'asc' 
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        });
        break;
        
      case 'likes':
        sorted.sort((a, b) => {
          const likesA = a.likes || 0;
          const likesB = b.likes || 0;
          return sortOrder === 'asc' 
            ? likesA - likesB
            : likesB - likesA;
        });
        break;
        
      case 'date':
      default:
        sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return sortOrder === 'asc' 
            ? dateA - dateB
            : dateB - dateA;
        });
        break;
    }
    
    return sorted;
  }, [projects, friends, activeTab, sortBy, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  if (loading) {
    return <PageContainer>Loading projects...</PageContainer>;
  }

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
            <option value="date">Creation Date</option>
            <option value="alphabetical">Alphabetical</option>
            <option value="likes">Likes</option>
          </select>
          <button
            onClick={toggleSortOrder}
            className="sort-order-toggle"
            title={sortOrder === 'asc' ? 'Ascending (click for descending)' : 'Descending (click for ascending)'}
            style={{
              background: 'rgba(139, 0, 0, 0.1)',
              border: '2px solid var(--apex-orange)',
              borderRadius: '6px',
              padding: '8px 12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--apex-orange)',
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: '600',
              fontSize: '14px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--apex-orange)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(139, 0, 0, 0.1)';
              e.currentTarget.style.color = 'var(--apex-orange)';
            }}
          >
            <ArrowUpDown size={16} />
            {sortOrder === 'asc' ? '↑ ASC' : '↓ DESC'}
          </button>
        </div>
      </div>
      
      <div className="flex flex-col gap-4 mt-5">
        {sortedProjects.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            {activeTab === 'local' ? 
              'No projects from your squad yet. Add some friends or switch to Arena Feed!' : 
              'No projects available yet.'}
          </div>
        ) : (
          sortedProjects.map((project) => {
            const activity = {
              id: project._id || project.id,
              user: { 
                id: project.ownedBy || project.owner,
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
              timestamp: new Date(project.createdAt).toLocaleDateString(),
              projectImage: project.image || '💻',
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
