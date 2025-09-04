import React from 'react';
import '../styles.css';

const ProfileStats = ({ stats }) => (
  <div className="bg-gray-800 p-6 rounded-lg border border-red-900">
    <h3 className="text-xl font-semibold text-red-500 mb-4">Legend Stats</h3>
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-white">{stats.projects}</div>
        <div className="text-gray-400 text-sm">Projects</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-white">{stats.commits}</div>
        <div className="text-gray-400 text-sm">Commits</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-white">{stats.followers}</div>
        <div className="text-gray-400 text-sm">Followers</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-white">{stats.following}</div>
        <div className="text-gray-400 text-sm">Following</div>
      </div>
    </div>
  </div>
);

export default ProfileStats;