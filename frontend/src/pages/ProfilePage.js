import React from 'react';
import Header from '../components/Header';
import Profile from '../components/Profile';
import '../styles.css';

function ProfilePage() {
  return (
    <div className="wireframe-container">
      <Header />
      <div className="profile-details-container">
        <Profile />
      </div>
    </div>
  );
}

export default ProfilePage;