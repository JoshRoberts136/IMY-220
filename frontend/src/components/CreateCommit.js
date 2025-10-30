import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, GitCommit, FileText } from 'lucide-react';
import Button from './Button';
import FormInput from './FormInput';
import apiService from '../utils/apiService';

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
      
      const commitData = {
        message: formData.message.trim(),
        filesChanged: formData.filesChanged,
        projectId: projectId,
        author: user.username,
        userId: user.id
      };
      
      const response = await apiService.createCommit(commitData);

      if (response.success) {
        setFormData({
          message: '',
          filesChanged: 1
        });

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
    <div 
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/80 flex items-center justify-center backdrop-blur-sm z-[9999]"
      onClick={handleClose}
    >
      <div
        className="bg-[rgba(10,10,10,0.95)] border-2 border-apex-orange rounded-xl p-8 w-[90%] max-w-[500px] max-h-[80vh] overflow-y-auto shadow-[0_0_50px_rgba(139,0,0,0.3)] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-orbitron text-2xl font-bold text-apex-orange m-0">
            Create New Commit
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="bg-transparent border-none text-gray-400 cursor-pointer p-1 rounded transition-colors duration-300 hover:text-apex-orange disabled:opacity-50"
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
            label="Commit Message"
            icon={GitCommit}
            type="textarea"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            placeholder="Describe the changes you made..."
            required
            disabled={loading}
          />

          <FormInput
            label="Files Changed"
            icon={FileText}
            type="number"
            name="filesChanged"
            value={formData.filesChanged}
            onChange={handleChange}
            min="1"
            placeholder="Number of files changed"
            required
            disabled={loading}
          />

          <div className="flex gap-4 mt-8">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Creating Commit...' : 'Create Commit'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
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

export default CreateCommit;
