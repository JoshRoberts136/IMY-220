import React from 'react';
import ProfileInfo from './ProfileInfo';
import ProfileDetails from './ProfileDetails';
import ViewFriend from './ViewFriend';
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
          <ProfileDetails />
          <div className="projects-section">
            <ProjectsSection />
          </div>
        </div>
        <div className="column-right">
          <div className="details-languages">
            <ViewFriend />
            <LanguageTags />
          </div>
          <div className="activity-feed">
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;