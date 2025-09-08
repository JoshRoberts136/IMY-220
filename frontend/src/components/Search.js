import React, { useState, useRef, useEffect } from 'react';
import apiService from '../utils/apiService';
import '../styles.css';

const Search = ({ onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    // Fetch tags and categories for suggestions
    const fetchSuggestionsData = async () => {
      try {
        const [tagsResponse, categoriesResponse] = await Promise.all([
          apiService.getTags(),
          apiService.getCategories()
        ]);

        if (tagsResponse.success) {
          setTags(tagsResponse.data);
        }
        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data);
        }
      } catch (error) {
        console.error('Error fetching suggestions data:', error);
      }
    };

    fetchSuggestionsData();
  }, []);

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
    if (query.length > 0) {
      setIsSearching(true);

      // Generate suggestions from tags and categories
      const tagSuggestions = tags
        .filter(tag => tag.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 3)
        .map(tag => ({
          type: 'hashtag',
          name: `#${tag.name}`,
          subtitle: `${tag.count} posts`
        }));

      const categorySuggestions = categories
        .filter(cat => cat.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 2)
        .map(cat => ({
          type: 'category',
          name: cat,
          subtitle: 'Category'
        }));

      const allSuggestions = [...tagSuggestions, ...categorySuggestions];

      // If we have search results from API, add them
      try {
        if (query.length > 2) { // Only search if query is long enough
          const searchResponse = await apiService.getPosts({ search: query, limit: 3 });
          if (searchResponse.success && searchResponse.data.length > 0) {
            const postSuggestions = searchResponse.data.map(post => ({
              type: 'project',
              name: post.title,
              subtitle: `by ${post.author.username}`,
              post: post
            }));
            allSuggestions.unshift(...postSuggestions);
          }
        }
      } catch (error) {
        console.error('Search error:', error);
      }

      setSuggestions(allSuggestions);
      setShowSuggestions(true);
      setIsSearching(false);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name);
    setShowSuggestions(false);
    if (onSearchResults) {
      // Pass additional context based on suggestion type
      const result = {
        ...suggestion,
        query: suggestion.name,
        type: suggestion.type
      };

      if (suggestion.type === 'hashtag') {
        result.query = suggestion.name.substring(1); // Remove #
        result.searchType = 'tag';
      } else if (suggestion.type === 'category') {
        result.searchType = 'category';
      } else if (suggestion.type === 'project' && suggestion.post) {
        result.postId = suggestion.post._id;
      }

      onSearchResults(result);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'user': return '👤';
      case 'project': return '📁';
      case 'hashtag': return '#';
      case 'category': return '🏷️';
      default: return '🔍';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'user': return '#8b0000';
      case 'project': return '#ff3333';
      case 'hashtag': return '#666';
      case 'category': return '#0066cc';
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
              <div className="suggestion-icon suggestion-icon-dynamic" style={{ color: getTypeColor(suggestion.type) }}>
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