import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Splash from './pages/Splash';
import Home from './pages/Home';
import ProfilePage from './pages/ProfilePage';
import ProjectsPage from './pages/ProjectsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/projects/:projectId" element={<ProjectsPage />} />
    </Routes>
  );
}

export default App;