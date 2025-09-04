import React from 'react';
import ProfileInfo from './ProfileInfo';
import ProfileDetails from './ProfileDetails';
import LanguageTags from './LanguageTags';
import ProjectsSection from './ProjectsSection';
import ActivityFeed from './ActivityFeed';
import '../styles.css';

const Profile = () => {
  return (
    <div>
      <div className="apex-bg">
        <div className="hex-pattern"></div>
      </div>
      <div className="grid-2">
        <div className="column-left">
          <ProfileInfo />
          <ProjectsSection />
        </div>
        <div className="column-right">
          <div className="details-languages">
            <ProfileDetails />
            <LanguageTags />
          </div>
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default Profile;