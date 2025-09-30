import React, { useState, useEffect } from 'react';
import ProjectPreview from './ProjectPreview';
import apiService from '../utils/apiService';

const ProjectsSection = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('owned');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, [userId]);

  const fetchProjects = async () => {
    try {
      const response = await apiService.getProjects();
      if (response.success) {
        setProjects(response.projects || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([
        {
          name: 'E-Commerce Beast',
          description: 'Full-stack e-commerce platform with real-time inventory',
          stars: 42,
          forks: 18,
          lastUpdated: '2 hours ago',
          role: 'owner',
        },
        {
          name: 'AI Chat Companion',
          description: 'React-based chat interface with AI integration',
          stars: 28,
          forks: 12,
          lastUpdated: '1 day ago',
          role: 'owner',
        },
        {
          name: 'Code Arena Platform',
          description: 'Collaborative coding platform for teams',
          stars: 156,
          forks: 67,
          lastUpdated: '3 days ago',
          role: 'member',
        },
        {
          name: 'Data Visualization Suite',
          description: 'Interactive charts and graphs library',
          stars: 89,
          forks: 34,
          lastUpdated: '1 week ago',
          role: 'member',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredProjects = () => {
    const targetUserId = userId || apiService.getUser()?.id;
    if (!targetUserId) return [];

    if (activeTab === 'owned') {
      return projects.filter(p => p.ownedBy === targetUserId);
    } else {
      return projects.filter(p => 
        p.members && p.members.includes(targetUserId) && p.ownedBy !== targetUserId
      );
    }
  };

  const projectActivities = getFilteredProjects().map(project => ({
    id: project._id,
    user: { 
      name: project.ownerName || 'Unknown', 
      avatar: project.ownerAvatar || '👤', 
      isOnline: true 
    },
    action: activeTab === 'owned' ? 'owns' : 'member of',
    project: {
      id: project._id,
      name: project.name,
      description: project.description,
      stars: project.stars || 0,
      forks: project.forks || 0,
      lastUpdated: project.lastUpdated,
    },
    message: project.description,
    timestamp: project.lastUpdated,
    projectImage: '📂',
    likes: project.stars || 0,
    type: activeTab === 'owned' ? 'create' : 'update',
  }));

  if (loading) {
    return (
      <div className="content-section">
        <div className="section-title">Projects</div>
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="content-section flex flex-col h-full">
      <div className="section-title">Projects</div>
      <div className="flex gap-1 mb-5 bg-black/50 rounded-[10px] p-1">
        <div
          className={`tab-button ${activeTab === 'owned' ? 'tab-button-active' : ''}`}
          onClick={() => setActiveTab('owned')}
        >
          Owned ({getFilteredProjects().length})
        </div>
        <div
          className={`tab-button ${activeTab === 'member' ? 'tab-button-active' : ''}`}
          onClick={() => setActiveTab('member')}
        >
          Member ({projects.filter(p => p.members && p.members.includes(userId || apiService.getUser()?.id) && p.ownedBy !== (userId || apiService.getUser()?.id)).length})
        </div>
      </div>
      <div className="flex-1 overflow-visible">
        <div className="h-full overflow-y-auto pr-2">
          {projectActivities.length > 0 ? (
            projectActivities.slice(0, 3).map((activity) => (
              <ProjectPreview key={activity.id} activity={activity} />
            ))
          ) : (
            <div className="text-center text-gray-400 py-10">
              No {activeTab} projects
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;
