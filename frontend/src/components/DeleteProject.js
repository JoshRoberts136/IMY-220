import React, { useState } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import apiService from '../utils/apiService';

const DeleteProject = ({ projectId, projectName, onDeleted, disabled }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(true);
    setConfirmText('');
    setError('');
  };

  const handleCancel = () => {
    setShowConfirm(false);
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
      
      const response = await apiService.deleteProject(projectId);
      
      if (response.success) {
        setShowConfirm(false);
        if (onDeleted) {
          onDeleted();
        }
        navigate('/home');
      } else {
        setError(response.message || 'Failed to delete project');
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      setError(err.message || 'Failed to delete project');
    } finally {
      setLoading(false);
    }
  };

  if (!showConfirm) {
    return (
      <Button
        variant="danger"
        icon={Trash2}
        onClick={handleDeleteClick}
        disabled={disabled}
      >
        Delete Project
      </Button>
    );
  }

  return (
    <div 
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/80 flex items-center justify-center backdrop-blur-sm z-[9999]"
      onClick={() => !loading && handleCancel()}
      style={{ position: 'fixed', zIndex: 9999 }}
    >
      <div
        className="bg-[rgba(10,10,10,0.95)] border-2 border-red-500 rounded-xl p-8 w-[90%] max-w-[500px] max-h-[80vh] overflow-y-auto shadow-[0_0_50px_rgba(220,38,38,0.3)] relative"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-orbitron text-2xl font-bold text-red-500 m-0 flex items-center gap-3">
            <AlertTriangle size={28} />
            Confirm Deletion
          </h2>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="bg-transparent border-none text-gray-400 cursor-pointer p-1 rounded transition-colors duration-300 hover:text-red-500 disabled:opacity-50"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '24px' }}
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-300 mb-4" style={{ color: '#d1d5db', marginBottom: '1rem' }}>
            This action cannot be undone. This will permanently delete <span className="text-red-500 font-bold" style={{ color: '#ef4444', fontWeight: 'bold' }}>{projectName}</span> including:
          </p>

          <ul className="text-gray-400 text-sm mb-6 ml-6 list-disc" style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '1.5rem', marginLeft: '1.5rem', listStyle: 'disc' }}>
            <li className="mb-2" style={{ marginBottom: '0.5rem' }}>All project files and code</li>
            <li className="mb-2" style={{ marginBottom: '0.5rem' }}>Project activity and commit history</li>
            <li className="mb-2" style={{ marginBottom: '0.5rem' }}>Discussion board messages</li>
            <li className="mb-2" style={{ marginBottom: '0.5rem' }}>All member associations</li>
          </ul>
        </div>

        <div className="mb-4" style={{ marginBottom: '1rem' }}>
          <label 
            className="block text-gray-300 font-rajdhani text-sm font-medium mb-2"
            style={{ display: 'block', color: '#d1d5db', fontSize: '14px', fontWeight: '500', marginBottom: '0.5rem' }}
          >
            Type <span className="text-red-500 font-bold" style={{ color: '#ef4444', fontWeight: 'bold' }}>DELETE</span> to confirm:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE"
            style={{
              width: '100%',
              background: 'rgba(20,20,20,0.8)',
              border: '2px solid rgba(239,68,68,0.5)',
              borderRadius: '8px',
              padding: '12px 16px',
              color: '#e5e7eb',
              fontSize: '14px',
              fontFamily: 'Rajdhani, sans-serif',
              outline: 'none',
              transition: 'all 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#ef4444'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(239,68,68,0.5)'}
          />
        </div>

        {error && (
          <div 
            className="text-red-400 bg-red-900/30 px-4 py-3 rounded-md mb-4 text-sm"
            style={{ color: '#f87171', background: 'rgba(127,29,29,0.3)', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '14px' }}
          >
            {error}
          </div>
        )}

        <div className="flex gap-4 mt-6" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <Button
            variant="danger"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleConfirmDelete();
            }}
            disabled={loading || confirmText.toLowerCase() !== 'delete'}
            className="flex-1"
            style={{ flex: 1 }}
          >
            {loading ? 'Deleting...' : 'Yes, Delete Project'}
          </Button>
          <Button
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleCancel();
            }}
            disabled={loading}
            className="flex-1"
            style={{ flex: 1 }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProject;
