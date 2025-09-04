import React from 'react';
import '../styles.css';

function Messages({ messages }) {
  return (
    <div className="sidebar">
      <h3 className="section-title">Team Comms</h3>
      {messages.map((message, index) => (
        <div key={index} style={{ background: '#2a2a2a', padding: '10px', borderRadius: '6px', marginBottom: '10px' }}>
          <p>{message.msg}</p>
        </div>
      ))}
      <div className="form-group">
        <input className="form-input-placeholder" placeholder="Type message..." />
        <button className="button-placeholder">Post</button>
      </div>
    </div>
  );
}

export default Messages;