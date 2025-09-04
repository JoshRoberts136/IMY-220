import React from 'react';
import '../styles.css';

function EditProject() {
  return (
    <div className="wireframe-layout">
      <div className="layout-label">Edit Project</div>
      <div className="content-section">
        <h3 className="section-title">Edit Project</h3>
        <div className="form-group">
          <label>Name</label>
          <input className="form-input-placeholder" placeholder="Project Name" />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea className="form-input-placeholder" placeholder="Project Description"></textarea>
        </div>
        <button className="btn">Save Changes</button>
      </div>
    </div>
  );
}

export default EditProject;