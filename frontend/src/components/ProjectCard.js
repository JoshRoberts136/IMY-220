import React from 'react';
import { useParams } from 'react-router-dom';
import Files from './Files';
import Messages from './Messages';
import EditProject from './EditProject';
import LanguageTags from './LanguageTags';
import ActivityFeed from './ActivityFeed';
import '../styles.css';

function ProjectCard() {
  const { projectId } = useParams();

  const getProjectById = (id) => {
    const projects = {
      '1': {
        id: '1',
        name: 'Battle Royale Engine',
        description: 'A high-performance battle royale game engine with advanced hitbox detection, real-time physics, and optimized networking for 100+ players.',
        image: '🎮',
        owner: { name: 'WraithRunner', avatar: '👻', isOnline: true },
        members: [
          { name: 'WraithRunner', avatar: '👻', role: 'Project Lead', isOnline: true },
          { name: 'PathfinderBot', avatar: '🤖', role: 'AI Developer', isOnline: false },
          { name: 'OctaneSpeed', avatar: '⚡', role: 'Physics Engineer', isOnline: true }
        ],
        stats: { stars: 15, forks: 5, commits: 150, issues: 3 },
        tags: ['Game Engine', 'Real-time', 'Multiplayer'],
        created: '3 months ago',
        lastUpdated: '2 hours ago'
      },
      '2': {
        id: '2',
        name: 'Jump Pad Physics',
        description: 'Advanced physics simulation for jump pads with trajectory prediction and momentum conservation.',
        image: '🚀',
        owner: { name: 'OctaneSpeed', avatar: '⚡', isOnline: true },
        members: [
          { name: 'OctaneSpeed', avatar: '⚡', role: 'Lead Developer', isOnline: true },
          { name: 'WraithRunner', avatar: '👻', role: 'Contributor', isOnline: true }
        ],
        stats: { stars: 8, forks: 3, commits: 42, issues: 1 },
        tags: ['Physics', 'Simulation', 'WebGL'],
        created: '1 month ago',
        lastUpdated: '4 hours ago'
      },
      '3': {
        id: '3',
        name: 'Zipline Simulator',
        description: 'Realistic zipline mechanics with advanced trajectory calculations and environmental physics.',
        image: '📐',
        owner: { name: 'PathfinderBot', avatar: '🤖', isOnline: false },
        members: [
          { name: 'PathfinderBot', avatar: '🤖', role: 'Lead Developer', isOnline: false },
          { name: 'WraithRunner', avatar: '👻', role: 'Contributor', isOnline: true }
        ],
        stats: { stars: 12, forks: 4, commits: 56, issues: 2 },
        tags: ['Physics', 'Simulation'],
        created: '2 months ago',
        lastUpdated: '1 day ago'
      },
      // Add more as needed
    };
    return projects[id] || {};
  };

  const project = getProjectById(projectId);

  if (!project.id) {
    return <div>Project not found</div>;
  }

  return (
    <div>
      <div className="apex-bg">
        <div className="hex-pattern"></div>
      </div>
      
      <div className="project-hero">
        <div className="project-info">
          <div className="project-image">{project.image}</div>
          <div>
            <h1 className="project-title">{project.name}</h1>
            <p className="project-description">{project.description}</p>
            <div className="project-meta">
              <span>Owner: {project.owner.name}</span>
              <span>Created: {project.created}</span>
              <span>Last Updated: {project.lastUpdated}</span>
            </div>
            <div className="project-tags">
              {project.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="project-actions">
          <button className="btn">⭐ Star</button>
          <button className="btn">🔀 Fork</button>
          <button className="btn">📥 Clone</button>
        </div>
        
        {/* Enhanced Project Stats */}
        <div className="project-stats-bar">
          <div className="stat-group">
            <span className="stat-value">{project.stats.commits}</span>
            <span className="stat-label">Commits</span>
          </div>
          <div className="stat-group">
            <span className="stat-value">{project.stats.issues}</span>
            <span className="stat-label">Issues</span>
          </div>
          <div className="stat-group">
            <span className="stat-value">{project.members.length}</span>
            <span className="stat-label">Members</span>
          </div>
        </div>
        
        <LanguageTags />
      </div>

      <div className="grid-2">
        <div>
          <div className="wireframe-layout">
            <div className="layout-label">Project Files & Status</div>
            <Files />
          </div>
          <div className="wireframe-layout">
            <div className="layout-label">Project Activity Feed</div>
            <ActivityFeed />
          </div>
        </div>
        
        <div>
          <div className="wireframe-layout">
            <div className="layout-label">Squad Members</div>
            <div className="sidebar">
              <h3 className="section-title">Squad Members ({project.members.length})</h3>
              {project.members.map((member, index) => (
                <div key={index} className="member-card">
                  <div className="member-avatar">
                    <span className="avatar-emoji">{member.avatar}</span>
                    {member.isOnline && <div className="online-indicator"></div>}
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
          
          <div className="wireframe-layout">
            <div className="layout-label">Discussion Board</div>
            <Messages />
          </div>
          
          <div className="wireframe-layout">
            <div className="layout-label">Project Analytics</div>
            <div className="sidebar">
              <h3 className="section-title">Arsenal Analytics</h3>
              <div className="analytics-grid">
                <div className="analytics-item">
                  <div className="analytics-value">⭐ {project.stats.stars}</div>
                  <div className="analytics-label">Stars</div>
                </div>
                <div className="analytics-item">
                  <div className="analytics-value">🔀 {project.stats.forks}</div>
                  <div className="analytics-label">Forks</div>
                </div>
                <div className="analytics-item">
                  <div className="analytics-value">📝 {project.stats.commits}</div>
                  <div className="analytics-label">Commits</div>
                </div>
                <div className="analytics-item">
                  <div className="analytics-value">🐛 {project.stats.issues}</div>
                  <div className="analytics-label">Issues</div>
                </div>
              </div>
            </div>
          </div>
          
          <EditProject />
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;