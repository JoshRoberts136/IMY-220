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

  const getLanguageClass = (level) => {
    switch (level) {
      case 'expert':
        return 'language-tag-expert';
      case 'advanced':
        return 'language-tag-advanced';
      case 'intermediate':
        return 'language-tag-intermediate';
      default:
        return 'language-tag-beginner';
    }
  };

  return (
    <div className="content-section language-tags-section">
      <div className="section-title">Favorite Languages</div>
      <div className="language-tags-container">
        {languages.map((lang, index) => (
          <div
            key={index}
            className="language-tag"
            className={getLanguageClass(lang.level)}
          >
            #{lang.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageTags;
