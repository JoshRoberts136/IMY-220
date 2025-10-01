import React, { useState } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import apiService from '../utils/apiService';

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
      <Button
        variant="danger"
        icon={Trash2}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('Delete button clicked');
          setShowConfirm(true);
        }}
      >
        Delete Project
      </Button>
    );
  }

  return (
    <div 
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/80 flex items-center justify-center backdrop-blur-sm z-[9999]"
      onClick={() => !loading && setShowConfirm(false)}
    >
      <div
        className="bg-[rgba(10,10,10,0.95)] border-2 border-apex-orange rounded-xl p-8 w-[90%] max-w-[500px] max-h-[80vh] overflow-y-auto shadow-[0_0_50px_rgba(139,0,0,0.3)] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-orbitron text-2xl font-bold text-apex-orange m-0">
            Delete Project
          </h2>
          <button
            onClick={() => !loading && setShowConfirm(false)}
            disabled={loading}
            className="bg-transparent border-none text-gray-400 cursor-pointer p-1 rounded transition-colors duration-300 hover:text-apex-orange disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Warning Content */}
        <div className="text-center py-8 px-5 bg-red-500/10 rounded-lg mb-5">
          <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-white text-lg mb-3 font-semibold">
            Are you sure you want to delete <strong className="text-apex-orange">{projectName}</strong>?
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            This action cannot be undone. All project data, commits, and files will be permanently deleted.
          </p>
        </div>

        {error && (
          <div className="text-red-400 mb-4 text-sm text-center bg-red-500/10 p-3 rounded">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <Button
            variant="danger"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDelete();
            }}
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Deleting...' : 'Yes, Delete Project'}
          </Button>
          <Button
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowConfirm(false);
            }}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProject;
