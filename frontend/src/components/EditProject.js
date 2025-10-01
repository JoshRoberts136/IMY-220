import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Code, FileText, Tag, GitBranch, Shield } from 'lucide-react';
import FormInput from './FormInput';
import Button from './Button';
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
        name: formData.name.trim(),
        description: formData.description.trim(),
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        languages: formData.languages ? formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang) : [],
        visibility: formData.visibility,
        repository: formData.repository.trim()
      };

      const response = await apiService.updateProject(project.id, processedData);

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
      <Button variant="warning" icon={FileText} onClick={() => console.log('Edit project clicked')}>
        Edit Project
      </Button>
    );
  }

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/80 flex items-center justify-center backdrop-blur-sm z-[9999]"
      onClick={onClose}
    >
      <div
        className="bg-[rgba(10,10,10,0.95)] border-2 border-apex-orange rounded-xl p-8 w-[90%] max-w-[500px] max-h-[80vh] overflow-y-auto shadow-[0_0_50px_rgba(139,0,0,0.3)] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-orbitron text-2xl font-bold text-apex-orange m-0">
            Edit Project
          </h2>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-gray-400 cursor-pointer p-1 rounded transition-colors duration-300 hover:text-apex-orange"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-400 bg-red-900/20 px-4 py-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          <FormInput
            label="Project Name"
            icon={FileText}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter project name"
            required
          />

          <FormInput
            label="Description"
            type="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Describe your project"
            required
          />

          <FormInput
            label="Tags"
            icon={Tag}
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., React, Node.js, AI (comma separated)"
          />

          <FormInput
            label="Languages"
            icon={Code}
            type="text"
            name="languages"
            value={formData.languages}
            onChange={handleChange}
            placeholder="e.g., JavaScript, Python (comma separated)"
          />

          <div className="mb-6">
            <label className="flex items-center mb-2 text-gray-300 font-semibold uppercase tracking-wide text-xs">
              <Shield size={16} className="mr-2" />
              Visibility
            </label>
            <select
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
              className="w-full px-4 py-4 bg-[rgba(20,20,20,0.9)] border-2 border-gray-600 rounded-md text-white font-rajdhani text-base transition-all duration-300 focus:outline-none focus:border-apex-orange focus:shadow-[0_0_15px_rgba(139,0,0,0.3)] focus:bg-gray-700"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="team">Team Only</option>
            </select>
          </div>

          <FormInput
            label="Repository URL"
            icon={GitBranch}
            type="url"
            name="repository"
            value={formData.repository}
            onChange={handleChange}
            placeholder="https://github.com/username/project"
          />

          <div className="flex gap-4 mt-8">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
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
}

export default EditProject;
