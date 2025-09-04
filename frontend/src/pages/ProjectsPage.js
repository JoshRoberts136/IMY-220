import React from 'react';
import Header from '../components/Header';
import ProjectCard from '../components/ProjectCard';
import '../styles.css';

function ProjectsPage() {
  return (
    <div className="wireframe-container">
      <Header />
      <div className="projects-page-container">
      <ProjectCard />
      </div>  
    </div>
  );
}

export default ProjectsPage;