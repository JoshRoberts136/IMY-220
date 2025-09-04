import React, { useState } from 'react';
import { User, Trophy, Edit3, Plus } from 'lucide-react';
import EditProfile from './EditProfile';
import CreateProject from './CreateProject';

const ProfileInfo = () => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [user, setUser] = useState({
    username: 'CodeLegend42',
    title: 'Full-Stack Champion',
    bio: 'Conquering bugs and building digital empires. 5+ years of battle-tested experience in the coding arena.',
    isOnline: true,
  });

  const handleSaveProfile = (updatedData) => {
    setUser({ ...user, ...updatedData });
    console.log('Profile updated:', updatedData);
  };

  const handleCreateProject = (projectData) => {
    console.log('New project created:', projectData);
  };

  return (
    <div>
      <div className="section-title">Legend Profile</div>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
        <div className="placeholder-image profile">
          <User className="w-16 h-16 text-gray-400" />
        </div>
        <div style={{ flex: 1 }}>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">{user.username}</h1>
            <div className="flex items-center gap-1 bg-red-600 px-2 py-1 rounded-full">
              <Trophy className="w-4 h-4 text-white" />
              <span className="text-sm text-white font-semibold">Legend</span>
            </div>
          </div>
          <p className="text-gray-300 mb-2">{user.title}</p>
          <p className="text-gray-400 text-sm mb-4">{user.bio}</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setIsEditingProfile(true)}
              className="button-placeholder"
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
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
            <button
              onClick={() => setIsCreatingProject(true)}
              className="button-placeholder"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'transparent',
                color: 'var(--apex-orange)',
                border: '2px solid var(--apex-orange)',
                borderRadius: '4px',
                padding: '10px 20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--apex-orange)';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = 'var(--apex-orange)';
              }}
            >
              <Plus className="w-4 h-4" />
              Create Project
            </button>
          </div>
        </div>
      </div>

      <EditProfile
        isOpen={isEditingProfile}
        onClose={() => setIsEditingProfile(false)}
        user={user}
        onSave={handleSaveProfile}
      />

      <CreateProject
        isOpen={isCreatingProject}
        onClose={() => setIsCreatingProject(false)}
        onSave={handleCreateProject}
      />
    </div>
  );
};

export default ProfileInfo;
