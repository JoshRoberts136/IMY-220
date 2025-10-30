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
  const [isFriend, setIsFriend] = useState(false);
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
          setIsFriend(false);
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
            setIsFriend(false);
            setProfileData(currentUser);
          } else {
            try {
              const response = await apiService.request(`/users/${userId}`);
              if (response.success) {
                setProfileData(response);
                
                // Check if they are friends
                const friendshipResponse = await apiService.checkFriendshipStatus(userId);
                if (friendshipResponse.success && friendshipResponse.status === 'friends') {
                  setIsFriend(true);
                } else {
                  setIsFriend(false);
                }
              } else {
                setProfileData({
                  username: 'Unknown User',
                  profile: { title: 'Developer', bio: 'No bio available' },
                  email: 'unknown@example.com',
                  isActive: false
                });
                setIsFriend(false);
              }
            } catch (apiError) {
              console.warn('API call failed, using fallback data:', apiError);
              setProfileData({
                username: 'Unknown User',
                profile: { title: 'Developer', bio: 'No bio available' },
                email: 'unknown@example.com',
                isActive: false
              });
              setIsFriend(false);
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

  // Handle friendship status changes dynamically without page reload
  const handleFriendshipChange = (newStatus) => {
    console.log('Friendship status changed to:', newStatus);
    
    // Update isFriend state immediately
    if (newStatus === 'friends') {
      setIsFriend(true);
    } else if (newStatus === 'none' || newStatus === 'removed') {
      setIsFriend(false);
    }
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

  // If not own profile AND not friends AND not admin, show limited view
  const currentUser = apiService.getUser();
  const isAdmin = currentUser?.isAdmin || false;
  const showLimitedView = !isOwnProfile && !isFriend && !isAdmin;

  return (
    <PageContainer>
      {/* Two Column Grid Layout - 20px gap between columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', minHeight: '78vh' }}>
        {/* Left Column - 10px gap between rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <ProfileInfo
            profileData={profileData}
            isOwnProfile={isOwnProfile}
            isFriend={isFriend}
            targetUserId={userId}
            onProjectCreated={handleProjectCreated}
            onFriendshipChange={handleFriendshipChange}
          />
          {!showLimitedView && <LanguageTags userId={userId} />}
          {!showLimitedView && (
            <div style={{ flex: 1, overflow: 'visible', maxHeight: '500px' }}>
              <ActivityFeed userId={userId} key={refreshTrigger} />
            </div>
          )}
          {showLimitedView && (
            <div className="content-section">
              <div className="text-center py-10 text-gray-400">
                <p className="mb-4">🔒 This profile is private</p>
                <p className="text-sm">Add {profileData?.username} as a friend to view their activity and projects</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - 10px gap between rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {!showLimitedView && (
            <>
              <div style={{ flexShrink: 0 }}>
                <ViewFriend userId={userId} />
              </div>
              <div style={{ flex: 1, overflow: 'visible', maxHeight: '500px' }}>
                <ProjectsSection userId={userId} key={refreshTrigger} />
              </div>
            </>
          )}
          {showLimitedView && (
            <div className="content-section">
              <div className="text-center py-10 text-gray-400">
                <p className="mb-4">🚫 Friends Only Content</p>
                <p className="text-sm">You must be friends with {profileData?.username} to view their friends and projects</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default Profile;
