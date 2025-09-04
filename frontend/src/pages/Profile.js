import React from 'react';
import Header from '../components/Header';
import Profile from '../components/Profile';
import EditProfile from '../components/EditProfile';
import UsersProjects from '../components/UsersProjects';
import '../styles.css';

function ProfilePage() {
  // Dummy data
  const user = { name: 'Dummy User', bio: 'Bio here', languages: ['JS', 'Python'] };
  const projects = [{ name: 'Project1' }, { name: 'Project2' }];
  const friends = [{ name: 'Friend1' }, { name: 'Friend2' }];

  return (
    <div className="wireframe-container">
      <Header />
      <Profile user={user} />
      <EditProfile />
      <UsersProjects projects={projects} />
    </div>
  );
}

export default ProfilePage;