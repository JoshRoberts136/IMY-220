import React, { useState } from 'react';
import '../styles.css';

function Messages() {
  const [messages] = useState([
    { id: 1, user: 'WraithRunner', message: 'Fixed hitbox detection bugs', timestamp: '2 hours ago' },
    { id: 2, user: 'PathfinderBot', message: 'Working on trajectory calculations', timestamp: '6 hours ago' },
  ]);

  return (
    <div className="content-section">
      <h3 className="section-title">Team Comms</h3>
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