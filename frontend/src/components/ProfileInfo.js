import React, { useState } from 'react';
import '../styles.css';

const ProfileInfo = ({ user, isOwnProfile }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-red-900">
      <div className="flex items-center gap-6 mb-6">
        <div className="relative">
          <div className="w-32 h-32 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center">
            <User className="w-16 h-16 text-white" />
          </div>
          {user.isOnline && <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-800"></div>}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">{user.username}</h1>
            <div className="flex items-center gap-1 bg-red-600 px-2 py-1 rounded-full">
              <Trophy className="w-4 h-4 text-white" />
              <span className="text-sm text-white font-semibold">Legend</span>
            </div>
          </div>
          <p className="text-gray-300 mb-2">{user.title}</p>
          <p className="text-gray-400 text-sm mb-4">{user.bio}</p>
          {isOwnProfile && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;