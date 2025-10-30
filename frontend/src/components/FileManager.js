import React, { useState, useEffect, useRef } from 'react';
import { Upload, File, X, Download } from 'lucide-react';
import Button from './Button';
import apiService from '../utils/apiService';
import '../styles.css';

const FileManager = ({ projectId }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (projectId) {
      fetchFiles();
    }
  }, [projectId]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await apiService.request(`/projects/${projectId}/files`);
      if (response.success) {
        setFiles(response.files || []);
      } else {
        setFiles([]);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (fileList) => {
    const filesArray = Array.from(fileList);
    
    if (filesArray.length === 0) return;

    setUploading(true);

    try {
      const formData = new FormData();
      filesArray.forEach((file) => {
        formData.append('files', file);
      });

      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/projects/${projectId}/files`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Files uploaded successfully!');
        fetchFiles();
      } else {
        alert(data.message || 'Failed to upload files');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteFile = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await apiService.request(`/projects/${projectId}/files/${fileId}`, {
        method: 'DELETE'
      });
      
      if (response.success) {
        alert('File deleted!');
        fetchFiles();
      } else {
        alert(response.message || 'Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file');
    }
  };

  return (
    <div className="content-section">
      <div className="section-title">Project Files</div>



      {/* Drag and Drop Zone */}
      <div
        className={`file-upload-zone ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragActive ? 'var(--apex-orange)' : '#4a5568'}`,
          borderRadius: '8px',
          padding: '40px 20px',
          textAlign: 'center',
          background: dragActive ? 'rgba(139, 0, 0, 0.1)' : 'rgba(20, 20, 20, 0.3)',
          transition: 'all 0.3s ease',
          marginBottom: '20px',
          cursor: 'pointer'
        }}
        onClick={handleButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleChange}
          style={{ display: 'none' }}
          accept="*/*"
        />
        
        <Upload 
          size={48} 
          color={dragActive ? 'var(--apex-orange)' : '#888'}
          style={{ marginBottom: '16px' }}
        />
        
        <div style={{ color: dragActive ? 'var(--apex-orange)' : 'white', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
          {uploading ? 'Uploading...' : dragActive ? 'Drop files here' : 'Drag & drop files here'}
        </div>
        
        <div style={{ color: '#888', fontSize: '14px', marginBottom: '16px' }}>
          or
        </div>
        
        <Button
          variant="primary"
          icon={Upload}
          onClick={handleButtonClick}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Browse Files'}
        </Button>
      </div>

      {/* Files List */}
      <div className="files-list">
        {loading ? (
          <div className="loading-message">Loading files...</div>
        ) : files.length > 0 ? (
          files.map((file) => (
            <div key={file.id} className="file-item" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
              background: 'rgba(45, 55, 72, 0.3)',
              borderRadius: '8px',
              marginBottom: '8px',
              border: '1px solid rgba(139, 0, 0, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <File size={20} color="var(--apex-orange)" />
                <div>
                  <div style={{ color: 'white', fontWeight: '600' }}>{file.originalName || file.name}</div>
                  <div style={{ color: '#888', fontSize: '12px' }}>
                    {(file.size / 1024).toFixed(2)} KB • {new Date(file.uploadedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <a
                  href={file.path}
                  download={file.originalName}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--apex-orange)',
                    color: 'var(--apex-orange)',
                    borderRadius: '4px',
                    padding: '6px 10px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Download size={16} />
                </a>
                <button
                  onClick={() => handleDeleteFile(file.id)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #ff4444',
                    color: '#ff4444',
                    borderRadius: '4px',
                    padding: '6px 10px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#ff4444';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#ff4444';
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-files-message" style={{
            textAlign: 'center',
            padding: '40px',
            color: '#888'
          }}>
            No files uploaded yet. Upload files to get started!
          </div>
        )}
      </div>
    </div>
  );
};

export default FileManager;
