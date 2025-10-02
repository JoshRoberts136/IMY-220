import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Code, FileText, Tag, Users } from 'lucide-react';
import FormInput from './FormInput';
import Button from './Button';
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
      const projectData = {
        name: formData.name,
        description: formData.description,
        hashtags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        type: formData.languages || 'web-application'
      };
      
      const response = await apiService.createProject(projectData);

      if (response.success) {
        onSave(response.data);
        onClose();
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
      
      setError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

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
            Create New Project
          </h2>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-gray-400 cursor-pointer p-1 rounded transition-colors duration-300 hover:text-apex-orange"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
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
            icon={FileText}
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
              <Users size={16} className="mr-2" />
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
            type="url"
            name="repository"
            value={formData.repository}
            onChange={handleChange}
            placeholder="https://github.com/username/project"
          />

          {error && (
            <div className="text-red-400 bg-red-900/20 px-4 py-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-4 mt-8">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Creating...' : 'Create Project'}
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
};

export default CreateProject;
