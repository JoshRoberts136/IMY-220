import React, { useState, useEffect } from 'react';
import { User, Trophy, Edit3, Plus } from 'lucide-react';
import EditProfile from './EditProfile';
import CreateProject from './CreateProject';
import apiService from '../utils/apiService';

const ProfileInfo = () => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const currentUser = apiService.getUser();
      if (currentUser && currentUser._id) {
        try {
          setLoading(true);
          const response = await apiService.getUserById(currentUser._id);
          if (response.success) {
            setUser({
              username: response.data.username,
              title: response.data.profile?.title || 'Developer',
              bio: response.data.profile?.bio || 'No bio available',
              isOnline: true,
              avatar: response.data.profile?.avatar,
              postCount: response.data.postCount || 0
            });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleSaveProfile = (updatedData) => {
    setUser({ ...user, ...updatedData });
    console.log('Profile updated:', updatedData);
  };

  const handleCreateProject = (projectData) => {
    console.log('New project created:', projectData);
    // Could refresh user data here if needed
  };

  if (loading) {
    return (
      <div>
        <div className="section-title">Legend Profile</div>
        <div className="profile-container">
          <div className="text-center text-gray-400">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <div className="section-title">Legend Profile</div>
        <div className="profile-container">
          <div className="text-center text-red-400">Failed to load profile</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="section-title">Legend Profile</div>
      <div className="profile-container">
        <div className="placeholder-image profile">
          {user.avatar ? (
            <img src={user.avatar} alt={user.username} className="w-16 h-16 rounded-full" />
          ) : (
            <User className="w-16 h-16 text-gray-400" />
          )}
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
          {user.postCount !== undefined && (
            <p className="text-gray-400 text-sm mb-4">Posts: {user.postCount}</p>
          )}
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

      {user && (
        <>
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
        </>
      )}
    </div>
  );
};

export default ProfileInfo;
