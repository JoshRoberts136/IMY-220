import React from 'react';
import { useParams } from 'react-router-dom';
import '../styles.css';

function Messages() {
  const { projectId } = useParams();

  const getMessagesById = (id) => {
    const projects = {
      '1': [
        { id: 1, user: 'WraithRunner', message: 'Fixed hitbox detection bugs', timestamp: '2 hours ago' },
        { id: 2, user: 'PathfinderBot', message: 'Working on trajectory calculations', timestamp: '6 hours ago' }
      ],
      '2': [
        { id: 1, user: 'OctaneSpeed', message: 'New project for movement mechanics', timestamp: '4 hours ago' },
        { id: 2, user: 'WraithRunner', message: 'Great physics work!', timestamp: '5 hours ago' }
      ],
      '3': [
        { id: 1, user: 'PathfinderBot', message: 'Updated zipline mechanics', timestamp: '1 day ago' },
        { id: 2, user: 'WraithRunner', message: 'Reviewed code', timestamp: '2 days ago' }
      ],
      // Add more as needed
    };
    return projects[id] || [];
  };

  const messages = getMessagesById(projectId);

  return (
    <div className="content-section">
      <h3 className="section-title">Discussion Board</h3>
      {messages.map((msg, index) => (
        <div key={index} style={{ marginBottom: '10px', background: '#2a2a2a', padding: '15px', borderRadius: '8px' }}>
          <span>{msg.user}: {msg.message}</span>
          <span>{msg.timestamp}</span>
        </div>
      ))}
    </div>
  );
}

export default Messages;