import React from 'react';
import '../styles.css';

function Files({ files }) {
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