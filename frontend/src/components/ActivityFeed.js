import React, { useState, useEffect } from 'react';
import ProjectPreview from './ProjectPreview';
import apiService from '../utils/apiService';
import '../styles.css';

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await apiService.getPosts({ status: 'published', limit: 10 });
        if (response.success) {
          const transformedActivities = response.data.map(post => ({
            id: post._id,
            user: {
              name: post.author.username,
              avatar: post.author.profile?.avatar || '👤',
              isOnline: true
            },
            action: 'Created new post',
            project: {
              id: post._id,
              name: post.title,
              description: post.content,
              stars: post.likes?.length || 0,
              forks: 0, // Not available in post model
              lastUpdated: new Date(post.createdAt).toLocaleDateString(),
            },
            message: post.content,
            timestamp: new Date(post.createdAt).toLocaleDateString(),
            projectImage: '📝',
            likes: post.likes?.length || 0,
            type: 'create',
          }));
          setActivities(transformedActivities);
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load activities');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="activity-feed-container">
        <div className="section-title">Recent Legend Activity</div>
        <div className="scrollable-section">
          <div className="scrollable-content">
            <div className="text-center text-gray-400">Loading activities...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="activity-feed-container">
        <div className="section-title">Recent Legend Activity</div>
        <div className="scrollable-section">
          <div className="scrollable-content">
            <div className="text-center text-red-400">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-feed-container">
      <div className="section-title">
        Recent Legend Activity
      </div>
      <div className="scrollable-section">
        <div className="scrollable-content">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <ProjectPreview key={activity.id} activity={activity} />
            ))
          ) : (
            <div className="text-center text-gray-400">No activities found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;