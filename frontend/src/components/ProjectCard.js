import React, { useState, useEffect } from 'react';
import Files from './Files';
import Messages from './Messages';
import EditProject from './EditProject';
import LanguageTags from './LanguageTags';
import ActivityFeed from './ActivityFeed';
import apiService from '../utils/apiService';
import '../styles.css';
import { User, Trophy, Edit3, Plus } from 'lucide-react';

const ProjectCard = ({ projectId = 'default' }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        // For now, fetch the first post as an example
        const response = await apiService.getPosts({ limit: 1 });
        if (response.success && response.data.length > 0) {
          const post = response.data[0];
          // Transform post data to project format
          setProject({
            id: post._id,
            name: post.title,
            description: post.content,
            image: '📝',
            owner: {
              name: post.author.username,
              avatar: post.author.profile?.avatar || '👤',
              isOnline: true
            },
            members: [
              {
                name: post.author.username,
                avatar: post.author.profile?.avatar || '👤',
                role: 'Author',
                isOnline: true
              }
            ],
            stats: {
              stars: post.likes?.length || 0,
              forks: 0,
              commits: 0,
              issues: 0
            },
            tags: post.tags || [],
            languages: [post.category || 'General'],
            visibility: post.status === 'published' ? 'public' : 'private',
            repository: '',
            created: new Date(post.createdAt).toLocaleDateString(),
            lastUpdated: new Date(post.updatedAt || post.createdAt).toLocaleDateString(),
          });
        } else {
          setError('No projects found');
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, []);

  const handleEditProject = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditModalOpen(false);
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

  if (loading) {
    return (
      <div>
        <div className="apex-bg">
          <div className="hex-pattern"></div>
        </div>
        <div className="project-hero">
          <div className="text-center text-gray-400">Loading project...</div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div>
        <div className="apex-bg">
          <div className="hex-pattern"></div>
        </div>
        <div className="project-hero">
          <div className="text-center text-red-400">{error || 'Project not found'}</div>
        </div>
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
            {project.members.map((member, index) => (
                <div
                key={index}
                className="member-card member-card-cursor"
                onClick={() => {
                    // Placeholder for routing to /profile/{member.name} (e.g., using react-router-dom: history.push(`/profile/${member.name}`))
                    console.log(`Navigate to profile of ${member.name}`);
                }}
                >
                <div className="member-avatar">
                    <span className="avatar-emoji">{member.avatar}</span>
                    {member.isOnline && <div className="online-indicator"></div>}
                    {member.name === project.owner.name && <span className="crown-indicator">👑</span>}
                </div>
                <div className="member-info">
                    <div className="member-name">{member.name}</div>
                    <div className="member-role">{member.role}</div>
                </div>
                <div className="member-status">
                    {member.isOnline ? '🟢' : '⚫'}
                </div>
                </div>
            ))}
            <button className="btn btn-secondary">➕ Add Member</button>
                </div>
            </div>
            
        </div>
        
      </div>

      <div className="grid-2">
        <div>
            
            <Files />
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

      {}
      {showSuccessMessage && (
        <div className="success-message">
          ✅ Project updated successfully!
        </div>
      )}

      {}
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