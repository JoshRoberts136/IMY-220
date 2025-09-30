import React, { useState, useEffect } from 'react';
import { User, Trophy, Edit3, Plus } from 'lucide-react';
import EditProfile from './EditProfile';
import CreateProject from './CreateProject';
import AddFriend from './AddFriend';
import apiService from '../utils/apiService';
import '../styles.css';

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
    <div className="content-section" style={{ marginBottom: '20px' }}>
      <div className="section-title">
        {isOwnProfile ? 'Legend Profile' : `${user.username}'s Profile`}
      </div>
      
      <div className="profile-container">
        <div className="user-avatar" style={{ width: '120px', height: '120px', fontSize: '64px' }}>
          <User style={{ width: '64px', height: '64px', color: '#9ca3af' }} />
        </div>
        
        <div className="profile-info">
          <div className="flex items-center gap-3 mb-2" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'white', margin: 0 }}>{user.username}</h1>
            <div className="online-badge" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Trophy style={{ width: '16px', height: '16px' }} />
              <span>Legend</span>
            </div>
          </div>
          
          <p style={{ color: '#d1d5db', marginBottom: '8px', fontSize: '16px' }}>{user.title}</p>
          <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '16px', lineHeight: '1.5' }}>{user.bio}</p>
          
          <div className="buttons-container-profile">
            {isOwnProfile ? (
              <>
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="edit-profile-button"
                >
                  <Edit3 style={{ width: '16px', height: '16px' }} />
                  Edit Profile
                </button>
                <button
                  onClick={() => setIsCreatingProject(true)}
                  className="create-project-button"
                >
                  <Plus style={{ width: '16px', height: '16px' }} />
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
