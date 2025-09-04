import React, { useState } from 'react';
import ProjectPreview from './ProjectPreview';
import '../styles.css';

const ActivityFeed = () => {
  const [activities] = useState([
    {
      id: '1',
      user: { name: 'CodeLegend42', avatar: '👤', isOnline: true },
      action: 'Pushed 3 commits',
      project: {
        id: 'e-commerce-beast',
        name: 'E-Commerce Beast',
        description: 'Full-stack e-commerce platform with real-time inventory',
        stars: 42,
        forks: 18,
        lastUpdated: '2 hours ago',
      },
      message: 'Pushed 3 commits to E-Commerce Beast',
      timestamp: '2 hours ago',
      projectImage: '🛒',
      likes: 10,
      type: 'commit',
    },
    {
      id: '2',
      user: { name: 'CodeLegend42', avatar: '👤', isOnline: true },
      action: 'Commented on issue #47',
      project: {
        id: 'code-arena-platform',
        name: 'Code Arena Platform',
        description: 'Collaborative coding platform for teams',
        stars: 156,
        forks: 67,
        lastUpdated: '3 days ago',
      },
      message: 'Commented on issue #47 in Code Arena Platform',
      timestamp: '5 hours ago',
      projectImage: '🏟️',
      likes: 5,
      type: 'comment',
    },
    {
      id: '3',
      user: { name: 'CodeLegend42', avatar: '👤', isOnline: true },
      action: 'Created new project',
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
      user: { name: 'CodeLegend42', avatar: '👤', isOnline: true },
      action: 'Merged pull request #23',
      project: {
        id: 'data-visualization-suite',
        name: 'Data Visualization Suite',
        description: 'Interactive charts and graphs library',
        stars: 89,
        forks: 34,
        lastUpdated: '1 week ago',
      },
      message: 'Merged pull request #23 in Data Visualization Suite',
      timestamp: '2 days ago',
      projectImage: '📊',
      likes: 12,
      type: 'commit',
    },
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="section-title">
        Recent Legend Activity
      </div>
      <div className="scrollable-section">
        <div className="scrollable-content">
          {activities.map((activity) => (
            <ProjectPreview key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;