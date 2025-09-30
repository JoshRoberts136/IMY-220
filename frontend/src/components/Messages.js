import React, { useState } from 'react';

function Messages() {
  const [messages] = useState([
    { id: 1, user: 'WraithRunner', message: 'Fixed hitbox detection bugs', timestamp: '2 hours ago' },
    { id: 2, user: 'PathfinderBot', message: 'Working on trajectory calculations', timestamp: '6 hours ago' },
  ]);

  return (
    <div className="content-section mb-5">
      <h3 className="section-title">Team Comms</h3>
      {messages.map((msg, index) => (
        <div 
          key={index} 
          className="mb-2.5 bg-apex-light-gray p-4 rounded-lg"
        >
          <div className="text-white font-semibold mb-1">{msg.user}: {msg.message}</div>
          <div className="text-gray-400 text-xs">{msg.timestamp}</div>
        </div>
      ))}
    </div>
  );
}

export default Messages;
