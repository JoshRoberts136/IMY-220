import React, { useState, useRef, useEffect } from 'react';

const Search = ({ onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 0) {
      setIsSearching(true);
      const filtered = mockSuggestions.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name);
    setShowSuggestions(false);
    if (onSearchResults) onSearchResults(suggestion);
  };

  const getTypeIcon = (type) => ({ user: '👤', project: '📁', hashtag: '#' }[type] || '🔍');
  const getTypeColor = (type) => ({ user: '#8b0000', project: '#ff3333', hashtag: '#666' }[type] || '#8b0000');

  return (
    <div className="search-container" ref={searchRef}>
      <div className="search-input-wrapper">
        <div className="search-icon">
          {isSearching ? <div className="search-loading"></div> : (
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
      <style jsx>{`
        .search-container { position: relative; width: 100%; max-width: 500px; }
        .search-input-wrapper { position: relative; display: flex; align-items: center; background: rgba(20, 20, 20, 0.9); border: 2px solid #4a5568; border-radius: 8px; transition: all 0.3s ease; }
        .search-input-wrapper:focus-within { border-color: #8b0000; box-shadow: 0 0 20px rgba(139, 0, 0, 0.2); background: rgba(45, 55, 72, 1); }
        .search-icon { padding: 0 15px; color: #8b0000; display: flex; align-items: center; }
        .search-loading { width: 16px; height: 16px; border: 2px solid #4a5568; border-top: 2px solid #8b0000; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .search-input { flex: 1; background: transparent; border: none; padding: 15px 0; color: white; font-family: 'Rajdhani', sans-serif; font-size: 16px; outline: none; }
        .search-input::placeholder { color: #888; }
        .search-shortcut { padding: 0 15px; color: #666; font-size: 12px; font-family: 'Rajdhani', sans-serif; font-weight: 600; }
        .search-suggestions { position: absolute; top: 100%; left: 0; right: 0; background: rgba(10, 10, 10, 0.95); border: 2px solid #8b0000; border-radius: 8px; margin-top: 5px; max-height: 300px; overflow-y: auto; z-index: 1000; backdrop-filter: blur(15px); }
        .search-suggestion { display: flex; align-items: center; padding: 12px 15px; cursor: pointer; transition: background 0.2s ease; border-bottom: 1px solid #333; }
        .search-suggestion:last-child { border-bottom: none; }
        .search-suggestion:hover { background: rgba(139, 0, 0, 0.1); }
        .suggestion-icon { width: 30px; display: flex; align-items: center; justify-content: center; font-size: 16px; margin-right: 12px; }
        .suggestion-content { flex: 1; }
        .suggestion-name { color: white; font-weight: 600; margin-bottom: 2px; }
        .suggestion-subtitle { color: #888; font-size: 14px; }
        .suggestion-type { color: #8b0000; font-size: 12px; text-transform: uppercase; font-weight: 600; letter-spacing: 1px; }
      `}</style>
    </div>
  );
};

export default Search;