import React, { useState, useEffect } from 'react';
import ProjectPreview from './ProjectPreview';
import apiService from '../utils/apiService';
import '../styles.css';

const ProjectsSection = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await apiService.getPosts({ status: 'published', limit: 20 });
        if (response.success) {
          setProjects(response.data);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(p => {
    if (activeTab === 'all') return true;
    // TODO: Filter by current user when authentication is implemented
    // For now, show all projects in both tabs
    return true;
  });

  const projectActivities = filteredProjects.map(project => ({
    id: project._id,
    user: {
      name: project.author.username,
      avatar: project.author.profile?.avatar || '👤',
      isOnline: true
    },
    action: 'created',
    project: {
      id: project._id,
      name: project.title,
      description: project.content,
      stars: project.likes?.length || 0,
      forks: 0,
      lastUpdated: new Date(project.createdAt).toLocaleDateString(),
    },
    message: project.content,
    timestamp: new Date(project.createdAt).toLocaleDateString(),
    projectImage: '📂',
    likes: project.likes?.length || 0,
    type: 'create',
  }));

  if (loading) {
    return (
      <div className="projects-section-container">
        <div className="section-title">Legend's Projects</div>
        <div className="scrollable-section">
          <div className="scrollable-content">
            <div className="text-center text-gray-400">Loading projects...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects-section-container">
        <div className="section-title">Legend's Projects</div>
        <div className="scrollable-section">
          <div className="scrollable-content">
            <div className="text-center text-red-400">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-section-container">
      <div className="section-title">Legend's Projects</div>
      <div className="tabs-placeholder">
        <div
          className={`tab-placeholder ${activeTab === 'all' ? 'active' : ''} tab-cursor`}
          onClick={() => setActiveTab('all')}
        >
          All Projects
        </div>
        <div
          className={`tab-placeholder ${activeTab === 'my' ? 'active' : ''} tab-cursor`}
          onClick={() => setActiveTab('my')}
        >
          My Projects
        </div>
      </div>
      <div className="scrollable-section">
        <div className="scrollable-content">
          {projectActivities.length > 0 ? (
            projectActivities.map((activity) => (
              <ProjectPreview key={activity.id} activity={activity} />
            ))
          ) : (
            <div className="text-center text-gray-400">No projects found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;