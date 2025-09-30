import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../utils/apiService';
import '../styles.css';

const Commits = ({ projectId }) => {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (projectId) {
      fetchCommits();
    }
  }, [projectId]);

  const fetchCommits = async () => {
    try {
      setLoading(true);
      const response = await apiService.request(`/projects/project-commits/${projectId}`);
      
      if (response.success && response.commits) {
        setCommits(response.commits);
      } else {
        setCommits([]);
      }
    } catch (error) {
      console.error('Error fetching commits:', error);
      setCommits([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'recently';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  };

  const handleUserClick = (userId) => {
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };

  if (loading) {
    return (
      <div className="commits-container">
        <h3 className="section-title">Recent Commits</h3>
        <div>Loading commits...</div>
      </div>
    );
  }

  return (
    <div className="commits-container">
      <h3 className="section-title">Recent Commits ({commits.length})</h3>
      <div className="commits-list">
        {commits.length > 0 ? (
          commits.map((commit) => (
            <div key={commit.id || commit._id} className="commit-item">
              <div className="commit-header">
                <div 
                  className="commit-author"
                  onClick={() => handleUserClick(commit.userId)}
                  className="clickable-author"
                >
                  <span className="commit-avatar">{commit.userAvatar}</span>
                  <span className="commit-username">{commit.username || commit.author}</span>
                </div>
                <div className="commit-time">{formatTimeAgo(commit.timestamp)}</div>
              </div>
              <div className="commit-message">{commit.message}</div>
              <div className="commit-footer">
                <span className="commit-hash">{commit.hash?.substring(0, 7)}</span>
                <span className="commit-files">{commit.filesChanged} file{commit.filesChanged !== 1 ? 's' : ''} changed</span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-commits">No commits yet</div>
        )}
      </div>
    </div>
  );
};

export default Commits;
