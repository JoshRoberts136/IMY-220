import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, GitCommit, FileText } from 'lucide-react';
import apiService from '../utils/apiService';
import '../styles.css';

const CreateCommit = ({ isOpen, onClose, projectId, onCommitCreated }) => {
  const [formData, setFormData] = useState({
    message: '',
    filesChanged: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'filesChanged' ? parseInt(value) || 0 : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.message.trim()) {
      setError('Please enter a commit message');
      setLoading(false);
      return;
    }

    if (formData.filesChanged < 1) {
      setError('Files changed must be at least 1');
      setLoading(false);
      return;
    }

    try {
      const user = apiService.getUser();
      
      console.log('Creating commit with projectId:', projectId);
      
      const commitData = {
        message: formData.message.trim(),
        filesChanged: formData.filesChanged,
        projectId: projectId,
        author: user.username,
        userId: user.id
      };
      
      console.log('Commit data:', commitData);
      
      const response = await apiService.createCommit(commitData);

      if (response.success) {
        // Reset form
        setFormData({
          message: '',
          filesChanged: 1
        });
        
        // Notify parent component
        if (onCommitCreated) {
          onCommitCreated(response.commit);
        }
        
        onClose();
      } else {
        setError(response.message || 'Failed to create commit');
      }
    } catch (err) {
      console.error('Error creating commit:', err);
      setError(err.message || 'Failed to create commit');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      message: '',
      filesChanged: 1
    });
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Create New Commit</h2>
          <button
            onClick={handleClose}
            className="close-button"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-message-form">{error}</div>
          )}

          <div className="form-group">
            <label className="form-label">
              <GitCommit size={16} className="form-label-icon" />
              Commit Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="form-input form-textarea"
              rows="5"
              placeholder="Describe the changes you made..."
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <FileText size={16} className="form-label-icon" />
              Files Changed
            </label>
            <input
              type="number"
              name="filesChanged"
              value={formData.filesChanged}
              onChange={handleChange}
              className="form-input"
              min="1"
              placeholder="Number of files changed"
              required
              disabled={loading}
            />
          </div>

          <div className="buttons-container">
            <button
              type="submit"
              className="form-submit"
              disabled={loading}
            >
              {loading ? 'Creating Commit...' : 'Create Commit'}
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

export default CreateCommit;
