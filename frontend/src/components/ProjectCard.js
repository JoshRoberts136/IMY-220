import React, { useState } from 'react';
import Files from './Files';
import Messages from './Messages';
import EditProject from './EditProject';
import LanguageTags from './LanguageTags';
import ActivityFeed from './ActivityFeed';
import '../styles.css';
import { User, Trophy, Edit3, Plus } from 'lucide-react';

const ProjectCard = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [project, setProject] = useState({
    id: '1',
    name: 'Battle Royale Engine',
    description: 'A high-performance battle royale game engine with advanced hitbox detection, real-time physics, and optimized networking for 100+ players.',
    image: '🎮',
    owner: { name: 'WraithRunner', avatar: '👻', isOnline: true },
    members: [
      { name: 'WraithRunner', avatar: '👻', role: 'Project Lead', isOnline: true },
      { name: 'PathfinderBot', avatar: '🤖', role: 'AI Developer', isOnline: false },
      { name: 'OctaneSpeed', avatar: '⚡', role: 'Physics Engineer', isOnline: true },
    ],
    stats: { stars: 15, forks: 5, commits: 150, issues: 3 },
    tags: ['Game Engine', 'Real-time', 'Multiplayer'],
    languages: ['JavaScript', 'Python', 'C++'],
    visibility: 'public',
    repository: 'https://github.com/wraith/battle-royale-engine',
    created: '3 months ago',
    lastUpdated: '2 hours ago',
  });

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
              className="button-placeholder"
              onClick={handleEditProject}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--apex-orange)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '10px 20px',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--apex-orange)';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(139, 0, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = 'var(--apex-orange)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
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
                className="member-card"
                onClick={() => {
                    // Placeholder for routing to /profile/{member.name} (e.g., using react-router-dom: history.push(`/profile/${member.name}`))
                    console.log(`Navigate to profile of ${member.name}`);
                }}
                style={{ cursor: 'pointer' }}
                >
                <div className="member-avatar">
                    <span className="avatar-emoji">{member.avatar}</span>
                    {member.isOnline && <div className="online-indicator"></div>}
                    {member.name === project.owner.name && <span style={{ marginLeft: '5px' }}>👑</span>}
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
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'linear-gradient(45deg, #00ff88, #00cc6a)',
          color: 'white',
          padding: '15px 25px',
          borderRadius: '8px',
          zIndex: 2000,
          boxShadow: '0 8px 25px rgba(0, 255, 136, 0.3)',
          fontFamily: 'Rajdhani, sans-serif',
          fontWeight: '700',
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'slideInRight 0.3s ease-out'
        }}>
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