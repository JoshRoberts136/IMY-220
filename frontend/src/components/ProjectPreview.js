import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../utils/apiService';
import '../styles.css';

// Export mock data for use in other components

const ProjectPreview = ({ activity }) => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(activity?.likes || 0);
  const [isLiked, setIsLiked] = useState(activity?.isLikedByUser || false);
  const [liking, setLiking] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commenting, setCommenting] = useState(false);

  // Use provided activity or first default activity
  const currentActivity = activity || defaultActivities[0];

  const handleProjectClick = () => {
    navigate(`/projects/${currentActivity.project.id}`);
  };

  const handleUserClick = (e) => {
    e.stopPropagation(); // Prevent project navigation when clicking user
    // Navigate to user profile when implemented
    // navigate(`/profile/${currentActivity.user.id}`);
  };

  const formatTimeAgo = (timestamp) => {
    return timestamp; // Already formatted in mock data
  };

  const getActionColor = (type) => {
    const colors = {
      checkin: '#00ff88',
      checkout: '#ff6b35', 
      create: '#8b0000',
      update: '#00bfff',
      fork: '#ff3333'
    };
    return colors[type] || '#666';
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

  const handleLike = async (e) => {
    e.stopPropagation();
    if (liking) return;

    try {
      setLiking(true);
      const response = await apiService.likePost(currentActivity.id);

      if (response.success) {
        setIsLiked(response.data.isLikedByUser);
        setLikes(response.data.likeCount);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setLiking(false);
    }
  };

  const handleComment = async (e) => {
    e.stopPropagation();
    if (commenting) return;

    if (!showCommentForm) {
      setShowCommentForm(true);
      return;
    }

    if (!commentText.trim()) return;

    try {
      setCommenting(true);
      const response = await apiService.addComment(currentActivity.id, {
        content: commentText.trim()
      });

      if (response.success) {
        setCommentText('');
        setShowCommentForm(false);
        // Could update comment count here if available
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setCommenting(false);
    }
  };

  return (
    <div className="activity-item activity-item-cursor" onClick={handleProjectClick}>
      {/* Activity Header */}
      <div className="activity-header">
        <div className="user-info" onClick={handleUserClick}>
          <div className="user-avatar">
            <span className="avatar-emoji">{currentActivity.user.avatar}</span>
            {currentActivity.user.isOnline && <div className="online-indicator"></div>}
          </div>
          <div className="user-details">
            <div className="user-name">{currentActivity.user.name}</div>
            <div className="activity-time">{formatTimeAgo(currentActivity.timestamp)}</div>
          </div>
        </div>
        <div
          className="action-badge action-badge-dynamic"
          style={{ backgroundColor: getActionColor(currentActivity.type) }}
        >
          {getActionIcon(currentActivity.type)} {currentActivity.action}
        </div>
      </div>

      {/* Project Information */}
      <div className="activity-content">
        <div className="project-info">
          <div className="project-image">{currentActivity.projectImage}</div>
          <div className="project-details">
            <div className="project-name">{currentActivity.project.name}</div>
            <div className="activity-message">{currentActivity.message}</div>
          </div>
        </div>
      </div>

      {/* Activity Footer */}
      <div className="activity-footer">
        <button
          className={`like-button ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
          disabled={liking}
        >
          {isLiked ? '❤️' : '🤍'} {likes}
        </button>
        <button
          className="comment-button"
          onClick={handleComment}
          disabled={commenting}
        >
          💬 {showCommentForm ? (commenting ? 'Posting...' : 'Post') : 'Comment'}
        </button>
        <button 
          className="share-button"
          onClick={(e) => {
            e.stopPropagation();
            console.log('Share project:', currentActivity.project.id);
          }}
        >
          🔗 Share
        </button>
        
        {/* Quick Action Buttons */}
        <div className="quick-actions">
          <button 
            className="quick-action-btn view-btn"
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
              className="quick-action-btn fork-btn"
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

      {/* Comment Form */}
      {showCommentForm && (
        <div className="comment-form" onClick={(e) => e.stopPropagation()}>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="comment-input"
            rows="3"
          />
          <div className="comment-actions">
            <button
              onClick={() => {
                setShowCommentForm(false);
                setCommentText('');
              }}
              className="cancel-comment-btn"
            >
              Cancel
            </button>
            <button
              onClick={handleComment}
              disabled={!commentText.trim() || commenting}
              className="submit-comment-btn"
            >
              {commenting ? 'Posting...' : 'Comment'}
            </button>
          </div>
        </div>
      )}

      {/* Hover Effect Indicator */}
      <div className="project-hover-indicator">
        <span>Click to view project details</span>
      </div>
    </div>
  );
};

export default ProjectPreview;