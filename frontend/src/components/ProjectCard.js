import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Files from './Files';
import Messages from './Messages';
import EditProject from './EditProject';
import LanguageTags from './LanguageTags';
import ActivityFeed from './ActivityFeed';
import apiService from '../utils/apiService';
import '../styles.css';
import { User, Trophy, Edit3, Plus } from 'lucide-react';

const ProjectCard = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [project, setProject] = useState(null);
  const [projectMembers, setProjectMembers] = useState([]);

  const handleEditProject = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectData();
    }
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch project details
      const response = await apiService.getProject(projectId);
      
      if (response.success) {
        // Format project data from database
        const projectData = {
          id: response.id,
          name: response.name,
          description: response.description,
          image: getProjectIcon(response.language),
          owner: {
            id: response.ownedBy,
            name: response.ownerName || 'Unknown',
            avatar: response.ownerAvatar || '👤',
            isOnline: true
          },
          stats: {
            stars: response.stars || 0,
            forks: response.forks || 0,
            commits: response.commits?.length || 0,
            issues: 0
          },
          tags: response.hashtags || [],
          languages: [response.language],
          visibility: response.visibility || 'public',
          repository: response.repository || '',
          created: formatDate(response.createdAt),
          lastUpdated: formatDate(response.lastUpdated),
          members: response.members || [],
          commits: response.commits || [],
          messages: response.messages || []
        };
        
        setProject(projectData);
        
        // Fetch member details if there are members
        if (response.members && response.members.length > 0) {
          fetchMemberDetails(response.members, response.ownedBy);
        }
      } else {
        setError('Project not found');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const fetchMemberDetails = async (memberIds, ownerId) => {
    try {
      const memberDetails = [];
      const uniqueMemberIds = new Set(memberIds);
      
      // Fetch details for each unique member
      for (const memberId of uniqueMemberIds) {
        try {
          const userResponse = await apiService.getUserById(memberId);
          
          if (userResponse && userResponse.success !== false) {
            // Check if this is the owner
            const isOwner = memberId === ownerId;
            
            memberDetails.push({
              id: userResponse.id || memberId,
              name: userResponse.username || 'Unknown User',
              avatar: userResponse.profile?.avatar || '👤',
              role: isOwner ? 'Project Owner' : 'Team Member',
              isOnline: Math.random() > 0.5 // Random online status for demo
            });
          }
        } catch (err) {
          console.log(`Could not fetch member ${memberId}:`, err.message);
        }
      }
      
      // Sort so owner is always first
      memberDetails.sort((a, b) => {
        if (a.role === 'Project Owner') return -1;
        if (b.role === 'Project Owner') return 1;
        return 0;
      });
      
      console.log('Fetched member details:', memberDetails);
      setProjectMembers(memberDetails);
      setProject(prev => ({ ...prev, members: memberDetails }));
    } catch (error) {
      console.error('Error fetching member details:', error);
    }
  };

  const getProjectIcon = (language) => {
    const icons = {
      'JavaScript': '⚡',
      'TypeScript': '📘',
      'Python': '🐍',
      'Java': '☕',
      'C++': '⚙️',
      'C#': '🎮',
      'Go': '🐹',
      'Rust': '🦀',
      'Ruby': '💎',
      'PHP': '🐘',
      'Swift': '🦉',
      'Kotlin': '🟣',
      'React': '⚛️',
      'Vue': '💚',
      'Angular': '🔺',
      'Solidity': '⟠',
      'default': '📁'
    };
    return icons[language] || icons.default;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`;
    if (diffInHours < 48) return 'yesterday';
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    if (diffInHours < 720) return `${Math.floor(diffInHours / 168)} weeks ago`;
    return `${Math.floor(diffInHours / 720)} months ago`;
  };

  const handleSaveProject = (updatedProject) => {
    setProject(prevProject => ({
      ...prevProject,
      ...updatedProject,
      lastUpdated: 'just now'
    }));
    console.log('Project updated:', updatedProject);
    
    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  if (loading && projectId) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">⚡ Loading project...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>❌ {error}</h2>
        <button onClick={() => navigate('/home')} className="btn btn-primary">
          Back to Home
        </button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="error-container">
        <h2>❌ Project not found</h2>
        <button onClick={() => navigate('/home')} className="btn btn-primary">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="apex-bg">
        <div className="hex-pattern"></div>
      </div>
      
      <div className="project-hero">
        <div className="project-info">
            <div>
                <div>
            <h1 className="project-title">{project.name}</h1>
            <p className="project-description">{project.description}</p>
            <div className="project-meta">
              <span>Created: {project.created}</span>
              <span>Last Updated: {project.lastUpdated}</span>
            </div>
            <div className="project-tags">
              {project.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
            
            <button
              className="edit-project-button"
              onClick={handleEditProject}
            >
                <Edit3 className="w-4 h-4" />
              Edit Project
              
            </button>
                </div>
                <LanguageTags />
            </div>
            <div>
                <div className="sidebar">
            <h3 className="section-title">Squad Members</h3>
            {projectMembers.length > 0 ? (
              projectMembers.map((member, index) => (
                <div
                  key={index}
                  className="member-card member-card-cursor"
                  onClick={() => {
                    navigate(`/profile/${member.id}`);
                  }}
                >
                  <div className="member-avatar">
                    <span className="avatar-emoji">{member.avatar}</span>
                    {member.isOnline && <div className="online-indicator"></div>}
                    {member.role === 'Project Owner' && <span className="crown-indicator">👑</span>}
                  </div>
                  <div className="member-info">
                    <div className="member-name">{member.name}</div>
                    <div className="member-role">{member.role}</div>
                  </div>
                  <div className="member-status">
                    {member.isOnline ? '🟢' : '⚫'}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400">No members yet</div>
            )}
            <button className="btn btn-secondary">➕ Add Member</button>
                </div>
            </div>
            
        </div>
        
      </div>

      <div className="grid-2">
        <div>
            
            <Files projectId={project.id} project={project} onCommitCreated={fetchProjectData} />
        </div>
        
        <div>
            
          <Messages />
          <div className="project-stats-bar">
            <div className="stat-group">
                <span className="stat-value">{project.stats.stars}</span>
                <span className="stat-label">Stars</span>
            </div>
            <div className="stat-group">
                <span className="stat-value">{project.stats.forks}</span>
                <span className="stat-label">Forks</span>
            </div>
            <div className="stat-group">
                <span className="stat-value">{project.stats.commits}</span>
                <span className="stat-label">Commits</span>
            </div>
            <div className="stat-group">
                <span className="stat-value">{project.stats.issues}</span>
                <span className="stat-label">Issues</span>
            </div>
          </div>
        </div>
      </div>

      {showSuccessMessage && (
        <div className="success-message">
          ✅ Project updated successfully!
        </div>
      )}

      <EditProject 
        isOpen={isEditModalOpen}
        onClose={handleCloseEdit}
        project={project}
        onSave={handleSaveProject}
      />
    </div>
  );
};

export default ProjectCard;