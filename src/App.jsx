import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';

import { Navbar, Feed, VideoDetail, ChannelDetail, SearchFeed, Shorts } from './components/index.js';

const App = () => (
  <BrowserRouter>
    <Box sx={{ backgroundColor: '#09090b', minHeight: '100vh' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/shorts" element={<Shorts />} />
        <Route path="/video/:id" element={<VideoDetail />} />
        <Route path="/channel/:id" element={<ChannelDetail />} />
        <Route path="/search/:searchTerm" element={<SearchFeed />} />
      </Routes>
    </Box>
  </BrowserRouter>
);

export default App;
