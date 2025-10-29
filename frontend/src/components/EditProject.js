import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Code, FileText, Tag, GitBranch, Shield, Trash2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FormInput from './FormInput';
import Button from './Button';
import apiService from '../utils/apiService';

function EditProject({ isOpen, onClose, project, onSave }) {
  const navigate = useNavigate();
  const modalContentRef = useRef(null);
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
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (isOpen && modalContentRef.current) {
      modalContentRef.current.scrollTop = 0;
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        tags: project.tags?.join(', ') || '',
        languages: project.languages?.join(', ') || '',
        visibility: project.visibility || 'public',
        repository: project.repository || '',
      });
      setShowDeleteConfirmation(false);
      setConfirmText('');
      setDeleteError('');
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

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
    setDeleteError('');
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setConfirmText('');
    setDeleteError('');
  };

  const handleConfirmDelete = async () => {
    if (confirmText.toLowerCase() !== 'delete') {
      setDeleteError('Please type "DELETE" to confirm');
      return;
    }

    try {
      setDeleteLoading(true);
      setDeleteError('');

      const response = await apiService.deleteProject(project.id);

      if (response.success) {
        if (onClose) onClose();
        navigate('/home', { state: { refresh: true } });
      } else {
        setDeleteError(response.message || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      setDeleteError(error.message || 'An error occurred while deleting the project');
    } finally {
      setDeleteLoading(false);
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
      style={{ 
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        overflow: 'hidden'
      }}
    >
      <div
        className="bg-[rgba(10,10,10,0.95)] border-2 border-apex-orange rounded-xl w-[90%] max-w-[500px] shadow-[0_0_50px_rgba(139,0,0,0.3)] relative"
        onClick={(e) => e.stopPropagation()}
        style={{
          height: '85vh',
          maxHeight: '700px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <div className="flex justify-between items-center p-8 pb-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(139, 0, 0, 0.2)' }}>
          <h2 className="font-orbitron text-2xl font-bold text-apex-orange m-0">
            Edit Project
          </h2>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-gray-400 cursor-pointer p-1 rounded transition-colors duration-300 hover:text-apex-orange"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            <X size={24} />
          </button>
        </div>

        <div 
          ref={modalContentRef}
          className="overflow-y-auto flex-1 px-8 py-4"
          style={{
            overflowY: 'auto',
            flex: 1,
            padding: '1.5rem 2rem'
          }}
        >
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

          {!showDeleteConfirmation && (
            <div className="mt-8 pt-6 border-t-2 border-red-900/30">
              <div className="bg-red-900/10 border border-red-500/30 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h3 className="font-orbitron text-red-500 font-bold mb-2">Danger Zone</h3>
                    <p className="text-gray-300 text-sm mb-0">
                      Deleting this project is permanent and cannot be undone. All files, commits, and activity will be removed.
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
                Delete Project
              </Button>
            </div>
          )}

          {showDeleteConfirmation && (
            <div className="mt-8 pt-6 border-t-2 border-red-900/30">
              <div className="bg-red-900/20 border-2 border-red-500 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="text-red-500" size={24} />
                  <h3 className="font-orbitron text-red-500 font-bold text-xl m-0">
                    Confirm Project Deletion
                  </h3>
                </div>

                <p className="text-gray-300 mb-4">
                  This action cannot be undone. This will permanently delete <span className="text-red-500 font-bold">{project.name}</span> including:
                </p>

                <ul className="text-gray-400 text-sm mb-6 ml-6">
                  <li className="mb-2">All project files and code</li>
                  <li className="mb-2">Project activity and commit history</li>
                  <li className="mb-2">Discussion board messages</li>
                  <li className="mb-2">All member associations</li>
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

                {deleteError && (
                  <div className="text-red-400 bg-red-900/30 px-4 py-3 rounded-md mb-4 text-sm">
                    {deleteError}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="danger"
                    onClick={handleConfirmDelete}
                    disabled={deleteLoading || confirmText.toLowerCase() !== 'delete'}
                    className="flex-1"
                  >
                    {deleteLoading ? 'Deleting...' : 'Yes, Delete My Project'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleCancelDelete}
                    disabled={deleteLoading}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default EditProject;
