import React, { useState, useEffect } from 'react';
import { User, Trophy, Edit3, Plus } from 'lucide-react';
import EditProfile from './EditProfile';
import CreateProject from './CreateProject';
import AddFriend from './AddFriend';
import apiService from '../utils/apiService';

const ProfileInfo = ({ profileData, isOwnProfile, targetUserId }) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [user, setUser] = useState({
    username: 'CodeLegend42',
    title: 'Full-Stack Champion',
    bio: 'Conquering bugs and building digital empires. 5+ years of battle-tested experience in the coding arena.',
    isOnline: true,
  });

  useEffect(() => {
    if (profileData) {
      setUser({
        username: profileData.username || 'Unknown User',
        title: profileData.profile?.title || 'Developer',
        bio: profileData.profile?.bio || 'No bio available',
        email: profileData.email,
        location: profileData.profile?.location,
        joinDate: profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : 'Unknown',
        isOnline: profileData.isActive || false,
        ...profileData
      });
    } else if (isOwnProfile) {
      const currentUser = apiService.getUser();
      if (currentUser) {
        setUser({
          username: currentUser.username || 'Unknown User',
          title: currentUser.profile?.title || 'Developer',
          bio: currentUser.profile?.bio || 'No bio available',
          email: currentUser.email,
          location: currentUser.profile?.location,
          joinDate: currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Unknown',
          isOnline: currentUser.isActive || false,
          ...currentUser
        });
      }
    }
  }, [profileData, isOwnProfile]);

  const handleSaveProfile = async (updatedData) => {
    const currentUser = apiService.getUser();
    if (currentUser) {
      try {
        const updatePayload = {
          username: updatedData.username || currentUser.username,
          email: updatedData.email || currentUser.email,
          profile: {
            ...currentUser.profile,
            title: updatedData.title,
            bio: updatedData.bio,
            location: updatedData.location
          }
        };
        
        await apiService.request(`/users/${currentUser.id}`, {
          method: 'PUT',
          body: JSON.stringify(updatePayload)
        });
        
        console.log('Profile updated in MongoDB');
      } catch (error) {
        console.error('Failed to update MongoDB:', error);
      }
      
      setUser({ ...user, ...updatedData });
      const updatedUser = {
        ...currentUser,
        username: updatedData.username || currentUser.username,
        email: updatedData.email || currentUser.email,
        profile: {
          ...currentUser.profile,
          title: updatedData.title,
          bio: updatedData.bio,
          location: updatedData.location
        }
      };
      apiService.setUser(updatedUser);
    }
  };

  const handleCreateProject = (projectData) => {
    console.log('New project created:', projectData);
  };

  const handleFriendshipChange = (newStatus) => {
    console.log('Friendship status changed:', newStatus);
  };

  return (
    <div className="content-section">
      <div className="section-title">
        {isOwnProfile ? 'Legend Profile' : `${user.username}'s Profile`}
      </div>
      <div className="flex gap-5 items-center mb-5">
        <div className="w-[120px] h-[120px] bg-apex-orange/20 rounded-full flex items-center justify-center border-2 border-apex-orange">
          <User className="w-16 h-16 text-gray-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">{user.username}</h1>
            <div className="flex items-center gap-1 bg-red-600 px-2 py-1 rounded-full">
              <Trophy className="w-4 h-4 text-white" />
              <span className="text-sm text-white font-semibold">Legend</span>
            </div>
          </div>
          <p className="text-gray-300 mb-2">{user.title}</p>
          <p className="text-gray-400 text-sm mb-4">{user.bio}</p>
          
          <div className="flex gap-2.5">
            {isOwnProfile ? (
              <>
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="flex items-center gap-2 bg-apex-orange text-white border-none rounded px-5 py-2.5 cursor-pointer transition-all duration-300 hover:bg-apex-red"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
                <button
                  onClick={() => setIsCreatingProject(true)}
                  className="flex items-center gap-2 bg-transparent text-apex-orange border-2 border-apex-orange rounded px-5 py-2.5 cursor-pointer transition-all duration-300 hover:bg-apex-orange hover:text-white"
                >
                  <Plus className="w-4 h-4" />
                  Create Project
                </button>
              </>
            ) : (
              <AddFriend
                targetUserId={targetUserId}
                onFriendshipChange={handleFriendshipChange}
              />
            )}
          </div>
        </div>
      </div>

      {isOwnProfile && (
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
