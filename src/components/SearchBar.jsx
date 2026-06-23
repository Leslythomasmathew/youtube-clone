import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Box, Paper, List, ListItem, ListItemButton, ListItemText, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MicIcon from '@mui/icons-material/Mic';

const POPULAR_SUGGESTIONS = [
  'JavaScript Mastery',
  'ReactJS Tutorial',
  'NextJS 15 Features',
  'NodeJS Beginner Course',
  'MUI Material UI Crash Course',
  'Python Coding for Beginners',
  'Web Development Roadmap',
  'Lofi Beats for Coding',
  'Data Structures & Algorithms',
  'Machine Learning with Python',
  'CSS Grid & Flexbox Crash Course',
  'Tailwind CSS Tutorial',
  'Vite React App Setup',
  'Redux Toolkit State Management',
  'TypeScript Course',
  'Modern UI Design Patterns',
  'YouTube Clone React',
  'Portfolio Website Tutorial',
  'Vanilla CSS Grid Hacks'
];

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Filter suggestions as search term changes
  useEffect(() => {
    const query = searchTerm.trim();
    if (!query) {
      setSuggestions([]);
      setSelectedIndex(-1);
      return;
    }

    const filtered = POPULAR_SUGGESTIONS.filter(term => 
      term.toLowerCase().includes(query.toLowerCase()) &&
      term.toLowerCase() !== query.toLowerCase()
    ).slice(0, 6); // Limit to top 6 suggestions

    setSuggestions(filtered);
    setSelectedIndex(-1);
  }, [searchTerm]);

  // Click outside detection
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (query) => {
    const trimmed = query.trim();
    if (trimmed) {
      const isUrl = trimmed.startsWith('http://') || 
                    trimmed.startsWith('https://') || 
                    trimmed.includes('.mp4') || 
                    trimmed.includes('.m3u8');
      
      if (isUrl) {
        navigate(`/video/custom?url=${encodeURIComponent(trimmed)}`);
      } else {
        navigate(`/search/${trimmed}`);
      }
      setShowSuggestions(false);
    }
  };

  const onhandleSubmit = (e) => {
    e.preventDefault();
    if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
      const selectedQuery = suggestions[selectedIndex];
      setSearchTerm(selectedQuery);
      handleSearchSubmit(selectedQuery);
    } else {
      handleSearchSubmit(searchTerm);
    }
  };

  const handleKeyDown = (e) => {
    if (!suggestions.length || !showSuggestions) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1 < suggestions.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 >= 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <Box ref={containerRef} sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Box 
        component="form"
        onSubmit={onhandleSubmit}
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: '40px',
          width: { xs: '55vw', sm: '280px', md: '500px' },
        }}
      >
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#121212',
            border: '1px solid #303030',
            borderRadius: '40px 0 0 40px',
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            pl: 2.5,
            pr: 1,
            '&:focus-within': {
              border: '1px solid #ff0055', // Custom brand red border on focus
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4)',
            }
          }}
        >
          <InputBase
            placeholder="Search or paste video URL..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            sx={{
              width: '100%',
              color: '#fff',
              fontSize: '14px',
              fontFamily: "'Roboto', sans-serif"
            }}
          />
        </Box>
        <button
          type="submit"
          style={{
            height: '100%',
            width: '64px',
            backgroundColor: '#222222',
            border: '1px solid #303030',
            borderLeft: 'none',
            borderRadius: '0 40px 40px 0',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            outline: 'none',
            transition: 'background-color 0.15s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#303030'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#222222'}
        >
          <SearchIcon sx={{ fontSize: '20px' }} />
        </button>
      </Box>

      <IconButton 
        sx={{ 
          backgroundColor: '#222222', 
          color: '#fff', 
          width: '40px', 
          height: '40px',
          display: { xs: 'none', sm: 'flex' },
          '&:hover': { backgroundColor: '#303030' } 
        }}
        aria-label="voice search"
      >
        <MicIcon sx={{ fontSize: '20px' }} />
      </IconButton>

      {/* Autocomplete Dropdown suggestions list */}
      {showSuggestions && suggestions.length > 0 && (
        <Paper
          elevation={8}
          sx={{
            position: 'absolute',
            top: '45px',
            left: 0,
            width: { xs: '55vw', sm: '280px', md: '500px' },
            backgroundColor: 'rgba(18, 18, 18, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid #303030',
            borderRadius: '12px',
            zIndex: 1000,
            overflow: 'hidden',
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.5)'
          }}
        >
          <List disablePadding>
            {suggestions.map((suggestion, idx) => {
              const isHighlighted = idx === selectedIndex;
              return (
                <ListItem key={suggestion} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setSearchTerm(suggestion);
                      handleSearchSubmit(suggestion);
                    }}
                    selected={isHighlighted}
                    sx={{
                      py: 1.2,
                      px: 2.5,
                      color: '#fff',
                      backgroundColor: isHighlighted ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      },
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      '&.Mui-selected:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      }
                    }}
                  >
                    <SearchIcon sx={{ fontSize: '18px', color: '#aaaaaa', mr: 2 }} />
                    <ListItemText 
                      primary={suggestion} 
                      primaryTypographyProps={{ 
                        fontSize: '14.5px',
                        fontFamily: "'Roboto', sans-serif"
                      }} 
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default SearchBar;
