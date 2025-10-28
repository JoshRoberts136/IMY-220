import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../utils/apiService';
import '../styles.css';

// Fuzzy search function - checks if characters match in order
const fuzzyMatch = (str, pattern) => {
  if (!str || !pattern) return false;
  
  str = str.toLowerCase();
  pattern = pattern.toLowerCase();
  
  let patternIdx = 0;
  let strIdx = 0;
  
  while (strIdx < str.length && patternIdx < pattern.length) {
    if (str[strIdx] === pattern[patternIdx]) {
      patternIdx++;
    }
    strIdx++;
  }
  
  return patternIdx === pattern.length;
};

// Calculate fuzzy match score (lower is better)
const fuzzyScore = (str, pattern) => {
  if (!str || !pattern) return Infinity;
  
  str = str.toLowerCase();
  pattern = pattern.toLowerCase();
  
  // Exact match gets best score
  if (str === pattern) return 0;
  
  // Starts with pattern gets good score
  if (str.startsWith(pattern)) return 1;
  
  // Contains pattern gets ok score
  if (str.includes(pattern)) return 2;
  
  // Fuzzy match gets higher score
  if (fuzzyMatch(str, pattern)) {
    const distance = str.length - pattern.length;
    return 3 + distance;
  }
  
  return Infinity;
};

const Search = ({ onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [autocompleteSuggestion, setAutocompleteSuggestion] = useState('');
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

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

  // Handle Tab or Right Arrow to accept autocomplete
  const handleKeyDown = (e) => {
    if (e.key === 'Tab' && autocompleteSuggestion) {
      e.preventDefault();
      setSearchQuery(autocompleteSuggestion);
      setAutocompleteSuggestion('');
    } else if (e.key === 'ArrowRight' && autocompleteSuggestion && 
               inputRef.current.selectionStart === searchQuery.length) {
      e.preventDefault();
      setSearchQuery(autocompleteSuggestion);
      setAutocompleteSuggestion('');
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setAutocompleteSuggestion('');
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.length > 1) {
      setIsSearching(true);
      
      try {
        const [usersResult, projectsResult] = await Promise.all([
          apiService.request('/users'),
          apiService.request('/projects')
        ]);
        
        const results = [];
        const allItems = [];
        
        // Process users
        const usersList = Array.isArray(usersResult) ? usersResult : (usersResult.users || []);
        
        if (usersList.length > 0) {
          usersList.forEach(user => {
            const nameScore = fuzzyScore(user.username || '', query);
            const emailScore = fuzzyScore(user.email || '', query);
            const bestScore = Math.min(nameScore, emailScore);
            
            if (bestScore < Infinity) {
              allItems.push({
                type: 'user',
                id: user.id,
                name: user.username,
                subtitle: user.profile?.title || user.email,
                avatar: user.profile?.avatar || '👤',
                score: bestScore
              });
            }
          });
        }
        
        // Process projects
        if (projectsResult.success && projectsResult.projects) {
          projectsResult.projects.forEach(project => {
            const nameScore = fuzzyScore(project.name || '', query);
            const descScore = fuzzyScore(project.description || '', query);
            const bestScore = Math.min(nameScore, descScore);
            
            if (bestScore < Infinity) {
              allItems.push({
                type: 'project',
                id: project.id,
                name: project.name,
                subtitle: project.description || project.language,
                language: project.language,
                score: bestScore
              });
            }
          });
          
          // Process hashtags from projects
          const hashtags = new Set();
          projectsResult.projects.forEach(project => {
            if (project.hashtags && Array.isArray(project.hashtags)) {
              project.hashtags.forEach(tag => {
                if (fuzzyMatch(tag, query)) {
                  hashtags.add(tag);
                }
              });
            }
          });
          
          hashtags.forEach(tag => {
            const score = fuzzyScore(tag, query);
            if (score < Infinity) {
              allItems.push({
                type: 'hashtag',
                id: tag,
                name: `#${tag}`,
                subtitle: 'Search by tag',
                score: score
              });
            }
          });
        }
        
        // Sort by score (best matches first)
        allItems.sort((a, b) => a.score - b.score);
        
        // Take top 8 results
        const topResults = allItems.slice(0, 8);
        
        setSuggestions(topResults);
        setShowSuggestions(topResults.length > 0);
        
        // Set autocomplete suggestion (best match)
        if (topResults.length > 0 && topResults[0].name.toLowerCase().startsWith(query.toLowerCase())) {
          const completion = topResults[0].name;
          setAutocompleteSuggestion(completion);
        } else {
          setAutocompleteSuggestion('');
        }
        
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
        setAutocompleteSuggestion('');
      } finally {
        setIsSearching(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsSearching(false);
      setAutocompleteSuggestion('');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name);
    setShowSuggestions(false);
    setAutocompleteSuggestion('');
    
    if (suggestion.type === 'user') {
      navigate(`/profile/${suggestion.id}`);
    } else if (suggestion.type === 'project') {
      navigate(`/projects/${suggestion.id}`);
    } else if (suggestion.type === 'hashtag') {
      // TODO: Navigate to hashtag search results
      console.log('Search by hashtag:', suggestion.name);
    }
    
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
        <div style={{ position: 'relative', flex: 1 }}>
          {/* Autocomplete suggestion (grayed out) */}
          {autocompleteSuggestion && searchQuery && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              padding: '15px 0',
              color: 'rgba(136, 136, 136, 0.5)',
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: '16px',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              overflow: 'hidden'
            }}>
              <span style={{ opacity: 0 }}>{searchQuery}</span>
              {autocompleteSuggestion.slice(searchQuery.length)}
            </div>
          )}
          <input
            ref={inputRef}
            type="text"
            placeholder="Search legends, projects, or hashtags..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="search-input"
            style={{ background: 'transparent', position: 'relative', zIndex: 1 }}
          />
        </div>
        <div className="search-shortcut">
          {autocompleteSuggestion ? 'Tab →' : 'Ctrl+K'}
        </div>
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div className="search-suggestions">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="search-suggestion"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className={`suggestion-icon suggestion-icon-${suggestion.type}`}>
                {suggestion.avatar || getTypeIcon(suggestion.type)}
              </div>
              <div className="suggestion-content">
                <div className="suggestion-name">{suggestion.name}</div>
                <div className="suggestion-subtitle">{suggestion.subtitle}</div>
              </div>
              <div className="suggestion-type" style={{
                fontSize: '12px',
                color: '#666',
                textTransform: 'uppercase',
                fontWeight: '600'
              }}>
                {suggestion.type}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
