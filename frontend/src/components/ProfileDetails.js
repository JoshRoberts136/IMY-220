import React, { useState } from 'react';

const ProfileDetails = () => {
  const [user] = useState({
    username: 'CodeLegend42',
    title: 'Full-Stack Champion',
    isOnline: true,
    joined: 'January 2020',
    location: 'Digital Realm',
  });

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