import React, { useState, useEffect } from 'react';
import { X, Users, Search } from 'lucide-react';
import apiService from '../utils/apiService';

const AddMember = ({ isOpen, onClose, projectId, currentMembers, onMemberAdded }) => {
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchFriends();
    }
  }, [isOpen]);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const currentUser = apiService.getUser();
      
      if (currentUser && currentUser.friends) {
        // Filter out friends who are already members
        const availableFriends = currentUser.friends.filter(
          friendId => !currentMembers.includes(friendId)
        );
        
        // Fetch friend details
        const friendDetails = [];
        for (const friendId of availableFriends) {
          try {
            const userResponse = await apiService.getUserById(friendId);
            if (userResponse && userResponse.success !== false) {
              friendDetails.push({
                id: userResponse.id,
                username: userResponse.username,
                avatar: userResponse.profile?.avatar || '👤',
                title: userResponse.profile?.title || 'Developer'
              });
            }
          } catch (err) {
            console.log(`Could not fetch friend ${friendId}`);
          }
        }
        
        setFriends(friendDetails);
      }
    } catch (err) {
      console.error('Error fetching friends:', err);
      setError('Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!selectedFriend) {
      setError('Please select a friend to add');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await apiService.addProjectMember(projectId, selectedFriend.id);
      
      if (response.success) {
        if (onMemberAdded) {
          onMemberAdded(selectedFriend);
        }
        onClose();
      } else {
        setError(response.message || 'Failed to add member');
      }
    } catch (err) {
      console.error('Error adding member:', err);
      setError('Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  const filteredFriends = friends.filter(friend =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Add Member</h2>
          <button onClick={onClose} className="close-button">
            <X size={24} />
          </button>
        </div>
        
        {error && (
          <div className="error-message-inline">
            {error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">
            <Search size={16} className="form-label-icon" />
            Search Friends
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            placeholder="Search by username..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <Users size={16} className="form-label-icon" />
            Select Friend
          </label>
          <div className="friends-list-container">
            {loading ? (
              <div className="loading-message">Loading friends...</div>
            ) : filteredFriends.length === 0 ? (
              <div className="no-friends-message">
                {searchQuery ? 'No friends found matching your search' : 'No available friends to add'}
              </div>
            ) : (
              filteredFriends.map((friend) => (
                <div
                  key={friend.id}
                  className={`friend-select-item ${selectedFriend?.id === friend.id ? 'selected' : ''}`}
                  onClick={() => setSelectedFriend(friend)}
                >
                  <div className="friend-select-avatar">
                    {friend.avatar}
                  </div>
                  <div className="friend-select-info">
                    <div className="friend-select-name">{friend.username}</div>
                    <div className="friend-select-title">{friend.title}</div>
                  </div>
                  {selectedFriend?.id === friend.id && (
                    <div className="selected-indicator">✓</div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="buttons-container">
          <button
            type="button"
            className="form-submit"
            onClick={handleAddMember}
            disabled={loading || !selectedFriend}
          >
            {loading ? 'Adding Member...' : 'Add Member'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="cancel-button"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMember;
