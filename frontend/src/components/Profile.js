import React, { useState, useEffect } from 'react';
import ProfileInfo from './ProfileInfo';

import ViewFriend from './ViewFriend';
import LanguageTags from './LanguageTags';
import ProjectsSection from './ProjectsSection';
import ActivityFeed from './ActivityFeed';
import apiService from '../utils/apiService';
import '../styles.css';

const Profile = ({ userId }) => {
  const [profileData, setProfileData] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError('');
        
        const currentUser = apiService.getUser();
        
        if (!userId) {
          setIsOwnProfile(true);
          setProfileData(currentUser);
        } else {
          const isOwn = currentUser && (
            currentUser.id === userId ||
            currentUser._id === userId ||
            currentUser.id?.toString() === userId ||
            currentUser._id?.toString() === userId
          );
          
          setIsOwnProfile(isOwn);
          
          if (isOwn) {
            setProfileData(currentUser);
          } else {
            try {
              const response = await apiService.request(`/users/${userId}`);
              if (response.success) {
                setProfileData(response);
              } else {
                setProfileData({
                  username: 'Unknown User',
                  profile: { title: 'Developer', bio: 'No bio available' },
                  email: 'unknown@example.com',
                  isActive: false
                });
              }
            } catch (apiError) {
              console.warn('API call failed, using fallback data:', apiError);
              setProfileData({
                username: 'Unknown User',
                profile: { title: 'Developer', bio: 'No bio available' },
                email: 'unknown@example.com',
                isActive: false
              });
            }
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId, refreshTrigger]);

  const handleProjectCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="apex-bg">
          <div className="hex-pattern"></div>
        </div>
        <div className="loading-message">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <div className="apex-bg">
          <div className="hex-pattern"></div>
        </div>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="apex-bg">
        <div className="hex-pattern"></div>
      </div>
      <div className="grid-2">
        <div className="column-left">
          <ProfileInfo
            profileData={profileData}
            isOwnProfile={isOwnProfile}
            targetUserId={userId}
            onProjectCreated={handleProjectCreated}
          />
          <div className="activity-feed">
            <ActivityFeed userId={userId} key={refreshTrigger} />
          </div>
        </div>
        <div className="column-right">
          <div className="details-languages">
            <ViewFriend userId={userId} />
            <LanguageTags userId={userId} />
          </div>
          <div className="projects-section">
            <ProjectsSection userId={userId} key={refreshTrigger} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
