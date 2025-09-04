import React, { useState } from 'react';
import ProjectCard from './ProjectCard';
import '../styles.css';

const ProjectsSection = ({ projects }) => {
  const [activeTab, setActiveTab] = useState('owned');

  const filteredProjects = projects.filter(p =>
    activeTab === 'owned' ? p.role === 'owner' : p.role === 'member'
  );

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-red-900">
      <h3 className="text-xl font-semibold text-red-500 mb-4">Legend's Projects</h3>
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('owned')}
          className={`px-4 py-2 rounded-t transition-colors ${
            activeTab === 'owned'
              ? 'bg-red-600 text-white'
              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
          }`}
        >
          Owned ({projects.filter(p => p.role === 'owner').length})
        </button>
        <button
          onClick={() => setActiveTab('member')}
          className={`px-4 py-2 rounded-t transition-colors ${
            activeTab === 'member'
              ? 'bg-red-600 text-white'
              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
          }`}
        >
          Member ({projects.filter(p => p.role === 'member').length})
        </button>
      </div>
      <div className="space-y-4">
        {filteredProjects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </div>
  );
};

export default ProjectsSection;