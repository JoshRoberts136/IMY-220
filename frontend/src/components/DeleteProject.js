import React, { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiService from '../utils/apiService';
import '../styles.css';

const DeleteProject = ({ projectId, projectName, onDeleted }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDelete = async () => {
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
      setError('Failed to delete project');
    } finally {
      setLoading(false);
    }
  };

  if (!showConfirm) {
    return (
      <button
        className="btn btn-danger btn-with-icon"
        onClick={() => setShowConfirm(true)}
      >
        <Trash2 className="icon-sm" />
        Delete Project
      </button>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Delete Project</h2>
          <button
            onClick={() => setShowConfirm(false)}
            className="close-button"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <div className="delete-warning">
          <AlertTriangle size={48} className="warning-icon" />
          <p className="warning-text">
            Are you sure you want to delete <strong>{projectName}</strong>?
          </p>
          <p className="warning-subtext">
            This action cannot be undone. All project data, commits, and files will be permanently deleted.
          </p>
        </div>

        {error && (
          <div className="error-message-inline">
            {error}
          </div>
        )}

        <div className="buttons-container">
          <button
            onClick={handleDelete}
            className="btn btn-danger-solid"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Yes, Delete Project'}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
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

export default DeleteProject;
