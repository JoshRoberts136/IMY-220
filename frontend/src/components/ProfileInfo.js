import React, { useState, useEffect } from 'react';
import { User, Trophy, Edit3, Plus } from 'lucide-react';
import Button from './Button';
import EditProfile from './EditProfile';
import CreateProject from './CreateProject';
import AddFriend from './AddFriend';
import RemoveFriend from './RemoveFriend';
import ProfileImageUpload from './ProfileImageUpload';
import { DefaultAvatar } from '../utils/avatarUtils';
import apiService from '../utils/apiService';
import '../styles.css';

const ProfileInfo = ({ profileData, isOwnProfile, isFriend, targetUserId, onProjectCreated, onFriendshipChange }) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [friendshipStatus, setFriendshipStatus] = useState('none');
  const [user, setUser] = useState({
    username: 'CodeLegend42',
    title: 'Full-Stack Champion',
    bio: 'Conquering bugs and building digital empires. 5+ years of battle-tested experience in the coding arena.',
    isOnline: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (profileData) {
      setUser({
        username: profileData.username || 'Unknown User',
        title: profileData.profile?.title || 'Developer',
        bio: profileData.profile?.bio || 'No bio available',
        email: profileData.email,
        location: profileData.profile?.location,
        avatar: profileData.profile?.avatar,
        joinDate: profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : 'Unknown',
        isOnline: profileData.isActive || false,
        ...profileData
      });
      setIsLoading(false);
    } else if (isOwnProfile) {
      const currentUser = apiService.getUser();
      if (currentUser) {
        setUser({
          username: currentUser.username || 'Unknown User',
          title: currentUser.profile?.title || 'Developer',
          bio: currentUser.profile?.bio || 'No bio available',
          email: currentUser.email,
          location: currentUser.profile?.location,
          avatar: currentUser.profile?.avatar,
          joinDate: currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Unknown',
          isOnline: currentUser.isActive || false,
          ...currentUser
        });
        setIsLoading(false);
      }
    }
    
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

  const handleAvatarUploadSuccess = async (newAvatarPath) => {
    setUser(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        avatar: newAvatarPath
      },
      avatar: newAvatarPath
    }));

    const currentUser = apiService.getUser();
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        profile: {
          ...currentUser.profile,
          avatar: newAvatarPath
        }
      };
      apiService.setUser(updatedUser);
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

  const handleCreateProject = async (projectData) => {
    console.log('New project created:', projectData);
    if (onProjectCreated) {
      onProjectCreated();
    }
  };

  const handleLocalFriendshipChange = (newStatus) => {
    console.log('Friendship status changed locally:', newStatus);
    setFriendshipStatus(newStatus);
    
    if (onFriendshipChange) {
      onFriendshipChange(newStatus);
    }
  };

  const getUserId = () => {
    return user.id || user._id;
  };

  const currentUser = apiService.getUser();
  const isAdmin = currentUser?.isAdmin || false;
  const showLimitedInfo = !isOwnProfile && !isFriend && !isAdmin;

  return (
    <div className="content-section profile-info-section">
      <div className="section-title">
        {isOwnProfile ? 'Legend Profile' : `${user.username}'s Profile`}
      </div>
      
      <div className="profile-container">
        {isOwnProfile && !isLoading && getUserId() ? (
          <ProfileImageUpload
            currentAvatar={user.profile?.avatar || user.avatar}
            userId={getUserId()}
            username={user.username}
            onUploadSuccess={handleAvatarUploadSuccess}
            isOwnProfile={true}
          />
        ) : (
          <div className="user-avatar user-avatar-large">
            {user.profile?.avatar || user.avatar ? (
              <img 
                src={user.profile?.avatar || user.avatar} 
                alt={user.username}
                className="profile-avatar-image"
              />
            ) : (
              <DefaultAvatar username={user.username} size={150} />
            )}
          </div>
        )}
        
        <div className="profile-info">
          <div className="profile-header-row">
            <h1 className="profile-username-title">{user.username}</h1>
            {(isOwnProfile || isFriend) && (
              <div className="online-badge">
                <Trophy className="badge-icon" />
                <span>Legend</span>
              </div>
            )}
          </div>
          
          {!showLimitedInfo ? (
            <>
              <p className="profile-title-text">{user.title}</p>
              <p className="profile-bio-text">{user.bio}</p>
            </>
          ) : (
            <div className="text-gray-400 text-sm mt-2">
              <p>🔒 Add {user.username} as a friend to view their full profile</p>
            </div>
          )}
          
          <div className="buttons-container-profile">
            {isOwnProfile ? (
              <>
                <Button
                  variant="warning"
                  icon={Edit3}
                  onClick={() => setIsEditingProfile(true)}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="primary"
                  icon={Plus}
                  onClick={() => setIsCreatingProject(true)}
                >
                  Create Project
                </Button>
              </>
            ) : isAdmin ? (
              <Button
                variant="warning"
                icon={Edit3}
                onClick={() => setIsEditingProfile(true)}
              >
                Edit User (Admin)
              </Button>
            ) : (
              friendshipStatus === 'friends' ? (
                <RemoveFriend
                  targetUserId={targetUserId}
                  onFriendshipChange={handleLocalFriendshipChange}
                />
              ) : (
                <AddFriend
                  targetUserId={targetUserId}
                  onFriendshipChange={handleLocalFriendshipChange}
                />
              )
            )}
          </div>
        </div>
      </div>

      {(isOwnProfile || isAdmin) && (
        <>
          <EditProfile
            isOpen={isEditingProfile}
            onClose={() => setIsEditingProfile(false)}
            user={user}
            onSave={handleSaveProfile}
          />

          {isOwnProfile && (
            <CreateProject
              isOpen={isCreatingProject}
              onClose={() => setIsCreatingProject(false)}
              onSave={handleCreateProject}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ProfileInfo;
