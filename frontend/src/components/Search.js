import React, { useState, useRef, useEffect } from 'react';
import '../styles.css';

const Search = ({ onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Mock search suggestions
  const mockSuggestions = [
    { type: 'user', name: 'WraithRunner', subtitle: 'Senior Legend' },
    { type: 'user', name: 'OctaneSpeed', subtitle: 'Speed Demon' },
    { type: 'project', name: 'Battle Royale Engine', subtitle: '#JavaScript #React' },
    { type: 'project', name: 'Jump Pad Physics', subtitle: '#Python #Physics' },
    { type: 'hashtag', name: '#JavaScript', subtitle: '45 projects' },
    { type: 'hashtag', name: '#React', subtitle: '32 projects' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 0) {
      setIsSearching(true);
      // Filter suggestions based on query
      const filtered = mockSuggestions.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
     
      // Simulate search delay
      setTimeout(() => {
        setIsSearching(false);
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name);
    setShowSuggestions(false);
    if (onSearchResults) {
      onSearchResults(suggestion);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'user': return '👤';
      case 'project': return '📁';
      case 'hashtag': return '#';
      default: return '🔍';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'user': return '#8b0000';
      case 'project': return '#ff3333';
      case 'hashtag': return '#666';
      default: return '#8b0000';
    }
  };

  return (
    <div className="search-container" ref={searchRef}>
      <div className="search-input-wrapper">
        <div className="search-icon">
          {isSearching ? (
            <div className="search-loading"></div>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          )}
        </div>
        <input
          type="text"
          placeholder="Search legends, projects, or hashtags..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
        />
        <div className="search-shortcut">Ctrl+K</div>
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div className="search-suggestions">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="search-suggestion"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="suggestion-icon" style={{ color: getTypeColor(suggestion.type) }}>
                {getTypeIcon(suggestion.type)}
              </div>
              <div className="suggestion-content">
                <div className="suggestion-name">{suggestion.name}</div>
                <div className="suggestion-subtitle">{suggestion.subtitle}</div>
              </div>
              <div className="suggestion-type">{suggestion.type}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;