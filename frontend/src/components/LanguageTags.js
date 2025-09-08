import React, { useState, useEffect } from 'react';
import apiService from '../utils/apiService';

const LanguageTags = () => {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLoading(true);
        const response = await apiService.getLanguages();
        if (response.success) {
          setLanguages(response.data);
        }
      } catch (err) {
        console.error('Error fetching languages:', err);
        setError('Failed to load languages');
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

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

  if (loading) {
    return (
      <div>
        <div className="section-title"></div>
        <div className="language-tags-container">
          <div className="text-center text-gray-400">Loading languages...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="section-title"></div>
        <div className="language-tags-container">
          <div className="text-center text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="section-title"></div>
      <div className="language-tags-container">
        {languages.length > 0 ? (
          languages.map((lang) => (
            <div
              key={lang.id}
              className={`language-tag language-tag-${lang.level}`}
              title={`${lang.yearsExperience} years experience, ${lang.projectsCount} projects`}
            >
              #{lang.name}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400">No languages found</div>
        )}
      </div>
    </div>
  );
};

export default LanguageTags;