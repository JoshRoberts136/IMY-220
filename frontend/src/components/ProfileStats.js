import React from 'react';
import '../styles.css';

const ProfileStats = ({ stats }) => (
  <div className="content-section profile-stats-container">
    <h3 className="section-title">Legend Stats</h3>
    <div className="analytics-grid">
      <div className="analytics-item">
        <span className="analytics-value">{stats.projects}</span>
        <span className="analytics-label">Projects</span>
      </div>
      <div className="analytics-item">
        <span className="analytics-value">{stats.commits}</span>
        <span className="analytics-label">Commits</span>
      </div>
      <div className="analytics-item">
        <span className="analytics-value">{stats.followers}</span>
        <span className="analytics-label">Followers</span>
      </div>
      <div className="analytics-item">
        <span className="analytics-value">{stats.following}</span>
        <span className="analytics-label">Following</span>
      </div>
    </div>
  </div>
);

export default ProfileStats;
