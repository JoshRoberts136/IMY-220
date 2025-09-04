import React, { useState } from 'react';
import { X, Code, FileText, Tag, Users, GitBranch, Shield } from 'lucide-react';
import '../styles.css';

function EditProject({ isOpen, onClose, project, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: '',
    languages: '',
    visibility: 'public',
    repository: '',
  });

  // Update form data when project changes
  React.useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        tags: project.tags?.join(', ') || '',
        languages: project.languages?.join(', ') || '',
        visibility: project.visibility || 'public',
        repository: project.repository || '',
      });
    }
  }, [project]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim()) {
      alert('Please enter a project name');
      return;
    }
    
    if (!formData.description.trim()) {
      alert('Please enter a project description');
      return;
    }
    
    const processedData = {
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim(),
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      languages: formData.languages ? formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang) : [],
      repository: formData.repository.trim()
    };
    
    if (onSave) onSave(processedData);
    if (onClose) onClose();
  };

  // If not using modal mode, just return a button
  if (isOpen === undefined) {
    return (
      <button 
        className="edit-button"
        onClick={() => console.log('Edit project clicked')}
      >
        <FileText size={16} />
        Edit Project
      </button>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Edit Project</h2>
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
              <FileText size={16} className="form-label-icon" />
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
              className="form-input form-textarea"
              rows="3"
              placeholder="Describe your project"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Tag size={16} className="form-label-icon" />
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
              <Code size={16} className="form-label-icon" />
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
              <Shield size={16} className="form-label-icon" />
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
              <GitBranch size={16} className="form-label-icon" />
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

          <div className="buttons-container">
            <button
              type="submit"
              className="form-submit"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProject;