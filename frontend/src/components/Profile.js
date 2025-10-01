import React, { useState, useEffect } from 'react';
import ProfileInfo from './ProfileInfo';
import ViewFriend from './ViewFriend';
import LanguageTags from './LanguageTags';
import ProjectsSection from './ProjectsSection';
import ActivityFeed from './ActivityFeed';
import PageContainer from './PageContainer';
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
      <PageContainer>
        <div className="text-center py-10 text-gray-400">Loading profile...</div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="text-center py-10 text-red-500">{error}</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Two Column Grid Layout - Original Structure */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', minHeight: '78vh' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <ProfileInfo
            profileData={profileData}
            isOwnProfile={isOwnProfile}
            targetUserId={userId}
            onProjectCreated={handleProjectCreated}
          />
          <div style={{ flex: 1, overflow: 'visible' }}>
            <ActivityFeed userId={userId} key={refreshTrigger} />
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ flexShrink: 0 }}>
            <ViewFriend userId={userId} />
            <LanguageTags userId={userId} />
          </div>
          <div style={{ flex: 1, overflow: 'visible' }}>
            <ProjectsSection userId={userId} key={refreshTrigger} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Profile;
