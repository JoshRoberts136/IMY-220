import React, { useState } from 'react';
import { X, Code, FileText, Tag, Users } from 'lucide-react';
import apiService from '../utils/apiService';

const CreateProject = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: '',
    languages: '',
    visibility: 'public',
    repository: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Map form data to API format
      const postData = {
        title: formData.name,
        content: formData.description,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        category: formData.languages || 'general',
        status: formData.visibility === 'public' ? 'published' : 'draft'
      };

      const response = await apiService.createPost(postData);

      if (response.success) {
        onSave(response.data);
        onClose();
        // Reset form
        setFormData({
          name: '',
          description: '',
          tags: '',
          languages: '',
          visibility: 'public',
          repository: ''
        });
      } else {
        setError(response.message || 'Failed to create project');
      }
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Create New Project</h2>
          <button
            onClick={onClose}
            className="close-button"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <FileText size={16} className="icon-margin-right" />
              Project Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter project name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-input textarea-resize"
              rows="3"
              placeholder="Describe your project"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Tag size={16} className="icon-margin-right" />
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., React, Node.js, AI (comma separated)"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Code size={16} className="icon-margin-right" />
              Languages
            </label>
            <input
              type="text"
              name="languages"
              value={formData.languages}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., JavaScript, Python (comma separated)"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Users size={16} className="icon-margin-right" />
              Visibility
            </label>
            <select
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
              className="form-input"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="team">Team Only</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Repository URL
            </label>
            <input
              type="url"
              name="repository"
              value={formData.repository}
              onChange={handleChange}
              className="form-input"
              placeholder="https://github.com/username/project"
            />
          </div>

          {error && (
            <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
              {error}
            </div>
          )}

          <div className="buttons-container">
            <button
              type="submit"
              className="form-submit submit-button-inline"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="cancel-button-inline"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
