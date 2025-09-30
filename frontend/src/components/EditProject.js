import React, { useState } from 'react';
import { X, Code, FileText, Tag, GitBranch, Shield } from 'lucide-react';
import apiService from '../utils/apiService';

function EditProject({ isOpen, onClose, project, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: '',
    languages: '',
    visibility: 'public',
    repository: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Please enter a project name');
      return;
    }

    if (!formData.description.trim()) {
      setError('Please enter a project description');
      return;
    }

    setLoading(true);

    try {
      const processedData = {
        title: formData.name.trim(),
        content: formData.description.trim(),
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        category: formData.languages || 'general',
        status: formData.visibility === 'public' ? 'published' : 'draft'
      };

      const response = await apiService.updatePost(project.id, processedData);

      if (response.success) {
        if (onSave) onSave(response.data);
        if (onClose) onClose();
      } else {
        setError(response.message || 'Failed to update project');
      }
    } catch (err) {
      console.error('Error updating project:', err);
      setError(err.message || 'Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  if (isOpen === undefined) {
    return (
      <button 
        className="flex items-center gap-2 bg-transparent text-apex-orange border-2 border-apex-orange rounded px-5 py-2.5 cursor-pointer transition-all duration-300 mt-4 hover:bg-apex-orange hover:text-white"
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="modal-title">Edit Project</h2>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-gray-400 cursor-pointer p-1 rounded transition-colors duration-300 hover:text-apex-orange"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 mb-4">{error}</div>
          )}

          <div className="form-group">
            <label className="form-label flex items-center">
              <FileText size={16} className="mr-2" />
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
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-input resize-y min-h-[80px]"
              rows="3"
              placeholder="Describe your project"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label flex items-center">
              <Tag size={16} className="mr-2" />
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
            <label className="form-label flex items-center">
              <Code size={16} className="mr-2" />
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
            <label className="form-label flex items-center">
              <Shield size={16} className="mr-2" />
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
            <label className="form-label flex items-center">
              <GitBranch size={16} className="mr-2" />
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

          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              className={`form-submit flex-1 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-5 py-4 bg-transparent border-2 border-gray-600 rounded-md text-gray-400 font-rajdhani font-bold text-lg cursor-pointer transition-all duration-300 uppercase tracking-wider hover:border-apex-orange hover:text-apex-orange"
              disabled={loading}
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
