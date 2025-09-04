import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Splash from './pages/Splash';
import Home from './pages/Home';
import ProfilePage from './pages/ProfilePage';
import Projects from './pages/Projects';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/projects/:projectId" element={<Projects />} />
    </Routes>
  );
}

export default App;