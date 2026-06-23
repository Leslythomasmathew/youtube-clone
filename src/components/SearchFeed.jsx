import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { fetchFromAPI } from '../utils/fetchFromAPI.js';
import { Videos } from './index.js';

const SearchFeed = () => {
  const [videos, setVideos] = useState([]);
  const { searchTerm } = useParams();

  useEffect(() => {
    setVideos([]); // clear feed to show loading state
    fetchFromAPI(`search?part=snippet&q=${searchTerm}`)
      .then((data) => {
        if (data && data.items) {
          setVideos(data.items);
        }
      });
  }, [searchTerm]);

  return (
    <Box p={3} sx={{ overflowY: 'auto', height: '90vh', flex: 2, backgroundColor: '#0d0d0d', minHeight: '92vh' }}>
      <Typography 
        variant="h4" 
        fontWeight="bold" 
        mb={3} 
        sx={{ 
          color: 'white',
          fontFamily: "'Outfit', 'Roboto', sans-serif",
          fontSize: { xs: '22px', md: '28px' }
        }}
      >
        Search Results for: <span style={{ color: '#e50914' }}>{searchTerm}</span>
      </Typography>
      <Videos videos={videos} />
    </Box>
  );
};

export default SearchFeed;
