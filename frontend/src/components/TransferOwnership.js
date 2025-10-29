import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Crown } from 'lucide-react';
import Button from './Button';
import apiService from '../utils/apiService';

const TransferOwnership = ({ isOpen, onClose, projectId, projectName, members, onTransferred }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const currentUser = apiService.getUser();

  const handleTransfer = async () => {
    if (!selectedMember) {
      setError('Please select a member to transfer ownership to');
      return;
    }

    if (!window.confirm(`Are you sure you want to transfer ownership of "${projectName}" to ${selectedMember.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await apiService.transferProjectOwnership(projectId, selectedMember.id);
      
      if (response.success) {
        if (onTransferred) {
          onTransferred(selectedMember);
        }
        handleClose();
      } else {
        setError(response.message || 'Failed to transfer ownership');
      }
    } catch (err) {
      console.error('Error transferring ownership:', err);
      setError(err.message || 'Failed to transfer ownership');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedMember(null);
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

  const eligibleMembers = members.filter(m => m.id !== currentUser?.id && !m.isOwner);

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
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-orbitron text-2xl font-bold text-apex-orange m-0" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Crown size={24} />
            Transfer Ownership
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

        <div style={{ marginBottom: '20px', padding: '16px', background: 'rgba(139, 0, 0, 0.1)', border: '1px solid var(--apex-orange)', borderRadius: '8px' }}>
          <p style={{ color: '#ccc', margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
            ⚠️ Warning: Transferring ownership will make the selected member the new owner of <strong style={{ color: 'var(--apex-orange)' }}>{projectName}</strong>. You will lose all owner privileges. This action cannot be undone.
          </p>
        </div>

        {eligibleMembers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
            No eligible members to transfer ownership to. Add members to the project first.
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label className="flex items-center mb-2 text-gray-300 font-semibold uppercase tracking-wide text-xs">
                <Crown size={16} className="mr-2" />
                Select New Owner
              </label>
              <div className="user-select-list">
                {eligibleMembers.map((member) => (
                  <div
                    key={member.id}
                    className={`user-select-item ${selectedMember?.id === member.id ? 'selected' : ''}`}
                    onClick={() => setSelectedMember(member)}
                  >
                    <div className="user-select-avatar">
                      {renderAvatar(member.avatar)}
                    </div>
                    <div className="user-select-info">
                      <div className="user-select-name">{member.name}</div>
                      <div className="user-select-email">{member.role}</div>
                    </div>
                    {selectedMember?.id === member.id && (
                      <div className="selected-check">✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <Button
                type="button"
                variant="primary"
                onClick={handleTransfer}
                disabled={loading || !selectedMember}
                icon={Crown}
                className="flex-1"
              >
                {loading ? 'Transferring...' : 'Transfer Ownership'}
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
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

export default TransferOwnership;
