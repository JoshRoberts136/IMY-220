import React, { useState, useEffect } from 'react';
import { User, Trophy, Edit3, Plus } from 'lucide-react';
import EditProfile from './EditProfile';
import CreateProject from './CreateProject';
import AddFriend from './AddFriend';
import RemoveFriend from './RemoveFriend';
import apiService from '../utils/apiService';
import '../styles.css';

const ProfileInfo = ({ profileData, isOwnProfile, targetUserId }) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [friendshipStatus, setFriendshipStatus] = useState('none');
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
    
    // Check friendship status
    if (!isOwnProfile && targetUserId) {
      checkFriendshipStatus();
    }
  }, [profileData, isOwnProfile, targetUserId]);

  const checkFriendshipStatus = async () => {
    try {
      const response = await apiService.checkFriendshipStatus(targetUserId);
      if (response.success) {
        setFriendshipStatus(response.status);
      }
    } catch (error) {
      console.error('Error checking friendship status:', error);
    }
  };

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
    setFriendshipStatus(newStatus);
  };

  return (
    <div className="content-section profile-info-section">
      <div className="section-title">
        {isOwnProfile ? 'Legend Profile' : `${user.username}'s Profile`}
      </div>
      
      <div className="profile-container">
        <div className="user-avatar user-avatar-large">
          <User className="avatar-icon-large" />
        </div>
        
        <div className="profile-info">
          <div className="profile-header-row">
            <h1 className="profile-username-title">{user.username}</h1>
            <div className="online-badge">
              <Trophy className="badge-icon" />
              <span>Legend</span>
            </div>
          </div>
          
          <p className="profile-title-text">{user.title}</p>
          <p className="profile-bio-text">{user.bio}</p>
          
          <div className="buttons-container-profile">
            {isOwnProfile ? (
              <>
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="edit-profile-button"
                >
                  <Edit3 className="button-icon" />
                  Edit Profile
                </button>
                <button
                  onClick={() => setIsCreatingProject(true)}
                  className="create-project-button"
                >
                  <Plus className="button-icon" />
                  Create Project
                </button>
              </>
            ) : (
              friendshipStatus === 'friends' ? (
                <RemoveFriend
                  targetUserId={targetUserId}
                  onFriendshipChange={handleFriendshipChange}
                />
              ) : (
                <AddFriend
                  targetUserId={targetUserId}
                  onFriendshipChange={handleFriendshipChange}
                />
              )
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
