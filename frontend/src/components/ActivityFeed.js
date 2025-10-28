import React, { useState, useEffect } from 'react';
import ProjectPreview from './ProjectPreview';
import { Container } from './Card';
import apiService from '../utils/apiService';

const ActivityFeed = ({ userId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserActivity();
  }, [userId]);

  const fetchUserActivity = async () => {
    try {
      const targetUserId = userId || apiService.getUser()?.id;
      if (!targetUserId) return;

      
      const commitsResponse = await apiService.request(`/projects/user-commits/${targetUserId}`);
      
      if (commitsResponse.success && commitsResponse.commits) {
        const commitActivities = commitsResponse.commits.map(commit => ({
          id: commit._id,
          user: { 
            id: commit.userId,
            name: commit.username || commit.author, 
            avatar: commit.userAvatar || '👤', 
            isOnline: true 
          },
          action: 'Committed to',
          project: {
            id: commit.projectId,
            name: commit.projectName || 'Unknown Project',
            description: commit.message
          },
          message: commit.message,
          timestamp: new Date(commit.timestamp).toLocaleDateString(),
          projectImage: commit.projectImage || '💻',
          likes: 0,
          type: 'checkin'
        }));
        setActivities(commitActivities);
      } else {
        
        setActivities(generateDummyActivities());
      }
    } catch (error) {
      console.error('Error fetching user activity:', error);
      
      setActivities(generateDummyActivities());
    } finally {
      setLoading(false);
    }
  };

  const generateDummyActivities = () => {
    const currentUser = apiService.getUser();
    return [
      {
        id: '1',
        user: { 
          id: currentUser?.id || 'user_001',
          name: currentUser?.username || 'CodeLegend42', 
          avatar: '👤', 
          isOnline: true 
        },
        action: 'checked in',
        project: {
          id: 'e-commerce-beast',
          name: 'E-Commerce Beast',
          description: 'Full-stack e-commerce platform with real-time inventory',
          stars: 42,
          forks: 18,
          lastUpdated: '2 hours ago',
        },
        message: 'Added payment gateway integration',
        timestamp: '2 hours ago',
        projectImage: '🛒',
        likes: 10,
        type: 'checkin',
      },
      {
        id: '2',
        user: { 
          id: currentUser?.id || 'user_001',
          name: currentUser?.username || 'CodeLegend42', 
          avatar: '👤', 
          isOnline: true 
        },
        action: 'updated',
        project: {
          id: 'code-arena-platform',
          name: 'Code Arena Platform',
          description: 'Collaborative coding platform for teams',
          stars: 156,
          forks: 67,
          lastUpdated: '3 days ago',
        },
        message: 'Fixed authentication bug',
        timestamp: '5 hours ago',
        projectImage: '🏟️',
        likes: 5,
        type: 'update',
      },
      {
        id: '3',
        user: { 
          id: currentUser?.id || 'user_001',
          name: currentUser?.username || 'CodeLegend42', 
          avatar: '👤', 
          isOnline: true 
        },
        action: 'created',
        project: {
          id: 'ai-chat-companion',
          name: 'AI Chat Companion',
          description: 'React-based chat interface with AI integration',
          stars: 28,
          forks: 12,
          lastUpdated: '1 day ago',
        },
        message: 'Created new project: AI Chat Companion',
        timestamp: '1 day ago',
        projectImage: '🤖',
        likes: 8,
        type: 'create',
      },
      {
        id: '4',
        user: { 
          id: currentUser?.id || 'user_001',
          name: currentUser?.username || 'CodeLegend42', 
          avatar: '👤', 
          isOnline: true 
        },
        action: 'checked in',
        project: {
          id: 'data-visualization-suite',
          name: 'Data Visualization Suite',
          description: 'Interactive charts and graphs library',
          stars: 89,
          forks: 34,
          lastUpdated: '1 week ago',
        },
        message: 'Added new chart types and improved performance',
        timestamp: '2 days ago',
        projectImage: '📊',
        likes: 12,
        type: 'checkin',
      }
    ];
  };

  if (loading) {
    return (
      <div className="content-section view-friend-section">
        <div className="section-title">Recent Activity</div>
        <div className="text-center py-5 text-gray-400">Loading activity...</div>
      </div>
    );
  }

  return (
    <div className="content-section view-friend-section activity-feed-container">
      <div className="section-title">Recent Activity ({activities.length})</div>
      <div className="friends-container">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <ProjectPreview key={activity.id} activity={activity} />
          ))
        ) : (
          <div className="no-friends-message">
            No recent activity yet. Start coding!
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
