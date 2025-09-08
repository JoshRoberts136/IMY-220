import React, { useState } from 'react';
import ProjectPreview from './ProjectPreview';
import '../styles.css';

const ProjectsSection = () => {
  const [activeTab, setActiveTab] = useState('owned');
  const [projects] = useState([
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

  const filteredProjects = projects.filter(p =>
    activeTab === 'owned' ? p.role === 'owner' : p.role === 'member'
  );

  const projectActivities = filteredProjects.map(project => ({
    id: project.name.toLowerCase().replace(/\s/g, '-'),
    user: { name: 'CodeLegend42', avatar: '👤', isOnline: true },
    action: project.role === 'owner' ? 'created' : 'contributed to',
    project: {
      id: project.name.toLowerCase().replace(/\s/g, '-'),
      name: project.name,
      description: project.description,
      stars: project.stars,
      forks: project.forks,
      lastUpdated: project.lastUpdated,
    },
    message: project.description,
    timestamp: project.lastUpdated,
    projectImage: '📂',
    likes: project.stars,
    type: project.role === 'owner' ? 'create' : 'update',
  }));

  return (
    <div className="projects-section-container">
      <div className="section-title">Legend's Projects</div>
      <div className="tabs-placeholder">
        <div
          className={`tab-placeholder ${activeTab === 'owned' ? 'active' : ''} tab-cursor`}
          onClick={() => setActiveTab('owned')}
        >
          Owned
        </div>
        <div
          className={`tab-placeholder ${activeTab === 'member' ? 'active' : ''} tab-cursor`}
          onClick={() => setActiveTab('member')}
        >
          Member
        </div>
      </div>
      <div className="scrollable-section">
        <div className="scrollable-content">
          {projectActivities.map((activity) => (
            <ProjectPreview key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;