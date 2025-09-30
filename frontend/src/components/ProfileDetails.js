import React, { useState, useEffect } from 'react';
import apiService from '../utils/apiService';

const ProfileDetails = () => {
  const [user, setUser] = useState({
    username: 'Loading...',
    title: 'Loading...',
    isOnline: false,
    joined: 'Loading...',
    location: 'Loading...',
  });

  useEffect(() => {
    const currentUser = apiService.getUser();
    if (currentUser) {
      setUser({
        username: currentUser.username || 'Unknown User',
        title: currentUser.profile?.title || 'Developer',
        isOnline: currentUser.isActive || false,
        joined: currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Unknown',
        location: currentUser.profile?.location || 'Unknown',
      });
    }
  }, []);

  return (
    <div>
      <div className="section-title">Profile Details</div>
      <p className="text-gray-300 mb-2">Status: {user.isOnline ? 'Online' : 'Offline'}</p>
      <p className="text-gray-300 mb-2">Username: {user.username}</p>
      <p className="text-gray-300 mb-2">Title: {user.title}</p>
      <p className="text-gray-300 mb-2">Joined: {user.joined}</p>
      <p className="text-gray-300 mb-2">Location: {user.location}</p>
    </div>
  );
};

export default ProfileDetails;