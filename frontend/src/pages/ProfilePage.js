import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Profile from '../components/Profile';
import '../styles.css';

function ProfilePage() {
  const { userId } = useParams();

  return (
    <div className="wireframe-container">
      <Header />
      <div className="profile-details-container">
        <Profile userId={userId} />
      </div>
    </div>
  );
}

export default ProfilePage;