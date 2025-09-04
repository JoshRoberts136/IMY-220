import React from 'react';
import { useParams } from 'react-router-dom';
import '../styles.css';

function Files() {
  const { projectId } = useParams();

  const getFilesById = (id) => {
    const projects = {
      '1': [
        { name: 'engine/core.cpp', status: 'checked-in', lastModified: '2 hours ago' },
        { name: 'hitbox/detection.js', status: 'checked-out', lastModified: '4 hours ago' },
        { name: 'networking/server.py', status: 'available', lastModified: '1 day ago' }
      ],
      '2': [
        { name: 'physics/jumppad.js', status: 'checked-in', lastModified: '4 hours ago' },
        { name: 'shaders/trajectory.glsl', status: 'available', lastModified: '1 day ago' }
      ],
      '3': [
        { name: 'zipline/physics.py', status: 'checked-in', lastModified: '1 day ago' },
        { name: 'trajectory/calculation.js', status: 'available', lastModified: '2 days ago' }
      ],
      // Add more as needed
    };
    return projects[id] || [];
  };

  const files = getFilesById(projectId);

  return (
    <div className="content-section">
      <h3 className="section-title">Arsenal Files</h3>
      <div className="tabs-placeholder">
        <div className="tab-placeholder active">Files</div>
        <div className="tab-placeholder">Commits</div>
      </div>
      {files.map((file, index) => (
        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', background: '#2a2a2a', padding: '15px', borderRadius: '8px' }}>
          <span>{file.name}</span>
          <span>Checked In</span>
        </div>
      ))}
    </div>
  );
}

export default Files;