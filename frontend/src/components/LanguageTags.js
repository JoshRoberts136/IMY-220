import React, { useState } from 'react';

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

  const getLevelColor = (level) => {
    switch (level) {
      case 'expert': return 'var(--apex-red)';
      case 'advanced': return 'var(--apex-orange)';
      case 'intermediate': return '#4a5568';
      default: return '#666';
    }
  };

  const getLevelSize = (level) => {
    switch (level) {
      case 'expert': return { padding: '10px 14px', fontSize: '16px' };
      case 'advanced': return { padding: '8px 12px', fontSize: '14px' };
      case 'intermediate': return { padding: '6px 10px', fontSize: '12px' };
      default: return { padding: '4px 8px', fontSize: '11px' };
    }
  };

  return (
    <div>
      <div className="section-title"></div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', paddingBottom: "10px" }}>
        {languages.map((lang, index) => (
          <div
            key={index}
            style={{
              background: getLevelColor(lang.level),
              borderRadius: '20px',
              color: 'white',
              fontWeight: '600',
              ...getLevelSize(lang.level),
            }}
          >
            #{lang.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageTags;