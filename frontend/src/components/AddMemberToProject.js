import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, UserPlus, Search } from 'lucide-react';
import Button from './Button';
import FormInput from './FormInput';
import apiService from '../utils/apiService';

const AddMemberToProject = ({ isOpen, onClose, projectId, currentMembers, onMemberAdded }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allFriends, setAllFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchFriends();
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFriends([]);
    } else {
      const filtered = allFriends.filter(friend => {
        if (currentMembers && currentMembers.some(m => m.id === friend.id)) {
          return false;
        }
        
        const matchUsername = friend.username?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchEmail = friend.email?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchUsername || matchEmail;
      }).slice(0, 5);
      
      setFilteredFriends(filtered);
    }
  }, [searchQuery, allFriends, currentMembers]);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const response = await apiService.getFriends();
      
      if (response.success) {
        setAllFriends(response.friends || []);
      } else {
        setError('Failed to load friends');
      }
    } catch (err) {
      console.error('Error fetching friends:', err);
      setError('Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUser) {
      setError('Please select a friend to add');
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
    setFilteredFriends([]);
    setError('');
    onClose();
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
          className="w-full h-full object-cover"
          style={{ borderRadius: '50%' }}
        />
      );
    }
    return <span style={{ fontSize: '20px' }}>{avatar || '👤'}</span>;
  };

  if (!isOpen) return null;

  return createPortal(
    <div 
      style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
      className="bg-black/80 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="bg-[rgba(10,10,10,0.95)] border-2 border-apex-orange rounded-xl p-8 w-[90%] max-w-[500px] max-h-[80vh] overflow-y-auto shadow-[0_0_50px_rgba(139,0,0,0.3)] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-orbitron text-2xl font-bold text-apex-orange m-0">
            Add Friend to Project
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

        {allFriends.length === 0 && !loading && (
          <div className="text-center py-6 text-gray-400">
            You need to add friends before you can add them to projects.
          </div>
        )}

        {allFriends.length > 0 && (
          <form onSubmit={(e) => { e.preventDefault(); handleAddMember(); }}>
            <FormInput
              label="Search Friends"
              icon={Search}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username or email..."
              disabled={loading}
            />

            {searchQuery && filteredFriends.length > 0 && (
              <div className="mb-6">
                <label className="flex items-center mb-2 text-gray-300 font-semibold uppercase tracking-wide text-xs">
                  <UserPlus size={16} className="mr-2" />
                  Select Friend
                </label>
                <div className="user-select-list">
                  {filteredFriends.map((friend) => (
                    <div
                      key={friend.id}
                      className={`user-select-item ${selectedUser?.id === friend.id ? 'selected' : ''}`}
                      onClick={() => setSelectedUser(friend)}
                    >
                      <div className="user-select-avatar">
                        {renderAvatar(friend.profile?.avatar || friend.avatar)}
                      </div>
                      <div className="user-select-info">
                        <div className="user-select-name">{friend.username}</div>
                        <div className="user-select-email">{friend.email}</div>
                      </div>
                      {selectedUser?.id === friend.id && (
                        <div className="selected-check">✓</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchQuery && filteredFriends.length === 0 && !loading && (
              <div className="no-results-message">
                No friends found matching your search
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
        )}
      </div>
    </div>,
    document.body
  );
};

export default AddMemberToProject;
