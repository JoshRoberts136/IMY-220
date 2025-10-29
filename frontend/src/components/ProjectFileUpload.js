import React, { useState } from 'react';
import { Upload, X, File } from 'lucide-react';
import '../css/ProjectFileUpload.css';

const ProjectFileUpload = ({ projectId, onUploadSuccess }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setError('');
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select files to upload');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('You must be logged in to upload files');
        setUploading(false);
        return;
      }

      const response = await fetch(`/api/projects/${projectId}/files`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        if (onUploadSuccess) {
          onUploadSuccess(data.files);
        }
        setFiles([]);
        setError('');
      } else {
        setError(data.message || 'Failed to upload files');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="project-file-upload">
      <div className="upload-section">
        <label className="file-input-label">
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="flex items-center gap-2 cursor-pointer">
            <Upload size={20} />
            <span>Select Files</span>
          </div>
        </label>

        {files.length > 0 && (
          <div className="selected-files">
            <h4>Selected Files ({files.length})</h4>
            <div className="file-list">
              {files.map((file, index) => (
                <div key={index} className="file-item">
                  <File size={16} />
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">
                    ({(file.size / 1024).toFixed(2)} KB)
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="remove-btn"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {files.length > 0 && (
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className="upload-btn"
          >
            {uploading ? 'Uploading...' : 'Upload Files'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectFileUpload;
