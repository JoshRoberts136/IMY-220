import React, { useState, useEffect } from 'react';
import ProjectPreview from './ProjectPreview';
import apiService from '../utils/apiService';
import '../styles.css';

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
      console.log('Projects in ProjectsSection:', response);
      if (response.success) {
        setProjects(response.projects || []);
      } else {
        // Fallback to dummy data
        setProjects([
          {
            _id: '1',
            name: 'E-Commerce Beast',
            description: 'Full-stack e-commerce platform with real-time inventory',
            stars: 42,
            forks: 18,
            lastUpdated: '2 hours ago',
            ownedBy: userId || apiService.getUser()?.id,
            ownerName: apiService.getUser()?.username || 'You',
            ownerAvatar: '💻',
            members: [userId || apiService.getUser()?.id]
          },
          {
            _id: '2',
            name: 'AI Chat Companion',
            description: 'React-based chat interface with AI integration',
            stars: 28,
            forks: 12,
            lastUpdated: '1 day ago',
            ownedBy: userId || apiService.getUser()?.id,
            ownerName: apiService.getUser()?.username || 'You',
            ownerAvatar: '🤖',
            members: [userId || apiService.getUser()?.id]
          },
          {
            _id: '3',
            name: 'Code Arena Platform',
            description: 'Collaborative coding platform for teams',
            stars: 156,
            forks: 67,
            lastUpdated: '3 days ago',
            ownedBy: 'other_user',
            ownerName: 'TeamLead',
            ownerAvatar: '👤',
            members: [userId || apiService.getUser()?.id, 'other_user']
          },
          {
            _id: '4',
            name: 'Data Visualization Suite',
            description: 'Interactive charts and graphs library',
            stars: 89,
            forks: 34,
            lastUpdated: '1 week ago',
            ownedBy: 'another_user',
            ownerName: 'DataGuru',
            ownerAvatar: '📊',
            members: [userId || apiService.getUser()?.id, 'another_user']
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredProjects = () => {
    const currentUser = apiService.getUser();
    const targetUserId = userId || currentUser?.id;
    const targetUserIdAlt = currentUser?._id?.toString();
    
    if (!targetUserId) return [];

    console.log('=== FILTERING DEBUG ===');
    console.log('targetUserId:', targetUserId);
    console.log('targetUserIdAlt:', targetUserIdAlt);
    console.log('activeTab:', activeTab);
    console.log('Total projects:', projects.length);
    
    // Log each project's ownedBy field
    projects.forEach((p, index) => {
      console.log(`Project ${index}: "${p.name}" ownedBy:`, p.ownedBy);
      console.log(`  - Matches targetUserId? ${p.ownedBy === targetUserId}`);
      console.log(`  - Matches targetUserIdAlt? ${p.ownedBy === targetUserIdAlt}`);
    });

    if (activeTab === 'owned') {
      const owned = projects.filter(p => 
        p.ownedBy === targetUserId || 
        p.ownedBy === targetUserIdAlt ||
        (targetUserIdAlt && p.ownedBy?.toString() === targetUserIdAlt)
      );
      console.log('Owned projects found:', owned.length);
      console.log('Owned projects:', owned);
      return owned;
    } else {
      const member = projects.filter(p => {
        const isMember = p.members && (
          p.members.includes(targetUserId) || 
          (targetUserIdAlt && p.members.includes(targetUserIdAlt))
        );
        const isNotOwner = p.ownedBy !== targetUserId && 
                          p.ownedBy !== targetUserIdAlt &&
                          (!targetUserIdAlt || p.ownedBy?.toString() !== targetUserIdAlt);
        return isMember && isNotOwner;
      });
      console.log('Member projects found:', member.length);
      console.log('Member projects:', member);
      return member;
    }
  };

  const getMemberProjectsCount = () => {
    const currentUser = apiService.getUser();
    const targetUserId = userId || currentUser?.id;
    const targetUserIdAlt = currentUser?._id?.toString();
    
    if (!targetUserId) return 0;
    
    return projects.filter(p => {
      const isMember = p.members && (
        p.members.includes(targetUserId) || 
        (targetUserIdAlt && p.members.includes(targetUserIdAlt))
      );
      const isNotOwner = p.ownedBy !== targetUserId && 
                        p.ownedBy !== targetUserIdAlt &&
                        (!targetUserIdAlt || p.ownedBy?.toString() !== targetUserIdAlt);
      return isMember && isNotOwner;
    }).length;
  };

  const projectActivities = getFilteredProjects().map(project => ({
    id: project._id || project.id,
    user: { 
      name: project.ownerName || 'Unknown', 
      avatar: project.ownerAvatar || '👤', 
      isOnline: true 
    },
    action: activeTab === 'owned' ? 'owns' : 'member of',
    project: {
      id: project._id || project.id,
      name: project.name,
      description: project.description,
      stars: project.stars || 0,
      forks: project.forks || 0,
      lastUpdated: project.lastUpdated,
    },
    message: project.description,
    timestamp: project.lastUpdated || 'recently',
    projectImage: '📂',
    likes: project.stars || 0,
    type: activeTab === 'owned' ? 'create' : 'update',
  }));

  if (loading) {
    return (
      <div className="content-section">
        <div className="section-title">Projects</div>
        <div className="loading-projects-message">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="content-section projects-section-container">
      <div className="section-title">Projects</div>
      
      <div className="tabs-placeholder">
        <button
          className={`tab-placeholder ${activeTab === 'owned' ? 'active' : ''}`}
          onClick={() => setActiveTab('owned')}
        >
          Owned ({activeTab === 'owned' ? getFilteredProjects().length : projects.filter(p => {
            const currentUser = apiService.getUser();
            const targetUserId = userId || currentUser?.id;
            const targetUserIdAlt = currentUser?._id?.toString();
            return p.ownedBy === targetUserId || p.ownedBy === targetUserIdAlt || (targetUserIdAlt && p.ownedBy?.toString() === targetUserIdAlt);
          }).length})
        </button>
        <button
          className={`tab-placeholder ${activeTab === 'member' ? 'active' : ''}`}
          onClick={() => setActiveTab('member')}
        >
          Member ({activeTab === 'member' ? getFilteredProjects().length : getMemberProjectsCount()})
        </button>
      </div>
      
      <div className="scrollable-content">
        {projectActivities.length > 0 ? (
          projectActivities.map((activity) => (
            <ProjectPreview key={activity.id} activity={activity} />
          ))
        ) : (
          <div className="no-projects-message">
            No {activeTab} projects yet
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsSection;
