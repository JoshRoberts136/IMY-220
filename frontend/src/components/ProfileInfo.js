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
      <div className="profile-container">
        <div className="placeholder-image profile">
          <User className="w-16 h-16 text-gray-400" />
        </div>
        <div className="profile-info">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">{user.username}</h1>
            <div className="flex items-center gap-1 bg-red-600 px-2 py-1 rounded-full">
              <Trophy className="w-4 h-4 text-white" />
              <span className="text-sm text-white font-semibold">Legend</span>
            </div>
          </div>
          <p className="text-gray-300 mb-2">{user.title}</p>
          <p className="text-gray-400 text-sm mb-4">{user.bio}</p>
          <div className="buttons-container-profile">
            <button
              onClick={() => setIsEditingProfile(true)}
              className="edit-profile-button"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
            <button
              onClick={() => setIsCreatingProject(true)}
              className="create-project-button"
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
