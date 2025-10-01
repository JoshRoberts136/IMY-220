import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, UserPlus, Search } from 'lucide-react';
import Button from './Button';
import FormInput from './FormInput';
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
    <div 
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/80 flex items-center justify-center backdrop-blur-sm z-[9999]"
      onClick={handleClose}
    >
      <div
        className="bg-[rgba(10,10,10,0.95)] border-2 border-apex-orange rounded-xl p-8 w-[90%] max-w-[500px] max-h-[80vh] overflow-y-auto shadow-[0_0_50px_rgba(139,0,0,0.3)] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-orbitron text-2xl font-bold text-apex-orange m-0">
            Add Member to Project
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="bg-transparent border-none text-gray-400 cursor-pointer p-1 rounded transition-colors duration-300 hover:text-apex-orange disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="text-red-400 bg-red-900/20 px-4 py-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleAddMember(); }}>
          <FormInput
            label="Search Users"
            icon={Search}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by username or email..."
            disabled={loading}
          />

          {searchQuery && filteredUsers.length > 0 && (
            <div className="mb-6">
              <label className="flex items-center mb-2 text-gray-300 font-semibold uppercase tracking-wide text-xs">
                <UserPlus size={16} className="mr-2" />
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

          <div className="flex gap-4 mt-8">
            <Button
              type="submit"
              variant="primary"
              disabled={loading || !selectedUser}
              className="flex-1"
            >
              {loading ? 'Adding Member...' : 'Add Member'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default AddMemberToProject;
