import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';

// Export mock data for use in other components
export const defaultActivities = [
  { id: 1, user: { name: 'WraithRunner', avatar: '👻', isOnline: true }, action: 'checked in', project: { id: '1', name: 'Battle Royale Engine', description: 'Fixed hitbox detection', stars: 15, forks: 5, lastUpdated: '2 hours ago' }, message: 'Fixed hitbox detection', timestamp: '2 hours ago', projectImage: '🎮', likes: 15, type: 'checkin' },
  { id: 2, user: { name: 'OctaneSpeed', avatar: '⚡', isOnline: true }, action: 'created', project: { id: '2', name: 'Jump Pad Physics', description: 'New project for movement', stars: 8, forks: 3, lastUpdated: '4 hours ago' }, message: 'New project for movement', timestamp: '4 hours ago', projectImage: '🚀', likes: 8, type: 'create' },
  { id: 3, user: { name: 'PathfinderBot', avatar: '🤖', isOnline: false }, action: 'checked out', project: { id: '3', name: 'Zipline Simulator', description: 'Working on trajectory', stars: 12, forks: 4, lastUpdated: '6 hours ago' }, message: 'Working on trajectory', timestamp: '6 hours ago', projectImage: '📐', likes: 12, type: 'checkout' },
  { id: 4, user: { name: 'LifelineDoc', avatar: '🏥', isOnline: true }, action: 'updated', project: { id: '4', name: 'Healing Algorithm', description: 'Optimized health regeneration', stars: 20, forks: 6, lastUpdated: '8 hours ago' }, message: 'Optimized health regeneration', timestamp: '8 hours ago', projectImage: '💊', likes: 20, type: 'update' },
  { id: 5, user: { name: 'GibraltarShield', avatar: '🛡️', isOnline: true }, action: 'checked in', project: { id: '5', name: 'Defense Protocol', description: 'Added dome shield cooldown', stars: 18, forks: 5, lastUpdated: '12 hours ago' }, message: 'Added dome shield cooldown', timestamp: '12 hours ago', projectImage: '⚡', likes: 18, type: 'checkin' },
  { id: 6, user: { name: 'BloodhoundTracker', avatar: '👁️', isOnline: false }, action: 'forked', project: { id: '6', name: 'Scan Detection System', description: 'Created improved tracking', stars: 22, forks: 7, lastUpdated: '1 day ago' }, message: 'Created improved tracking', timestamp: '1 day ago', projectImage: '🔍', likes: 22, type: 'fork' }
];

