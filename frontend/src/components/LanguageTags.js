import React from 'react';
import '../styles.css';

const LanguageTags = ({ languages }) => (
  <div className="bg-gray-800 p-6 rounded-lg border border-red-900">
    <h3 className="text-xl font-semibold text-red-500 mb-4">Favorite Languages</h3>
    <div className="flex flex-wrap gap-2">
      {languages.map((lang, index) => (
        <span
          key={index}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            lang.level === 'expert' ? 'bg-red-600 text-white text-base px-4 py-2' :
            lang.level === 'advanced' ? 'bg-orange-600 text-white' :
            'bg-gray-600 text-gray-200'
          }`}
        >
          #{lang.name}
        </span>
      ))}
    </div>
  </div>
);

export default LanguageTags;