import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../utils/apiService';
import '../styles.css';

const Search = ({ onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
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
        const usersList = Array.isArray(usersResult) ? usersResult : (usersResult.users || []);
        
        if (usersList.length > 0) {
          const matchingUsers = usersList
            .filter(user => {
              
              const matchUsername = user.username?.toLowerCase().includes(query.toLowerCase());
              const matchEmail = user.email?.toLowerCase().includes(query.toLowerCase());
              
              return matchUsername || matchEmail;
            })
            .slice(0, 3)
            .map(user => ({
              type: 'user',
              id: user.id,
              name: user.username,
              subtitle: user.profile?.title || user.email,
              avatar: user.profile?.avatar || '👤'
            }));
          
          
          results.push(...matchingUsers);
        }
        
        if (projectsResult.success && projectsResult.projects) {
          const matchingProjects = projectsResult.projects
            .filter(project => {
              const matchName = project.name?.toLowerCase().includes(query.toLowerCase());
              const matchDesc = project.description?.toLowerCase().includes(query.toLowerCase());
              return matchName || matchDesc;
            })
            .slice(0, 3)
            .map(project => ({
              type: 'project',
              id: project.id,
              name: project.name,
              subtitle: project.description || project.language,
              language: project.language
            }));
          
          
          results.push(...matchingProjects);
        }
        
        
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
        
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsSearching(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name);
    setShowSuggestions(false);
    if (suggestion.type === 'user') {
      navigate(`/profile/${suggestion.id}`);
    } else if (suggestion.type === 'project') {
      navigate(`/projects/${suggestion.id}`);
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
              <div className={`suggestion-icon suggestion-icon-${suggestion.type}`}>
                {suggestion.avatar || getTypeIcon(suggestion.type)}
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