const ProjectPreview = ({ activity }) => {
  const navigate = useNavigate();

  // Use provided activity or first default activity
  const currentActivity = activity || defaultActivities[0];

  const handleProjectClick = () => {
    navigate(`/projects/${currentActivity.project.id}`);
  };

  const handleUserClick = (e) => {
    e.stopPropagation(); // Prevent project navigation when clicking user
    const userId = currentActivity.user.id || currentActivity.user.name;
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };

  const formatTimeAgo = (timestamp) => {
    return timestamp; // Already formatted in mock data
  };

  const getActionColor = (type) => {
    const colors = {
      checkin: 'bg-green-500/20 text-green-400',
      checkout: 'bg-orange-500/20 text-orange-400', 
      create: 'bg-apex-red/20 text-apex-red',
      update: 'bg-blue-500/20 text-blue-400',
      fork: 'bg-apex-orange/20 text-apex-orange'
    };
    return colors[type] || 'bg-gray-500/20 text-gray-400';
  };

  const getActionIcon = (type) => {
    const icons = {
      checkin: '📥',
      checkout: '📤',
      create: '✨',
      update: '🔄',
      fork: '🔀'
    };
    return icons[type] || '📋';
  };

  return (
    <Card variant="activity" hover onClick={handleProjectClick}>
      {/* Activity Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3 flex-1" onClick={handleUserClick}>
          <div className="relative w-11 h-11 bg-[rgba(139,0,0,0.2)] rounded-full flex items-center justify-center border-2 border-apex-orange">
            <span className="text-xl">{currentActivity.user.avatar}</span>
            {currentActivity.user.isOnline && (
              <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900 shadow-[0_0_10px_#00ff88]"></div>
            )}
          </div>
          <div className="flex-1">
            <div className="text-white font-bold text-base">{currentActivity.user.name}</div>
            <div className="text-gray-400 text-sm">{formatTimeAgo(currentActivity.timestamp)}</div>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${getActionColor(currentActivity.type)}`}>
          {getActionIcon(currentActivity.type)} {currentActivity.action}
        </div>
      </div>

      {/* Project Information */}
      <div className="mb-4">
        <div className="flex gap-4 items-center">
          <div className="w-15 h-15 bg-[rgba(139,0,0,0.2)] border-2 border-apex-orange rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
            {currentActivity.projectImage}
          </div>
          <div className="flex-1">
            <div className="text-apex-red font-bold text-lg mb-1 hover:underline cursor-pointer transition-colors">
              {currentActivity.project.name}
            </div>
            <div className="text-gray-300 leading-relaxed">{currentActivity.message}</div>
          </div>
        </div>
      </div>

      {/* Activity Footer */}
      <div className="flex gap-4 items-center flex-wrap">
        <button 
          className="flex items-center gap-1 bg-transparent border-none text-gray-400 cursor-pointer transition-all duration-200 font-rajdhani font-semibold px-3 py-1.5 rounded hover:text-red-400 hover:bg-red-400/10"
          onClick={(e) => {
            e.stopPropagation();
            console.log('Liked project:', currentActivity.project.id);
          }}
        >
          ❤️ {currentActivity.likes}
        </button>
        <button 
          className="flex items-center gap-1 bg-transparent border-none text-gray-400 cursor-pointer transition-all duration-200 font-rajdhani font-semibold px-3 py-1.5 rounded hover:text-cyan-400 hover:bg-cyan-400/10"
          onClick={(e) => {
            e.stopPropagation();
            console.log('Comment on:', currentActivity.project.id);
          }}
        >
          💬 Comment
        </button>
        <button 
          className="flex items-center gap-1 bg-transparent border-none text-gray-400 cursor-pointer transition-all duration-200 font-rajdhani font-semibold px-3 py-1.5 rounded hover:text-blue-400 hover:bg-blue-400/10"
          onClick={(e) => {
            e.stopPropagation();
            console.log('Share project:', currentActivity.project.id);
          }}
        >
          🔗 Share
        </button>
        
        {/* Quick Action Buttons */}
        <div className="flex gap-2 ml-auto">
          <button 
            className="bg-[rgba(139,0,0,0.1)] border border-apex-orange text-apex-orange px-2 py-1 rounded-xl text-xs uppercase tracking-wide transition-all duration-200 font-semibold hover:bg-apex-orange hover:text-white hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(139,0,0,0.3)]"
            onClick={(e) => {
              e.stopPropagation();
              handleProjectClick();
            }}
            title="View Project"
          >
            👁️ View
          </button>
          
          {currentActivity.type !== 'fork' && (
            <button 
              className="bg-[rgba(139,0,0,0.1)] border border-apex-orange text-apex-orange px-2 py-1 rounded-xl text-xs uppercase tracking-wide transition-all duration-200 font-semibold hover:bg-apex-red hover:text-white hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(139,0,0,0.3)]"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Fork project:', currentActivity.project.id);
              }}
              title="Fork Project"
            >
              🔀 Fork
            </button>
          )}
        </div>
      </div>

      {/* Hover Effect Indicator */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[rgba(139,0,0,0.95)] text-white px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide opacity-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-lg border border-apex-red">
        <span>Click to view project details</span>
      </div>
    </Card>
  );
};

export default ProjectPreview;
