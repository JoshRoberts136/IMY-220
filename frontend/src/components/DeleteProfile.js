import React, { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import Button from './Button';
import ThemeToggle from './ThemeToggle';
import apiService from '../utils/apiService';
import { useNavigate } from 'react-router-dom';

const DeleteProfile = ({ onDelete }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDeleteClick = () => {
    setShowConfirmation(true);
    setError('');
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setConfirmText('');
    setError('');
  };

  const handleConfirmDelete = async () => {
    if (confirmText.toLowerCase() !== 'delete') {
      setError('Please type "DELETE" to confirm');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await apiService.deleteProfile();

      if (response.success) {
        apiService.clearAuth();
        
        if (onDelete) {
          onDelete();
        }
        
        navigate('/');
      } else {
        setError(response.message || 'Failed to delete profile');
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      setError(error.message || 'An error occurred while deleting your profile');
    } finally {
      setLoading(false);
    }
  };

  if (!showConfirmation) {
    return (
      <div className="mt-8 pt-6 border-t-2 border-red-900/30">
        <ThemeToggle />
        
        <div className="bg-red-900/10 border border-red-500/30 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-red-500 flex-shrink-0 mt-1" size={20} />
            <div>
              <h3 className="font-orbitron text-red-500 font-bold mb-2">Danger Zone</h3>
              <p className="text-gray-300 text-sm mb-0">
                Deleting your profile is permanent and cannot be undone. All your projects, activity, and connections will be removed.
              </p>
            </div>
          </div>
        </div>
        <Button
          variant="danger"
          icon={Trash2}
          onClick={handleDeleteClick}
          className="w-full"
        >
          Delete Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 pt-6 border-t-2 border-red-900/30">
      <ThemeToggle />
      
      <div className="bg-red-900/20 border-2 border-red-500 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="text-red-500" size={24} />
          <h3 className="font-orbitron text-red-500 font-bold text-xl m-0">
            Confirm Profile Deletion
          </h3>
        </div>

        <p className="text-gray-300 mb-4">
          This action cannot be undone. This will permanently delete your account, including:
        </p>

        <ul className="text-gray-400 text-sm mb-6 ml-6">
          <li className="mb-2">All your projects and files</li>
          <li className="mb-2">Your activity history and commits</li>
          <li className="mb-2">All connections with friends</li>
          <li className="mb-2">Your profile information</li>
        </ul>

        <div className="mb-4">
          <label className="block text-gray-300 font-rajdhani text-sm font-medium mb-2">
            Type <span className="text-red-500 font-bold">DELETE</span> to confirm:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE"
            className="w-full bg-[rgba(20,20,20,0.8)] border-2 border-red-500/50 rounded-lg px-4 py-3 text-gray-200 font-rajdhani transition-all duration-300 focus:outline-none focus:border-red-500 focus:shadow-[0_0_15px_rgba(220,38,38,0.3)]"
          />
        </div>

        {error && (
          <div className="text-red-400 bg-red-900/30 px-4 py-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            disabled={loading || confirmText.toLowerCase() !== 'delete'}
            className="flex-1"
          >
            {loading ? 'Deleting...' : 'Yes, Delete My Profile'}
          </Button>
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProfile;
