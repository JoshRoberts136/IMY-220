import React, { useState } from 'react';
import { X, Code, FileText, Tag, Users } from 'lucide-react';

const CreateProject = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: '',
    languages: '',
    visibility: 'public',
    repository: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(5px)'
    }}>
      <div style={{
        background: 'rgba(10, 10, 10, 0.95)',
        border: '2px solid var(--apex-orange)',
        borderRadius: '12px',
        padding: '30px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 0 50px rgba(139, 0, 0, 0.3)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '25px'
        }}>
          <h2 style={{
            fontFamily: 'Orbitron, monospace',
            fontSize: '24px',
            fontWeight: '700',
            color: 'var(--apex-orange)',
            margin: 0
          }}>Create New Project</h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
              padding: '5px',
              borderRadius: '4px',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--apex-orange)'}
            onMouseLeave={(e) => e.target.style.color = '#888'}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <FileText size={16} style={{ marginRight: '8px' }} />
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
              className="form-input"
              rows="3"
              placeholder="Describe your project"
              style={{ resize: 'vertical', minHeight: '80px' }}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Tag size={16} style={{ marginRight: '8px' }} />
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
              <Code size={16} style={{ marginRight: '8px' }} />
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
              <Users size={16} style={{ marginRight: '8px' }} />
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

          <div style={{
            display: 'flex',
            gap: '15px',
            marginTop: '30px'
          }}>
            <button
              type="submit"
              className="form-submit"
              style={{
                flex: 1,
                background: 'linear-gradient(45deg, var(--apex-orange), var(--apex-red))'
              }}
            >
              Create Project
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '18px',
                background: 'transparent',
                border: '2px solid #4a5568',
                borderRadius: '6px',
                color: '#888',
                fontFamily: 'Rajdhani, sans-serif',
                fontWeight: '700',
                fontSize: '18px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'var(--apex-orange)';
                e.target.style.color = 'var(--apex-orange)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#4a5568';
                e.target.style.color = '#888';
              }}
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
