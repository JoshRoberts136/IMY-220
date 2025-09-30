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

  return (
    <div className="content-section">
      <div className="section-title">Favorite Languages</div>
      <div className="flex flex-wrap gap-2.5 pb-2.5">
        {languages.map((lang, index) => (
          <div
            key={index}
            className={`rounded-[20px] text-white font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 ${
              lang.level === 'expert' 
                ? 'bg-apex-red px-3.5 py-2.5 text-base' 
                : lang.level === 'advanced'
                ? 'bg-apex-orange px-3 py-2 text-sm'
                : 'bg-gray-600 px-2.5 py-1.5 text-xs'
            }`}
          >
            #{lang.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageTags;
