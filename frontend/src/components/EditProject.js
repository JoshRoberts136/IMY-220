import React from 'react';
import '../styles.css';

function EditProject() {
  return (
    <button className="btn" onClick={() => console.log('Edit project clicked')}>
      Edit Project
    </button>
  );
}

export default EditProject;