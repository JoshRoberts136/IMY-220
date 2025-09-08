import React, { useState } from 'react';
import '../styles.css';

function Files() {
  const [files] = useState([
    { name: 'engine/core.cpp', status: 'checked-in', lastModified: '2 hours ago' },
    { name: 'hitbox/detection.js', status: 'checked-out', lastModified: '4 hours ago' },
    { name: 'networking/server.py', status: 'available', lastModified: '1 day ago' },
  ]);

  return (
    <div className="content-section">
      <h3 className="section-title">Arsenal Files</h3>
      <div className="tabs-placeholder">
        <div className="tab-placeholder active">Files</div>
        <div className="tab-placeholder">Commits</div>
      </div>
      {files.map((file, index) => (
        <div key={index} className="file-item">
          <span>{file.name}</span>
          <span>{file.status}</span>
        </div>
      ))}
    </div>
  );
}

export default Files;