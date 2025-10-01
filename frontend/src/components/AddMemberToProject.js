import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, UserPlus, Search } from 'lucide-react';
import apiService from '../utils/apiService';

const AddMemberToProject = ({ isOpen, onClose, projectId, currentMembers, onMemberAdded }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers([]);
    } else {
      const filtered = allUsers.filter(user => {
        // Don't show users who are already members
        if (currentMembers && currentMembers.includes(user.id)) {
          return false;
        }
        
        const matchUsername = user.username?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchEmail = user.email?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchUsername || matchEmail;
      }).slice(0, 5);
      
      setFilteredUsers(filtered);
    }
  }, [searchQuery, allUsers, currentMembers]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.request('/users');
      
      // Handle both array response and object response
      const usersList = Array.isArray(response) ? response : (response.users || []);
      
      // Filter out current user
      const currentUser = apiService.getUser();
      const filteredList = usersList.filter(user => user.id !== currentUser.id);
      
      setAllUsers(filteredList);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUser) {
      setError('Please select a user to add');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await apiService.addProjectMember(projectId, selectedUser.id);
      
      if (response.success) {
        if (onMemberAdded) {
          onMemberAdded(selectedUser);
        }
        handleClose();
      } else {
        setError(response.message || 'Failed to add member');
      }
    } catch (err) {
      console.error('Error adding member:', err);
      setError(err.message || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedUser(null);
    setFilteredUsers([]);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Add Member to Project</h2>
          <button onClick={handleClose} className="close-button" disabled={loading}>
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="error-message-form">{error}</div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleAddMember(); }}>
          <div className="form-group">
            <label className="form-label">
              <Search size={16} className="form-label-icon" />
              Search Users
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              placeholder="Search by username or email..."
              disabled={loading}
            />
          </div>

          {searchQuery && filteredUsers.length > 0 && (
            <div className="form-group">
              <label className="form-label">
                <UserPlus size={16} className="form-label-icon" />
                Select User
              </label>
              <div className="user-select-list">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`user-select-item ${selectedUser?.id === user.id ? 'selected' : ''}`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="user-select-avatar">
                      {user.profile?.avatar || '👤'}
                    </div>
                    <div className="user-select-info">
                      <div className="user-select-name">{user.username}</div>
                      <div className="user-select-email">{user.email}</div>
                    </div>
                    {selectedUser?.id === user.id && (
                      <div className="selected-check">✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchQuery && filteredUsers.length === 0 && !loading && (
            <div className="no-results-message">
              No users found matching your search
            </div>
          )}

          <div className="buttons-container">
            <button
              type="submit"
              className="form-submit"
              disabled={loading || !selectedUser}
            >
              {loading ? 'Adding Member...' : 'Add Member'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="cancel-button"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default AddMemberToProject;
