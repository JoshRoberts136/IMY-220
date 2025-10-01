import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import CreateCommit from './CreateCommit';
import apiService from '../utils/apiService';
import '../styles.css';

function Files({ projectId, project, onCommitCreated }) {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateCommitOpen, setIsCreateCommitOpen] = useState(false);
  const [canCommit, setCanCommit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (projectId) {
      fetchCommits();
      checkCommitPermission();
    }
  }, [projectId, project]);

  const checkCommitPermission = () => {
    const currentUser = apiService.getUser();
    if (!currentUser || !project) {
      setCanCommit(false);
      return;
    }

    const userId = currentUser.id || currentUser._id;
    const isOwner = project.owner?.id === userId;
    const isMember = project.members?.some(member => 
      member === userId || member.id === userId || member._id === userId
    );

    setCanCommit(isOwner || isMember);
  };

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

  const handleCommitCreated = async (newCommit) => {
    // Refresh commits list
    await fetchCommits();
    
    // Notify parent component if callback provided
    if (onCommitCreated) {
      onCommitCreated(newCommit);
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
      <div className="content-section">
        <div className="commits-header">
          <h3 className="section-title">Commits</h3>
        </div>
        <div className="loading-message">Loading commits...</div>
      </div>
    );
  }

  return (
    <div className="content-section">
      <div className="commits-header">
        <h3 className="section-title">Commits ({commits.length})</h3>
        {canCommit && (
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => {
              console.log('New Commit button clicked');
              setIsCreateCommitOpen(true);
            }}
          >
            New Commit
          </Button>
        )}
      </div>
      
      <div className="commits-list">
        {commits.length > 0 ? (
          commits.map((commit) => (
            <div key={commit.id || commit._id} className="commit-item">
              <div className="commit-header">
                <div 
                  className="commit-author clickable-author"
                  onClick={() => handleUserClick(commit.userId)}
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
          <div className="no-commits">
            {canCommit ? 'No commits yet. Create your first commit!' : 'No commits yet'}
          </div>
        )}
      </div>

      <CreateCommit
        isOpen={isCreateCommitOpen}
        onClose={() => setIsCreateCommitOpen(false)}
        projectId={projectId}
        onCommitCreated={handleCommitCreated}
      />
    </div>
  );
}

export default Files;
