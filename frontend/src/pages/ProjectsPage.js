import React from 'react';
import Header from '../components/Header';
import ProjectCard from '../components/ProjectCard';

function ProjectsPage() {
  return (
    <div className="min-h-screen overflow-y-auto">
      <Header />
      <div className="max-w-[1200px] mx-auto px-5 py-5">
        <ProjectCard />
      </div>  
    </div>
  );
}

export default ProjectsPage;
