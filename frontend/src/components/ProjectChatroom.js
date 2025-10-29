import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import Button from './Button';
import apiService from '../utils/apiService';
import '../styles.css';

const ProjectChatroom = ({ projectId, isMember }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const currentUser = apiService.getUser();

  useEffect(() => {
    if (projectId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [projectId]);

  const fetchMessages = async () => {
    try {
      const response = await apiService.getProjectMessages(projectId);
      if (response.success) {
        setMessages(response.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !isMember) return;

    try {
      setSending(true);
      const response = await apiService.postProjectMessage(projectId, newMessage.trim());
      
      if (response.success) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const isImagePath = (avatar) => {
    return avatar && (avatar.startsWith('/') || avatar.startsWith('http'));
  };

  const renderAvatar = (avatar) => {
    if (isImagePath(avatar)) {
      return (
        <img 
          src={avatar} 
          alt="Avatar"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            objectFit: 'cover'
          }}
        />
      );
    }
    return <span style={{ fontSize: '24px' }}>{avatar || '👤'}</span>;
  };

  return (
    <div className="content-section" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexShrink: 0 }}>
        <MessageSquare size={20} color="var(--apex-orange)" />
        Discussion Board
      </div>

      <div 
        className="chatroom-messages" 
        style={{
          height: '400px',
          minHeight: '400px',
          maxHeight: '400px',
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '16px',
          background: 'rgba(20, 20, 20, 0.3)',
          borderRadius: '8px',
          marginBottom: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
            No messages yet. Start the conversation!
          </div>
        ) : (
          <>
            {messages.map((msg, index) => {
              const isOwnMessage = msg.userId === currentUser?.id;
              return (
                <div
                  key={msg.id || index}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                    flexDirection: isOwnMessage ? 'row-reverse' : 'row',
                    flexShrink: 0
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(139, 0, 0, 0.2)',
                    border: '2px solid var(--apex-orange)'
                  }}>
                    {renderAvatar(msg.avatar)}
                  </div>
                  
                  <div style={{
                    maxWidth: '70%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isOwnMessage ? 'flex-end' : 'flex-start'
                  }}>
                    <div style={{
                      fontSize: '12px',
                      color: '#888',
                      marginBottom: '4px',
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center'
                    }}>
                      <span style={{ color: 'var(--apex-orange)', fontWeight: '600' }}>
                        {msg.username}
                      </span>
                      <span>{formatTime(msg.timestamp)}</span>
                    </div>
                    
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: isOwnMessage 
                        ? 'linear-gradient(135deg, rgba(139, 0, 0, 0.3), rgba(139, 0, 0, 0.1))'
                        : 'rgba(45, 55, 72, 0.5)',
                      border: `1px solid ${isOwnMessage ? 'var(--apex-orange)' : '#333'}`,
                      color: 'white',
                      wordWrap: 'break-word'
                    }}>
                      {msg.message}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {isMember ? (
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={sending}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: 'rgba(20, 20, 20, 0.5)',
              border: '2px solid #333',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              fontFamily: 'Rajdhani, sans-serif',
              outline: 'none',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--apex-orange)'}
            onBlur={(e) => e.target.style.borderColor = '#333'}
          />
          <Button
            type="submit"
            variant="primary"
            icon={Send}
            disabled={sending || !newMessage.trim()}
          >
            Send
          </Button>
        </form>
      ) : (
        <div style={{
          padding: '12px',
          textAlign: 'center',
          color: '#888',
          background: 'rgba(20, 20, 20, 0.3)',
          borderRadius: '8px',
          border: '1px solid #333',
          flexShrink: 0
        }}>
          Only project members can send messages
        </div>
      )}
    </div>
  );
};

export default ProjectChatroom;
