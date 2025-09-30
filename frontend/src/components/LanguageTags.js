import React, { useState } from 'react';
import '../styles.css';

const LanguageTags = () => {
  const [languages] = useState([
    { name: 'Java', level: 'expert' },
    { name: 'C++', level: 'expert' },
    { name: 'Python', level: 'advanced' },
    { name: 'JavaScript', level: 'advanced' },
    { name: 'Rust', level: 'intermediate' },
    { name: 'Go', level: 'intermediate' },
    { name: 'TypeScript', level: 'advanced' },
  ]);

  const getLanguageStyle = (level) => {
    switch (level) {
      case 'expert':
        return {
          background: 'var(--apex-red)',
          padding: '10px 14px',
          fontSize: '16px'
        };
      case 'advanced':
        return {
          background: 'var(--apex-orange)',
          padding: '8px 12px',
          fontSize: '14px'
        };
      case 'intermediate':
        return {
          background: '#4a5568',
          padding: '6px 10px',
          fontSize: '12px'
        };
      default:
        return {
          background: '#4a5568',
          padding: '6px 10px',
          fontSize: '12px'
        };
    }
  };

  return (
    <div className="content-section" style={{ marginBottom: '20px' }}>
      <div className="section-title">Favorite Languages</div>
      <div className="language-tags-container">
        {languages.map((lang, index) => (
          <div
            key={index}
            className="language-tag"
            style={getLanguageStyle(lang.level)}
          >
            #{lang.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageTags;
