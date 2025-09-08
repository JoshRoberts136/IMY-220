import React, { useState, useEffect } from 'react';
import apiService from '../utils/apiService';
import '../styles.css';

function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await apiService.getMessages({ limit: 10 });
        if (response.success) {
          setMessages(response.data);
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) {
    return (
      <div className="content-section">
        <h3 className="section-title">Team Comms</h3>
        <div className="text-center text-gray-400">Loading messages...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-section">
        <h3 className="section-title">Team Comms</h3>
        <div className="text-center text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="content-section">
      <h3 className="section-title">Team Comms</h3>
      {messages.length > 0 ? (
        messages.map((msg) => (
          <div key={msg.id} className="message-item">
            <span>{msg.user}: {msg.message}</span>
            <span>{msg.timestamp}</span>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-400">No messages found</div>
      )}
    </div>
  );
}

export default Messages;